import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_FILE = path.join(__dirname, '../google-service-account.json');
const BASE_URL = 'https://cheng-zi-ai.com';
const HOST = 'cheng-zi-ai.com';
const INDEXNOW_KEY = 'chengziai2026indexnowkey';
const INDEXNOW_KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

function extractDateFromMarkdown(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
    return match ? match[1] : '2026-01-01';
  } catch {
    return '2026-01-01';
  }
}

function collectUrls() {
  const coreUrls = [
    `${BASE_URL}/zh`,
    `${BASE_URL}/en`,
    `${BASE_URL}/zh/products`,
    `${BASE_URL}/en/products`,
    `${BASE_URL}/zh/guides`,
    `${BASE_URL}/en/guides`,
    `${BASE_URL}/llms.txt`,
    `${BASE_URL}/llms-full.txt`,
  ];

  const productUrls = [];
  const zhProductsDir = path.join(__dirname, '../src/content/products/zh');
  if (fs.existsSync(zhProductsDir)) {
    const prodFiles = fs.readdirSync(zhProductsDir).filter((f) => f.endsWith('.json'));
    const products = prodFiles
      .map((file) => {
        const data = JSON.parse(fs.readFileSync(path.join(zhProductsDir, file), 'utf-8'));
        return data;
      })
      .filter((p) => p.inStock !== false)
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

    for (const p of products) {
      productUrls.push(`${BASE_URL}/zh/products/${p.id}`);
      productUrls.push(`${BASE_URL}/en/products/${p.id}`);
    }
  }

  const guideEntries = [];
  const guideLangs = ['zh', 'en'];
  for (const lang of guideLangs) {
    const dirPath = path.join(__dirname, `../src/content/guides/${lang}`);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        const slug = file.replace('.md', '');
        const fullPath = path.join(dirPath, file);
        const date = extractDateFromMarkdown(fullPath);
        guideEntries.push({
          url: `${BASE_URL}/${lang}/guides/${slug}`,
          date,
        });
      }
    }
  }

  guideEntries.sort((a, b) => b.date.localeCompare(a.date));
  const guideUrls = guideEntries.map((g) => g.url);

  return {
    allUrls: [...coreUrls, ...productUrls, ...guideUrls],
    coreUrls,
    productUrls,
    guideEntries,
  };
}

async function syncClockWithServer() {
  try {
    const realNow = Date.now.bind(Date);
    const res = await fetch('https://www.bing.com', { method: 'HEAD' });
    const serverDateStr = res.headers.get('date');
    if (serverDateStr) {
      const serverTime = new Date(serverDateStr).getTime();
      const localTime = realNow();
      const offsetMs = serverTime - localTime;
      if (Math.abs(offsetMs) > 60_000) {
        console.log(
          `[Clock Sync] Local clock differs from network UTC date (${serverDateStr}). Applying offset for OAuth JWT signing.`
        );
        Date.now = () => realNow() + offsetMs;
      }
    }
  } catch (err) {
    console.warn('[Clock Sync] Could not fetch server date header:', err.message);
  }
}

async function submitToIndexNow(urlList) {
  console.log(`\n=== 1. Submitting ${urlList.length} URLs to Bing / IndexNow ===`);

  try {
    const keyRes = await fetch(INDEXNOW_KEY_LOCATION);
    const keyText = (await keyRes.text()).trim();
    console.log(
      `Checking live key file [${INDEXNOW_KEY_LOCATION}] -> HTTP ${keyRes.status} (body: "${keyText.slice(0, 60)}")`
    );
  } catch (err) {
    console.warn(`Could not verify live key file: ${err.message}`);
  }

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList,
  };

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const bodyText = await res.text();
      console.log(
        `IndexNow [${endpoint}] -> HTTP ${res.status} ${res.statusText}${bodyText ? ` | ${bodyText}` : ''}`
      );
    } catch (err) {
      console.error(`IndexNow FAILED [${endpoint}]:`, err.message);
    }
  }
}

async function submitToGoogleIndexing(prioritizedUrls) {
  console.log(`\n=== 2. Submitting URLs to Google Search Console Indexing API ===`);
  if (!fs.existsSync(KEY_FILE)) {
    console.error('ERROR: google-service-account.json not found!');
    return;
  }

  await syncClockWithServer();

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const indexing = google.indexing({
    version: 'v3',
    auth,
  });

  let successCount = 0;
  let failCount = 0;

  for (const url of prioritizedUrls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: 'URL_UPDATED',
        },
      });
      successCount++;
      console.log(`[GSC #${successCount}] SUCCESS: ${url}`);
    } catch (error) {
      failCount++;
      console.error(`[GSC FAIL] ${url}: ${error.message}`);
      if (
        error.message &&
        (error.message.includes('Quota exceeded') || error.message.includes('Invalid JWT Signature'))
      ) {
        console.warn(`Stopping GSC loop early due to: ${error.message}`);
        break;
      }
    }
  }

  console.log(`\nGSC Indexing Summary: ${successCount} succeeded, ${failCount} failed.`);
}

async function main() {
  const { allUrls, coreUrls, productUrls, guideEntries } = collectUrls();
  console.log(
    `Collected ${allUrls.length} total URLs (${coreUrls.length} core + ${productUrls.length} products + ${guideEntries.length} guides).`
  );

  await submitToIndexNow(allUrls);
  await submitToGoogleIndexing(allUrls);
}

main().catch(console.error);
