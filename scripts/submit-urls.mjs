import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_FILE = path.join(__dirname, '../google-service-account.json');
const BASE_URL = 'https://cheng-zi-ai.com';

async function submitUrls() {
  if (!fs.existsSync(KEY_FILE)) {
    console.error('ERROR: google-service-account.json not found!');
    process.exit(1);
  }

  // Authenticate
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const indexing = google.indexing({
    version: 'v3',
    auth: auth,
  });

  const urlsToSubmit = [];

  // Read guides
  const guideLangs = ['zh', 'en'];
  for (const lang of guideLangs) {
    const dirPath = path.join(__dirname, `../src/content/guides/${lang}`);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          urlsToSubmit.push(`${BASE_URL}/${lang}/guides/${slug}`);
        }
      }
    }
  }

  // Also submit index and product pages just in case
  urlsToSubmit.push(`${BASE_URL}/zh`);
  urlsToSubmit.push(`${BASE_URL}/en`);
  urlsToSubmit.push(`${BASE_URL}/zh/products`);
  urlsToSubmit.push(`${BASE_URL}/zh/api-service`);

  console.log(`Found ${urlsToSubmit.length} URLs to submit.`);

  for (const url of urlsToSubmit) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`SUCCESS: Submitted ${url}`);
    } catch (error) {
      console.error(`FAILED: ${url}`, error.message);
    }
  }
}

submitUrls().catch(console.error);
