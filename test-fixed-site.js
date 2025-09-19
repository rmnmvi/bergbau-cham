const { chromium } = require('playwright');

async function testFixedSite() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Testing fixed website...');
  await page.goto('https://bergbau-cham-i301hjzb7-romans-projects-c2b394d4.vercel.app');

  // Wait for page to load
  await page.waitForTimeout(3000);

  // Check if CSS is loaded by looking for styled elements
  const hasStyles = await page.evaluate(() => {
    const hero = document.querySelector('section#home');
    if (!hero) return false;

    const computedStyle = window.getComputedStyle(hero);
    return computedStyle.height !== 'auto' && computedStyle.position === 'relative';
  });

  console.log('CSS styles applied:', hasStyles);

  // Check if the hero text is white (indicating CSS is working)
  const heroTextColor = await page.evaluate(() => {
    const heroTitle = document.querySelector('section#home h1');
    if (!heroTitle) return null;

    const computedStyle = window.getComputedStyle(heroTitle);
    return computedStyle.color;
  });

  console.log('Hero title color:', heroTextColor);

  // Check for specific CSS classes
  const hasNavigation = await page.evaluate(() => {
    const nav = document.querySelector('header nav');
    return nav !== null;
  });

  console.log('Navigation found:', hasNavigation);

  await browser.close();
}

testFixedSite().catch(console.error);