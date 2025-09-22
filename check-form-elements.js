const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bergbautechnik-cham.de/quote.html');
  await page.waitForLoadState('networkidle');

  // Check manufacturer field
  const manufacturerField = await page.$('select[name*="purity"], select[name*="manufacturer"]');
  if (manufacturerField) {
    const manufacturerLabel = await page.$('label[for*="purity"], label[for*="manufacturer"]');
    if (manufacturerLabel) {
      const labelText = await manufacturerLabel.textContent();
      console.log('Manufacturer field label:', labelText.trim());
    }
    const options = await page.$$eval('select[name*="purity"] option, select[name*="manufacturer"] option',
      opts => opts.map(opt => opt.textContent.trim()));
    console.log('Manufacturer options:', options);
  }

  // Check units field
  const unitsField = await page.$('select[name*="unit"]');
  if (unitsField) {
    const unitsOptions = await page.$$eval('select[name*="unit"] option',
      opts => opts.map(opt => opt.textContent.trim()));
    console.log('Units options:', unitsOptions);
  }

  // Check for trading procedures checkbox
  const procedureCheckbox = await page.$('input[type="checkbox"][name*="procedure"], input[type="checkbox"][name*="agreement"]');
  if (procedureCheckbox) {
    const checkboxLabel = await page.evaluate(() => {
      const checkbox = document.querySelector('input[type="checkbox"][name*="procedure"], input[type="checkbox"][name*="agreement"]');
      if (checkbox) {
        const label = checkbox.closest('label') || document.querySelector(`label[for="${checkbox.id}"]`);
        return label ? label.textContent.trim() : 'No label found';
      }
      return 'Checkbox not found';
    });
    console.log('Trading procedures checkbox found:', checkboxLabel);
  } else {
    console.log('No trading procedures checkbox found');
  }

  await browser.close();
})();