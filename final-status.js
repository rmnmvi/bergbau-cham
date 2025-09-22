const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('=== FINAL DEPLOYMENT STATUS ===');
    await page.goto('https://bergbau-cham.vercel.app', { waitUntil: 'networkidle' });

    // Check CSS link in HTML
    const cssLink = await page.$eval('link[rel="stylesheet"]', link => link.href);
    console.log('CSS link in HTML:', cssLink);

    // Check if CSS loads
    const cssResponse = await page.goto(cssLink);
    console.log('CSS file status:', cssResponse.status());
    console.log('CSS file size:', (await cssResponse.text()).length, 'characters');

    // Go back to main page
    await page.goto('https://bergbau-cham.vercel.app');

    // Check if styles are applied
    const headerBg = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? window.getComputedStyle(header).backgroundColor : 'no header found';
    });
    console.log('Header background:', headerBg);

    // Check title
    const title = await page.title();
    console.log('Page title:', title);

    console.log('\n=== SUMMARY ===');
    if (headerBg === 'rgb(0, 0, 0)' || headerBg === 'rgba(0, 0, 0, 1)') {
      console.log('✅ CSS is working correctly!');
    } else {
      console.log('❌ CSS is still not loading properly');
      console.log('The CSS file exists and loads, but styles are not being applied to elements');
    }

    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();