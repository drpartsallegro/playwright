import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { SearchResultsPage } from '../../src/pages/SearchResultsPage';
import { SingleProductPage } from '../../src/pages/single/SingleProductPage';
import { TestData } from '../../src/utils/TestData';

test.describe('eBay Product Page Tests', () => {
  let homePage: HomePage;
  let searchResultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
  });

  async function openProductPage(page: Page) {
    const firstProduct = page.locator('.srp-results .s-item__link').first();
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      firstProduct.click(),
    ]);
    await newPage.bringToFront();
    return new SingleProductPage(newPage);
  }

  async function skipIfSpamProtection(page: Page) {
    if (await page.locator('text=Please verify yourself to continue').isVisible({ timeout: 2000 })) {
      console.log('Test skipped due to spam protection screen.');
      test.skip(true, 'Skipped due to spam protection screen.');
    }
  }

  test('should load product page with details', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    const singleProductPage = await openProductPage(page);
    await skipIfSpamProtection(singleProductPage.page);
    await singleProductPage.waitForProductToLoad();
    const title = await singleProductPage.getProductTitle();
    const price = await singleProductPage.getProductPrice();
    expect(title).toBeTruthy();
    expect(price).toBeTruthy();
  });

  test('should display product images', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    const singleProductPage = await openProductPage(page);
    await skipIfSpamProtection(singleProductPage.page);
    await singleProductPage.waitForProductToLoad();
    await expect(singleProductPage.productImages.first()).toBeVisible();
  });

  test('should display seller information', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    const singleProductPage = await openProductPage(page);
    await skipIfSpamProtection(singleProductPage.page);
    await singleProductPage.waitForProductToLoad();
    const sellerInfo = await singleProductPage.getSellerInfo();
    expect(sellerInfo).toBeTruthy();
  });

  test('should check product availability', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    const singleProductPage = await openProductPage(page);
    await skipIfSpamProtection(singleProductPage.page);
    await singleProductPage.waitForProductToLoad();
    const isAvailable = await singleProductPage.isProductAvailable();
    expect(typeof isAvailable).toBe('boolean');
  });

  test('should display product description', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    const singleProductPage = await openProductPage(page);
    await skipIfSpamProtection(singleProductPage.page);
    await singleProductPage.waitForProductToLoad();
    await expect(singleProductPage.description).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    const singleProductPage = await openProductPage(page);
    await skipIfSpamProtection(singleProductPage.page);
    await singleProductPage.waitForProductToLoad();
    await singleProductPage.addToCart();
    await expect(singleProductPage.page).toHaveURL(/cart|addtocart|cart/);
  });

  test('should initiate Buy It Now', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    const singleProductPage = await openProductPage(page);
    await skipIfSpamProtection(singleProductPage.page);
    await singleProductPage.waitForProductToLoad();
    await singleProductPage.buyItNow();
    await expect(singleProductPage.page).toHaveURL(/checkout|signin/);
  });

  test('should add product to watchlist', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    const singleProductPage = await openProductPage(page);
    await skipIfSpamProtection(singleProductPage.page);
    await singleProductPage.waitForProductToLoad();
    await singleProductPage.addToWatchlist();
    await expect(singleProductPage.watchButton).toBeVisible();
  });
}); 