import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly signInButton: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#gh-ac');
    this.searchButton = page.locator('#gh-search-btn');
    this.signInButton = page.locator('text="Sign in"');
    this.registerButton = page.locator('text=register');
  }

  async navigateToHomePage() {
    await this.goto('https://www.ebay.com/');
    await this.acceptCookies();
  }

  async searchForItem(searchTerm: string) {
    await this.fillInput(this.searchInput, searchTerm);
    await this.clickElement(this.searchButton);
    await this.page.waitForLoadState('networkidle');
  }

  async clickSignIn() {
    await this.clickElement(this.signInButton);
  }

  async clickRegister() {
    await this.clickElement(this.registerButton);
  }
} 