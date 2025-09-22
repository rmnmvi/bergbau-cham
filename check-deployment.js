const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Checking deployment files...');
    await page.goto('https://bergbau-cham.vercel.app', { waitUntil: 'networkidle' });

    // Check what CSS file is being requested
    page.on('response', response => {
      if (response.url().includes('.css')) {
        console.log('CSS request:', response.url(), 'Status:', response.status());
      }
    });

    // Check the HTML source for CSS links
    const cssLinks = await page.$$eval('link[rel="stylesheet"]', links =>
      links.map(link => link.href)
    );
    console.log('CSS links found:', cssLinks);

    // Try to access styles.css directly
    const cssResponse = await page.goto('https://bergbau-cham.vercel.app/styles.css');
    console.log('Direct CSS access status:', cssResponse.status());

    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();