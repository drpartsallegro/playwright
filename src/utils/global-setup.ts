import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to eBay and accept cookies to set up global state
  await page.goto('https://www.ebay.com/');
  
  try {
    const acceptButton = page.locator('button:has-text("Accept"), button:has-text("Accept all")');
    if (await acceptButton.isVisible({ timeout: 3000 })) {
      await acceptButton.first().click();
    }
  } catch (error) {
    console.log('No cookie dialog found during global setup');
  }
  
  await browser.close();
}

export default globalSetup; 