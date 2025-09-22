const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Take screenshot of hero section
  await page.screenshot({
    path: 'hero-section.png',
    clip: { x: 0, y: 0, width: 1200, height: 800 }
  });
  console.log('Screenshot saved as hero-section.png');

  await browser.close();
})();