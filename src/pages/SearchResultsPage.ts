import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  readonly searchResults: Locator;
  readonly paginationNext: Locator;
  readonly buyItNowFilter: Locator;
  readonly freeShippingFilter: Locator;
  readonly priceRangeFilter: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.searchResults = page.locator('.srp-results');
    this.paginationNext = page.locator('a[aria-label*="page 2"], a:has-text("2")');
    this.buyItNowFilter = page.locator('span:text("Buy It Now")');
    this.freeShippingFilter = page.locator('span:text("Free Returns")');
    this.priceRangeFilter = page.locator('input[placeholder*="Min"], input[placeholder*="Max"]');
    this.sortDropdown = page.locator('#gh-sort');
  }

  async waitForResults() {
    await this.waitForElement(this.searchResults);
  }

  async goToNextPage() {
    try {
      await this.clickElement(this.paginationNext);
      await this.page.waitForLoadState('networkidle');
      return true;
    } catch (error) {
      console.log('Pagination not available or failed');
      return false;
    }
  }

  async applyBuyItNowFilter() {
    try {
      await this.scrollIntoView(this.buyItNowFilter);
      await this.clickElement(this.buyItNowFilter);
      await this.page.waitForLoadState('networkidle');
      return true;
    } catch (error) {
      console.log('Buy It Now filter not available');
      return false;
    }
  }

  async applyFreeShippingFilter() {
    try {
      await this.scrollIntoView(this.freeShippingFilter);
      await this.clickElement(this.freeShippingFilter);
      await this.page.waitForLoadState('networkidle');
      return true;
    } catch (error) {
      console.log('Free Shipping filter not available');
      return false;
    }
  }

  async sortByPrice(sortOrder: 'asc' | 'desc') {
    try {
      await this.clickElement(this.sortDropdown);
      const option = this.page.locator(`option[value*="${sortOrder}"]`);
      await this.clickElement(option);
      await this.page.waitForLoadState('networkidle');
      return true;
    } catch (error) {
      console.log('Sort dropdown not available');
      return false;
    }
  }

  async getResultsCount(): Promise<number> {
    const resultsText = await this.page.locator('.srp-controls__count-heading').textContent();
    if (resultsText) {
      const match = resultsText.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }
} 