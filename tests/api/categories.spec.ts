import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/utils/ApiHelper';

const EBAY_TOKEN = process.env.EBAY_API_TOKEN;

test.describe.skip('eBay API Categories Tests', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async () => {
    apiHelper = new ApiHelper();
  });

  test.afterEach(async () => {
    await apiHelper.dispose();
  });

  test('should get default category tree', async () => {
    const categories = await apiHelper.getCategories();
    
    expect(categories).toBeDefined();
    expect(categories.categoryTreeId).toBeDefined();
  });

  test('should search items by seller', async () => {
    // Using a known seller for testing
    const sellerUsername = 'ebay';
    const sellerItems = await apiHelper.getSellerItems(sellerUsername, 5);
    
    expect(sellerItems).toBeDefined();
    expect(sellerItems.itemSummaries).toBeDefined();
  });

  test('should handle invalid seller username', async () => {
    const invalidSeller = 'invalid_seller_12345';
    const sellerItems = await apiHelper.getSellerItems(invalidSeller, 5);
    
    // Should handle gracefully even if seller doesn't exist
    expect(sellerItems).toBeDefined();
  });

  test('should handle large limit for seller items', async () => {
    const sellerUsername = 'ebay';
    const sellerItems = await apiHelper.getSellerItems(sellerUsername, 1000);
    expect(sellerItems).toBeDefined();
    expect(sellerItems.itemSummaries.length).toBeLessThanOrEqual(1000);
  });

  test('should handle empty seller username', async () => {
    const sellerItems = await apiHelper.getSellerItems('', 5);
    expect(sellerItems).toBeDefined();
    // Should handle gracefully, may return error or empty
  });
}); 