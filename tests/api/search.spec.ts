import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/utils/ApiHelper';
import { TestData } from '../../src/utils/TestData';

const EBAY_TOKEN = process.env.EBAY_API_TOKEN;

test.describe.skip('eBay API Search Tests', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async () => {
    apiHelper = new ApiHelper();
  });

  test.afterEach(async () => {
    await apiHelper.dispose();
  });

  test('should search for items via API', async () => {
    const searchResults = await apiHelper.searchItems(TestData.SEARCH_TERMS.LAPTOP, 5);
    
    expect(searchResults).toBeDefined();
    expect(searchResults.itemSummaries).toBeDefined();
    expect(searchResults.itemSummaries.length).toBeGreaterThan(0);
  });

  test('should search for multiple items', async () => {
    const searchTerms = [
      TestData.SEARCH_TERMS.LAPTOP,
      TestData.SEARCH_TERMS.PHONE,
      TestData.SEARCH_TERMS.BOOK
    ];

    for (const term of searchTerms) {
      const results = await apiHelper.searchItems(term, 3);
      expect(results.itemSummaries).toBeDefined();
      expect(results.itemSummaries.length).toBeGreaterThan(0);
    }
  });

  test('should limit search results', async () => {
    const limit = 2;
    const searchResults = await apiHelper.searchItems(TestData.SEARCH_TERMS.LAPTOP, limit);
    
    expect(searchResults.itemSummaries.length).toBeLessThanOrEqual(limit);
  });

  test('should handle empty search query', async () => {
    const searchResults = await apiHelper.searchItems('', 5);
    
    // API should handle empty query gracefully
    expect(searchResults).toBeDefined();
  });

  test('should get item details by ID', async () => {
    // First get a list of items
    const searchResults = await apiHelper.searchItems(TestData.SEARCH_TERMS.LAPTOP, 1);
    
    if (searchResults.itemSummaries && searchResults.itemSummaries.length > 0) {
      const itemId = searchResults.itemSummaries[0].itemId;
      const itemDetails = await apiHelper.getItemDetails(itemId);
      
      expect(itemDetails).toBeDefined();
      expect(itemDetails.itemId).toBe(itemId);
    }
  });

  test('should handle special characters in search query', async () => {
    const searchResults = await apiHelper.searchItems('@#$%^&*', 5);
    expect(searchResults).toBeDefined();
    // Should not throw, may return empty or error structure
  });

  test('should handle very large limit', async () => {
    const searchResults = await apiHelper.searchItems(TestData.SEARCH_TERMS.LAPTOP, 1000);
    expect(searchResults).toBeDefined();
    expect(searchResults.itemSummaries.length).toBeLessThanOrEqual(1000);
  });

  test('should handle invalid item ID', async () => {
    const invalidId = 'invalid-item-id-123';
    const itemDetails = await apiHelper.getItemDetails(invalidId);
    expect(itemDetails).toBeDefined();
    // Should handle gracefully, may return error or null fields
  });
}); 