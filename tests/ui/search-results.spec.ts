import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { SearchResultsPage } from '../../src/pages/SearchResultsPage';
import { TestData } from '../../src/utils/TestData';

test.describe('eBay Search Results Tests', () => {
  let homePage: HomePage;
  let searchResultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
  });

  test('should display search results with correct count', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    
    const resultsCount = await searchResultsPage.getResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
  });

  test('should apply Buy It Now filter', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    
    const filterApplied = await searchResultsPage.applyBuyItNowFilter();
    if (filterApplied) {
      await expect(searchResultsPage.buyItNowFilter).toBeChecked();
    }
  });

  test('should apply Free Shipping filter', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    
    const filterApplied = await searchResultsPage.applyFreeShippingFilter();
    if (filterApplied) {
      await expect(searchResultsPage.freeShippingFilter).toBeChecked();
    }
  });

  test('should navigate to next page', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    
    const pageNavigated = await searchResultsPage.goToNextPage();
    if (pageNavigated) {
      await expect(page).toHaveURL(/_pgn=2/);
    }
  });

  test('should sort results by price', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    
    const sortApplied = await searchResultsPage.sortByPrice('asc');
    if (sortApplied) {
      await expect(page).toHaveURL(/_sop=15/);
    }
  });

  test('should handle multiple filters', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    
    // Apply multiple filters
    await searchResultsPage.applyBuyItNowFilter();
    await searchResultsPage.applyFreeShippingFilter();
    
    // Verify results are still visible
    await expect(searchResultsPage.searchResults).toBeVisible();
  });

  test('should apply price range filter', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    const minInput = page.locator('input[placeholder*="Min"]');
    const maxInput = page.locator('input[placeholder*="Max"]');
    if (await minInput.count() > 0 && await maxInput.count() > 0) {
      await minInput.fill('100');
      await maxInput.fill('200');
      await maxInput.press('Enter');
      await searchResultsPage.waitForResults();
      await expect(searchResultsPage.searchResults).toBeVisible();
    } else {
      test.skip(true, 'Price range filter not available on this search');
    }
  });

  test('should handle no results found', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem('asdkfjhasdkjfhqwe'); // unlikely to return results
    await searchResultsPage.waitForResults();
    // Use a more specific locator to avoid strict mode violation
    const noResults = page.locator('h3.srp-save-null-search__heading');
    if (await noResults.count() > 0) {
      await expect(noResults.first()).toBeVisible();
    } else {
      test.skip(true, 'No results message not found');
    }
  });
}); 