const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Testing live deployment...');
    await page.goto('https://bergbau-cham.vercel.app', { waitUntil: 'networkidle' });

    // Check if CSS is loaded
    const headerBg = await page.evaluate(() => {
      const header = document.querySelector('header');
      return window.getComputedStyle(header).backgroundColor;
    });

    console.log('Header background color:', headerBg);

    // Check if Tailwind classes are working
    const goldElements = await page.$$eval('[class*="gold"]', elements => elements.length);
    console.log('Elements with gold classes:', goldElements);

    // Take a screenshot
    await page.screenshot({ path: 'deployment-test.png', fullPage: true });
    console.log('Screenshot saved as deployment-test.png');

    // Wait a moment to see the page
    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('Error testing deployment:', error);
  } finally {
    await browser.close();
  }
})();