import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { SearchResultsPage } from '../src/pages/SearchResultsPage';
import { TestData } from '../src/utils/TestData';

test('eBay search test using POM', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);

  // Navigate and search
  await homePage.navigateToHomePage();
  await homePage.searchForItem(TestData.SEARCH_TERMS.LAPTOP);
  await searchResultsPage.waitForResults();
  
  // Verify results
  await expect(searchResultsPage.searchResults).toBeVisible();
  
  console.log('Search test completed successfully using POM pattern');
}); 