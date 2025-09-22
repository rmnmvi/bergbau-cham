const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Check all hero elements positioning
  const heroSection = await page.$('section#home');
  const contentContainer = await page.$('section#home > div:last-child');
  const innerContainer = await page.$('section#home .container');

  if (heroSection) {
    const bounds = await heroSection.boundingBox();
    console.log('Hero section bounds:', bounds);
  }

  if (contentContainer) {
    const bounds = await contentContainer.boundingBox();
    const styles = await contentContainer.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        height: computed.height,
        display: computed.display,
        alignItems: computed.alignItems,
        flexDirection: computed.flexDirection
      };
    });
    console.log('Content container bounds:', bounds);
    console.log('Content container computed styles:', styles);
  }

  if (innerContainer) {
    const bounds = await innerContainer.boundingBox();
    console.log('Inner container bounds:', bounds);
  }

  // Compare with working edelmetallhandel site
  await page.goto('https://www.edelmetallhandel-cham.de');
  await page.waitForLoadState('networkidle');

  const workingContentContainer = await page.$('section#home > div:last-child');
  if (workingContentContainer) {
    const workingBounds = await workingContentContainer.boundingBox();
    const workingStyles = await workingContentContainer.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        height: computed.height,
        display: computed.display,
        alignItems: computed.alignItems
      };
    });
    console.log('Working site content container bounds:', workingBounds);
    console.log('Working site computed styles:', workingStyles);
  }

  await browser.close();
})();