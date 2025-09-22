const { chromium } = require('playwright');

async function testFinalDeployment() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Testing final deployment...');
  await page.goto('https://bergbau-cham-dgb4yxqop-romans-projects-c2b394d4.vercel.app');

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

  // Check for background styling
  const hasBackground = await page.evaluate(() => {
    const hero = document.querySelector('section#home');
    if (!hero) return false;

    const computedStyle = window.getComputedStyle(hero);
    return computedStyle.backgroundImage !== 'none' || computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)';
  });

  console.log('Background styling applied:', hasBackground);

  // Check if partners section exists and is styled
  const partnersVisible = await page.evaluate(() => {
    const partners = document.querySelector('#partners');
    if (!partners) return false;

    const partnerBoxes = partners.querySelectorAll('.bg-white');
    return partnerBoxes.length > 0;
  });

  console.log('Partners section styled:', partnersVisible);

  // Take a screenshot
  await page.screenshot({ path: 'final-deployment-test.png', fullPage: true });

  await browser.close();

  // Summary
  const isWorking = hasStyles && heroTextColor && hasBackground && partnersVisible;
  console.log('\n=== FINAL TEST RESULT ===');
  console.log('Website CSS is working:', isWorking ? '✅ YES' : '❌ NO');

  return isWorking;
}

testFinalDeployment().catch(console.error);