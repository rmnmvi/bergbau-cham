const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Check hero styling
  const heroTitle = await page.$('h1');
  const titleStyles = await heroTitle.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      color: computed.color,
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      textAlign: computed.textAlign
    };
  });
  console.log('Hero title styles:', titleStyles);

  // Check CTA button styling
  const ctaButton = await page.$('a[href="#contact"]');
  if (ctaButton) {
    const ctaStyles = await ctaButton.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        padding: computed.padding,
        display: computed.display
      };
    });
    console.log('CTA button styles:', ctaStyles);
  }

  // Check if CSS is loaded
  const cssLinks = await page.$$eval('link[rel="stylesheet"]', links =>
    links.map(link => ({ href: link.href, loaded: !link.sheet ? false : link.sheet.cssRules.length > 0 }))
  );
  console.log('CSS files:', cssLinks);

  await browser.close();
})();