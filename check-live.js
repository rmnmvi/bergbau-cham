const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Check hero title
  const heroTitle = await page.textContent('h1');
  console.log('Hero title:', heroTitle);

  // Check navigation
  const navItems = await page.$$eval('nav a', els => els.map(el => el.textContent.trim()));
  console.log('Navigation items:', navItems);

  // Check for any remaining template variables
  const bodyText = await page.textContent('body');
  const templateVars = bodyText.match(/\{\{\{?[^}]+\}\}\}?/g);
  if (templateVars) {
    console.log('Found template variables:', templateVars);
  } else {
    console.log('No template variables found - content is properly processed');
  }

  await browser.close();
})();