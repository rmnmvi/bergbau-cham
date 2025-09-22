const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Get the CTA button HTML
  const ctaButton = await page.$('a[href="#contact"]');
  if (ctaButton) {
    const ctaHTML = await ctaButton.innerHTML();
    const ctaOuterHTML = await ctaButton.evaluate(el => el.outerHTML);
    console.log('CTA button HTML:', ctaOuterHTML);
  } else {
    console.log('CTA button not found');
  }

  await browser.close();
})();