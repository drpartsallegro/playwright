import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { SearchResultsPage } from '../../src/pages/SearchResultsPage';
import { TestData } from '../../src/utils/TestData';

test.describe('eBay Smoke Tests', () => {
  let homePage: HomePage;
  let searchResultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
  });

  test('should load homepage and perform basic search', async ({ page }) => {
    // Navigate to homepage
    await homePage.navigateToHomePage();
    await expect(page).toHaveTitle(/eBay/);
    
    // Verify search input is visible
    await expect(homePage.searchInput).toBeVisible();
    
    // Perform search
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    
    // Verify results page loaded
    await searchResultsPage.waitForResults();
    await expect(searchResultsPage.searchResults).toBeVisible();
    
    console.log('Smoke test passed: Homepage and search working');
  });

  test('should handle multiple search terms', async ({ page }) => {
    const searchTerms = [TestData.SEARCH_TERMS.LAPTOP, TestData.SEARCH_TERMS.PHONE];
    
    for (const term of searchTerms) {
      await homePage.navigateToHomePage();
      await homePage.searchForItem(term);
      await searchResultsPage.waitForResults();
      await expect(searchResultsPage.searchResults).toBeVisible();
    }
    
    console.log('Multiple search terms test passed');
  });
}); 