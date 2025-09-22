const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bergbautechnik-cham.de/quote.html');
  await page.waitForLoadState('networkidle');

  // Check form structure
  const form = await page.$('form');
  if (form) {
    console.log('Form found');

    // Check for labels
    const labels = await page.$$('label');
    console.log('Number of labels found:', labels.length);

    // Check for inputs
    const inputs = await page.$$('input, select, textarea');
    console.log('Number of form inputs found:', inputs.length);

    // Get form HTML structure
    const formHTML = await form.innerHTML();
    console.log('Form HTML (first 500 chars):', formHTML.substring(0, 500));
  } else {
    console.log('No form found');
  }

  await browser.close();
})();