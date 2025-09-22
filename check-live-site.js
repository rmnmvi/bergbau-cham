const { chromium } = require('playwright');

(async () => {
  console.log('🌐 Launching browser to check https://www.bergbautechnik-cham.de');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to the live site
    console.log('📡 Navigating to live site...');
    await page.goto('https://www.bergbautechnik-cham.de', { 
      waitUntil: 'networkidle',
      timeout: 20000 
    });
    
    // Check page title
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Check if hero content is showing properly (not template variables)
    const heroTitle = await page.locator('h1').first().textContent();
    console.log('🎯 Hero title:', heroTitle?.substring(0, 100) + '...');
    
    // Check if template variables are still showing
    const bodyText = await page.textContent('body');
    const hasTemplateVars = bodyText.includes('{{{') || bodyText.includes('{{');
    console.log('🔍 Has template variables showing as text:', hasTemplateVars);
    
    if (hasTemplateVars) {
      console.log('⚠️ Template variables found in page content!');
    }
    
    // Check navigation
    const navLinks = await page.locator('nav a').allTextContents();
    console.log('🧭 Navigation links:', navLinks);
    
    // Check if CSS is loading properly
    const headerBg = await page.locator('header').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    console.log('🎨 Header background:', headerBg);
    
    // Check company name/branding
    const logoAlt = await page.locator('img[alt*="Logo"]').first().getAttribute('alt');
    console.log('🏢 Logo alt text:', logoAlt);
    
    // Check if quote button exists
    const quoteButton = await page.locator('a[href*="quote"]').first().textContent();
    console.log('📋 Quote button text:', quoteButton);
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'live-site-screenshot.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved as live-site-screenshot.png');
    
    // Check quote page if accessible
    try {
      console.log('🔗 Checking quote page...');
      await page.click('a[href*="quote"]', { timeout: 5000 });
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      const quotePageTitle = await page.title();
      console.log('📋 Quote page title:', quotePageTitle);
      
      // Check if it's still about precious metals or changed to mining equipment
      const pageContent = await page.textContent('body');
      const hasPreciousMetals = pageContent.toLowerCase().includes('precious metal') || 
                               pageContent.toLowerCase().includes('gold') ||
                               pageContent.toLowerCase().includes('silver');
      const hasMiningEquipment = pageContent.toLowerCase().includes('mining equipment') ||
                                pageContent.toLowerCase().includes('excavator') ||
                                pageContent.toLowerCase().includes('bulldozer');
      
      console.log('🏅 Has precious metals content:', hasPreciousMetals);
      console.log('⚒️ Has mining equipment content:', hasMiningEquipment);
      
      // Check form fields
      const selectElement = await page.locator('select').first();
      if (selectElement) {
        const options = await selectElement.locator('option').allTextContents();
        console.log('📝 Form options (first 3):', options.slice(0, 3));
      }
      
    } catch (e) {
      console.log('⚠️ Could not access quote form:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Error checking live site:', error.message);
  } finally {
    await browser.close();
    console.log('✅ Browser closed');
  }
})();
