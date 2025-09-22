const { chromium } = require('playwright');

async function debugNetwork() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const requests = [];
  const responses = [];

  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType()
    });
  });

  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers()
    });
  });

  console.log('Loading website and monitoring network...');
  await page.goto('https://bergbau-cham-dgb4yxqop-romans-projects-c2b394d4.vercel.app');
  await page.waitForTimeout(5000);

  console.log('\n=== STYLESHEET REQUESTS ===');
  const cssRequests = requests.filter(req =>
    req.url.includes('.css') || req.resourceType === 'stylesheet'
  );
  cssRequests.forEach(req => {
    console.log(`${req.method} ${req.url}`);
  });

  console.log('\n=== STYLESHEET RESPONSES ===');
  const cssResponses = responses.filter(res =>
    res.url.includes('.css') || res.url.includes('styles')
  );
  cssResponses.forEach(res => {
    console.log(`${res.status} ${res.url}`);
  });

  console.log('\n=== ALL RESPONSES ===');
  responses.forEach(res => {
    if (res.url.includes('bergbau-cham')) {
      console.log(`${res.status} ${res.url}`);
    }
  });

  await browser.close();
}

debugNetwork().catch(console.error);