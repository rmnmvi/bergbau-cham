const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Verifying https://www.bergbautechnik-cham.de with Playwright');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to the live site
    await page.goto('https://www.bergbautechnik-cham.de', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    console.log('✅ Site loaded successfully');
    
    // Check page title
    const title = await page.title();
    console.log('📄 Title:', title);
    
    // Check if template variables are still visible in the content
    const pageContent = await page.textContent('body');
    
    // Check for template variables
    const hasTripleBraces = pageContent.includes('{{{');
    const hasDoubleBraces = pageContent.includes('{{');
    const hasTemplateVars = hasTripleBraces || hasDoubleBraces;
    
    console.log('🔍 Template variable check:');
    console.log('  - Has {{{ variables:', hasTripleBraces);
    console.log('  - Has {{ variables:', hasDoubleBraces);
    console.log('  - Overall has template vars:', hasTemplateVars);
    
    if (hasTemplateVars) {
      console.log('❌ ISSUE: Template variables still showing on live site!');
      
      // Find specific template variables that are still showing
      const templateVarRegex = /\{\{\{?[^}]+\}\}\}?/g;
      const matches = pageContent.match(templateVarRegex);
      if (matches) {
        console.log('📋 Found template variables:', matches.slice(0, 10));
      }
    } else {
      console.log('✅ SUCCESS: No template variables found - content is properly processed!');
    }
    
    // Check specific content areas
    const heroTitle = await page.locator('h1').first().textContent();
    console.log('🎯 Hero title:', heroTitle?.substring(0, 80) + '...');
    
    // Check navigation links
    const navLinks = await page.locator('nav a').allTextContents();
    console.log('🧭 Navigation:', navLinks.filter(link => link.trim()));
    
    // Check if it's about mining equipment
    const isMiningEquipment = pageContent.toLowerCase().includes('mining equipment') || 
                             pageContent.toLowerCase().includes('excavator');
    const isPreciousMetals = pageContent.toLowerCase().includes('precious metal') || 
                            pageContent.toLowerCase().includes('edelmetall');
    
    console.log('⚒️ Contains mining equipment content:', isMiningEquipment);
    console.log('🏅 Contains precious metals content:', isPreciousMetals);
    
    // Check quote page
    try {
      console.log('\n📋 Checking quote page...');
      await page.click('a[href*="quote"]', { timeout: 5000 });
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      const quoteTitle = await page.title();
      console.log('📋 Quote page title:', quoteTitle);
      
      const quoteContent = await page.textContent('body');
      const hasQuoteTemplateVars = quoteContent.includes('{{') || quoteContent.includes('{{{');
      console.log('📝 Quote page has template vars:', hasQuoteTemplateVars);
      
      // Check if form is adapted for mining equipment
      const isEquipmentForm = quoteContent.toLowerCase().includes('equipment type') ||
                             quoteContent.toLowerCase().includes('excavator') ||
                             quoteContent.toLowerCase().includes('manufacturer');
      const isMetalsForm = quoteContent.toLowerCase().includes('commodity') ||
                          quoteContent.toLowerCase().includes('purity') ||
                          quoteContent.toLowerCase().includes('gold');
      
      console.log('⚙️ Form adapted for equipment:', isEquipmentForm);
      console.log('🏅 Form still about metals:', isMetalsForm);
      
    } catch (e) {
      console.log('⚠️ Could not check quote page:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
