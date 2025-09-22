const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Check content container classes
  const contentContainer = await page.$('section#home > div:last-child');
  if (contentContainer) {
    const classes = await contentContainer.getAttribute('class');
    console.log('Content container classes:', classes);
  }

  // Check the inner container classes
  const innerContainer = await page.$('section#home .container');
  if (innerContainer) {
    const innerClasses = await innerContainer.getAttribute('class');
    console.log('Inner container classes:', innerClasses);
  }

  // Check flex container classes
  const flexContainer = await page.$('section#home .flex.flex-col');
  if (flexContainer) {
    const flexClasses = await flexContainer.getAttribute('class');
    console.log('Flex container classes:', flexClasses);
  }

  await browser.close();
})();