import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly buyItNowButton: Locator;
  readonly watchButton: Locator;
  readonly sellerInfo: Locator;
  readonly productImages: Locator;
  readonly description: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('h1[data-testid="x-item-title__mainTitle"], h1.x-item-title__mainTitle, h1');
    this.productPrice = page.getByTestId('x-price-primary');
    this.addToCartButton = page.getByTestId('x-atc-action').getByTestId('ux-call-to-action');
    this.buyItNowButton = page.locator('button:has-text("Buy it now"), button:has-text("Buy It Now")');
    this.watchButton = page.locator('button:has-text("Watch"), button:has-text("Add to watch list")');
    this.sellerInfo = page.getByText('Welcome to my eBay Store.').first();
    this.productImages = page.locator('//div[contains(@class, "ux-image-carousel") or contains(@data-testid, "image-viewer")]', { hasText: '' });
    this.description = page.locator('[data-testid="x-item-description"], .x-item-description, .itemAttr');
  }

  async waitForProductToLoad() {
    await this.waitForElement(this.productTitle);
  }

  async getProductTitle(): Promise<string> {
    return await this.productTitle.textContent() || '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  async addToCart() {
    await this.clickElement(this.addToCartButton);
  }

  async buyItNow() {
    await this.clickElement(this.buyItNowButton);
  }

  async addToWatchlist() {
    await this.clickElement(this.watchButton);
  }

  async getSellerInfo(): Promise<string> {
    return await this.sellerInfo.textContent() || '';
  }

  async isProductAvailable(): Promise<boolean> {
    try {
      await this.waitForElement(this.addToCartButton, 3000);
      return true;
    } catch {
      return false;
    }
  }
} 