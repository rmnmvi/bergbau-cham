const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Check hero section styling
  const heroSection = await page.$('section#home');
  if (heroSection) {
    const heroStyles = await heroSection.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        height: computed.height,
        display: computed.display
      };
    });
    console.log('Hero section styles:', heroStyles);
  }

  // Check content container styling
  const contentContainer = await page.$('section#home > div:last-child');
  if (contentContainer) {
    const containerStyles = await contentContainer.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        height: computed.height,
        display: computed.display,
        alignItems: computed.alignItems,
        justifyContent: computed.justifyContent
      };
    });
    console.log('Content container styles:', containerStyles);
  }

  // Check header height - might be affecting layout
  const header = await page.$('header');
  if (header) {
    const headerStyles = await header.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        height: computed.height,
        zIndex: computed.zIndex
      };
    });
    console.log('Header styles:', headerStyles);
  }

  await browser.close();
})();