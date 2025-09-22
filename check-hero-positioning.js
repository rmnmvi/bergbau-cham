const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Check hero text positioning
  const heroTitle = await page.$('h1');
  const heroDescription = await page.$('section#home p');
  const ctaButton = await page.$('a:has-text("Get in touch")');

  if (heroTitle) {
    const titleBounds = await heroTitle.boundingBox();
    console.log('Hero title position:', titleBounds);
  }

  if (heroDescription) {
    const descBounds = await heroDescription.boundingBox();
    console.log('Hero description position:', descBounds);
  }

  if (ctaButton) {
    const ctaBounds = await ctaButton.boundingBox();
    console.log('CTA button position:', ctaBounds);
  }

  // Check hero section structure
  const heroSection = await page.$('section#home');
  if (heroSection) {
    const heroHTML = await heroSection.evaluate(el => {
      const content = el.querySelector('.container');
      return content ? content.innerHTML.substring(0, 1000) + '...' : 'No container found';
    });
    console.log('Hero section HTML structure:', heroHTML);
  }

  await browser.close();
})();