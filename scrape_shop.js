const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Try to bypass basic anti-bot by pretending to be a real Chrome
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
  
  console.log('Navigating to shop...');
  try {
    // Only wait for DOM to load, not network to be idle
    await page.goto('https://pay.ldxp.cn/shop/YINGWULUO', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Wait for 5 seconds to let any javascript render the page
    await new Promise(r => setTimeout(r, 5000));
    
    const products = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync('scraped_shop.txt', products);
    console.log('Scraped shop text content!');
    
    await page.screenshot({ path: 'shop_screenshot.png', fullPage: true });
  } catch (e) {
    console.log('Error during navigation:', e);
    // Take a screenshot to see what blocked us
    await page.screenshot({ path: 'shop_screenshot.png', fullPage: true });
  }

  await browser.close();
})();
