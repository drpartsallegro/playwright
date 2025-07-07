import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { SearchResultsPage } from '../../src/pages/SearchResultsPage';
import { TestData } from '../../src/utils/TestData';

test.describe('eBay Homepage Tests', () => {
  let homePage: HomePage;
  let searchResultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
  });

  test('should load homepage successfully', async ({ page }) => {
    await homePage.navigateToHomePage();
    await expect(page).toHaveTitle(/eBay/);
    await expect(page.locator('#gh-ac')).toBeVisible();
  });

  test('should search for laptop and display results', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
    await searchResultsPage.waitForResults();
    await expect(searchResultsPage.searchResults).toBeVisible();
  });

  test('should search for multiple items', async ({ page }) => {
    const searchTerms = [
      TestData.SEARCH_TERMS.LAPTOP,
      TestData.SEARCH_TERMS.PHONE,
      TestData.SEARCH_TERMS.BOOK
    ];

    for (const term of searchTerms) {
      await homePage.navigateToHomePage();
      await homePage.searchForItem(term);
      await searchResultsPage.waitForResults();
      await expect(searchResultsPage.searchResults).toBeVisible();
    }
  });

  test('should handle empty search', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.searchForItem('');
    // Should stay on homepage or show appropriate message
    await expect(page.locator('#gh-ac')).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.clickSignIn();
    await expect(page).toHaveURL(/signin/);
  });

  test.skip('should navigate to registration page', async ({ page }) => {
    await homePage.navigateToHomePage();
    await homePage.clickRegister();
    await expect(page).toHaveURL(/register/);
  });
}); 