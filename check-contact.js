const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bergbautechnik-cham.de');
  await page.waitForLoadState('networkidle');

  // Check contact section
  const contactSection = await page.$('#contact');
  if (contactSection) {
    console.log('Contact section found');

    // Look for contact info
    const contactInfo = await page.$$eval('#contact *', els =>
      els.filter(el => el.textContent.includes('Cham') ||
                      el.textContent.includes('Germany') ||
                      el.textContent.includes('+49') ||
                      el.textContent.includes('info@')).map(el => el.textContent.trim())
    );
    console.log('Contact info found:', contactInfo);
  } else {
    console.log('Contact section not found');
  }

  // Check footer
  const footer = await page.$('footer');
  if (footer) {
    const footerText = await footer.textContent();
    console.log('Footer content:', footerText.trim());
  }

  await browser.close();
})();