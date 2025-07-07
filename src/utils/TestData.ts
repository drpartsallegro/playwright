export class TestData {
  static readonly SEARCH_TERMS = {
    LAPTOP: 'laptop',
    PHONE: 'iphone',
    BOOK: 'programming book',
    SHOES: 'nike shoes'
  };

  static readonly CATEGORIES = {
    ELECTRONICS: 'Electronics',
    FASHION: 'Fashion',
    HOME: 'Home & Garden',
    SPORTS: 'Sporting Goods'
  };

  static readonly FILTERS = {
    BUY_IT_NOW: 'Buy It Now',
    FREE_SHIPPING: 'Free Shipping',
    NEW: 'New',
    USED: 'Used'
  };

  static readonly SORT_OPTIONS = {
    PRICE_LOW_TO_HIGH: 'Price + Shipping: lowest first',
    PRICE_HIGH_TO_LOW: 'Price + Shipping: highest first',
    NEWEST: 'Newly Listed',
    BEST_MATCH: 'Best Match'
  };

  static getRandomSearchTerm(): string {
    const terms = Object.values(this.SEARCH_TERMS);
    return terms[Math.floor(Math.random() * terms.length)];
  }

  static getRandomCategory(): string {
    const categories = Object.values(this.CATEGORIES);
    return categories[Math.floor(Math.random() * categories.length)];
  }
} 