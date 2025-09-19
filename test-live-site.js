const { chromium } = require('playwright');

async function testLiveSite() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Testing live website...');
  await page.goto('https://bergbau-cham-jxpei5y40-romans-projects-c2b394d4.vercel.app');

  // Wait for page to load
  await page.waitForTimeout(3000);

  // Check if CSS is loaded by looking for styled elements
  const hasStyles = await page.evaluate(() => {
    const hero = document.querySelector('section#home');
    if (!hero) return false;

    const computedStyle = window.getComputedStyle(hero);
    return computedStyle.height !== 'auto' && computedStyle.position === 'relative';
  });

  console.log('CSS styles applied:', hasStyles);

  // Check for CSS file loading
  const cssRequests = [];
  page.on('response', response => {
    if (response.url().includes('.css')) {
      cssRequests.push({
        url: response.url(),
        status: response.status()
      });
    }
  });

  // Reload to catch CSS requests
  await page.reload();
  await page.waitForTimeout(2000);

  console.log('CSS requests:', cssRequests);

  // Take a screenshot
  await page.screenshot({ path: 'live-site-screenshot.png', fullPage: true });

  await browser.close();
}

testLiveSite().catch(console.error);