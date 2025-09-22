const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Get ALL links with href="#contact"
  const ctaLinks = await page.$$('a[href="#contact"]');
  console.log(`Found ${ctaLinks.length} links with href="#contact"`);

  for (let i = 0; i < ctaLinks.length; i++) {
    const link = ctaLinks[i];
    const outerHTML = await link.evaluate(el => el.outerHTML);
    const text = await link.textContent();
    console.log(`Link ${i + 1}: "${text.trim()}"`);
    console.log(`HTML: ${outerHTML}`);
    console.log('---');
  }

  // Also check for "Get in touch" text
  const getInTouchLinks = await page.$$('text="Get in touch"');
  console.log(`Found ${getInTouchLinks.length} "Get in touch" elements`);

  if (getInTouchLinks.length > 0) {
    const getInTouchHTML = await getInTouchLinks[0].evaluate(el => el.outerHTML);
    console.log('Get in touch HTML:', getInTouchHTML);
  }

  await browser.close();
})();