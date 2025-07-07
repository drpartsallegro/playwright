import { APIRequestContext, request } from '@playwright/test';

export class ApiHelper {
  private context: APIRequestContext | null;

  constructor() {
    this.context = null;
  }

  async initialize() {
    const token = process.env.EBAY_API_TOKEN;
    if (!token) {
      console.warn('EBAY_API_TOKEN environment variable not set. API tests may fail.');
    }
    this.context = await request.newContext({
      baseURL: 'https://api.ebay.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
  }

  async searchItems(query: string, limit = 10) {
    if (!this.context) {
      await this.initialize();
    }

    const response = await this.context!.get('/buy/browse/v1/item_summary/search', {
      params: {
        q: query,
        limit: limit.toString()
      }
    });

    return await response.json();
  }

  async getItemDetails(itemId: string) {
    if (!this.context) {
      await this.initialize();
    }

    const response = await this.context!.get(`/buy/browse/v1/item/${itemId}`);
    return await response.json();
  }

  async getCategories() {
    if (!this.context) {
      await this.initialize();
    }

    const response = await this.context!.get('/commerce/taxonomy/v1/get_default_category_tree_id');
    return await response.json();
  }

  async getSellerItems(sellerUsername: string, limit = 10) {
    if (!this.context) {
      await this.initialize();
    }

    const response = await this.context!.get('/buy/browse/v1/item_summary/search', {
      params: {
        seller: sellerUsername,
        limit: limit.toString()
      }
    });

    return await response.json();
  }

  async dispose() {
    if (this.context) {
      await this.context.dispose();
    }
  }
} 