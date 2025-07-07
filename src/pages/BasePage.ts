import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'load', timeout: 60000 });
  }

  async waitForElement(locator: Locator, timeout = 10000) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      console.log(`Element not found within ${timeout}ms: ${locator}`);
      throw error;
    }
  }

  async clickElement(locator: Locator) {
    await this.waitForElement(locator);
    await locator.click();
  }

  async fillInput(locator: Locator, text: string) {
    await this.waitForElement(locator);
    await locator.fill(text);
  }

  async expectElementToBeVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectElementToHaveText(locator: Locator, text: string) {
    await expect(locator).toHaveText(text);
  }

  async scrollIntoView(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async acceptCookies() {
    try {
      const acceptButton = this.page.locator('button:has-text("Accept"), button:has-text("Accept all")');
      if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.first().click();
      }
    } catch (error) {
      console.log('No cookie dialog found or already accepted');
    }
  }
} 