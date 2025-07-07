# eBay Playwright Test Suite

A comprehensive test automation framework for eBay using Playwright with Page Object Model (POM) pattern.

## Project Structure

```
playwright-test/
├── src/
│   ├── pages/                 # Page Object Models
│   │   ├── BasePage.ts        # Base page with common methods
│   │   ├── HomePage.ts        # eBay homepage
│   │   ├── SearchResultsPage.ts # Search results page
│   │   └── ProductPage.ts     # Individual product page
│   └── utils/
│       ├── TestData.ts        # Test data management
│       ├── ApiHelper.ts       # API testing utilities
│       ├── global-setup.ts    # Global test setup
│       └── global-teardown.ts # Global test cleanup
├── tests/
│   ├── ui/                    # UI tests
│   │   ├── home.spec.ts       # Homepage tests
│   │   ├── search-results.spec.ts # Search results tests
│   │   └── product.spec.ts    # Product page tests
│   ├── api/                   # API tests
│   │   ├── search.spec.ts     # Search API tests
│   │   └── categories.spec.ts # Categories API tests
│   └── ebay-search.spec.ts    # Legacy test (updated to POM)
├── playwright.config.ts       # Playwright configuration
├── package.json
└── README.md
```

## Features

### Page Object Model (POM)
- **BasePage**: Common methods for all page objects
- **HomePage**: eBay homepage interactions
- **SearchResultsPage**: Search results, filters, and pagination
- **ProductPage**: Individual product page functionality

### Test Categories
- **UI Tests**: End-to-end user interface testing
- **API Tests**: eBay API endpoint testing
- **Integration Tests**: Combined UI and API testing

### Utilities
- **TestData**: Centralized test data management
- **ApiHelper**: eBay API interaction utilities
- **Global Setup/Teardown**: Test environment management

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
npx playwright install
```

### Running Tests

#### All Tests
```bash
npx playwright test
```

#### UI Tests Only
```bash
npx playwright test tests/ui/
```

#### API Tests Only
```bash
npx playwright test tests/api/
```

#### Specific Test File
```bash
npx playwright test tests/ui/home.spec.ts
```

#### With Browser
```bash
npx playwright test --headed
```

#### With Debug
```bash
npx playwright test --debug
```

### Test Reports
```bash
npx playwright show-report
```

## Test Examples

### UI Test Example
```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { SearchResultsPage } from '../../src/pages/SearchResultsPage';

test('should search for laptop and display results', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);

  await homePage.navigateToHomePage();
  await homePage.searchForItem('laptop');
  await searchResultsPage.waitForResults();
  await expect(searchResultsPage.searchResults).toBeVisible();
});
```

### API Test Example
```typescript
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/utils/ApiHelper';

test('should search for items via API', async () => {
  const apiHelper = new ApiHelper();
  const searchResults = await apiHelper.searchItems('laptop', 5);
  
  expect(searchResults.itemSummaries).toBeDefined();
  expect(searchResults.itemSummaries.length).toBeGreaterThan(0);
});
```

## Configuration

### Playwright Config
- **Base URL**: https://www.ebay.com
- **Timeout**: 30 seconds
- **Retries**: 1
- **Browsers**: Chromium, Firefox, WebKit
- **Reports**: HTML and list reporters
- **Traces**: On first retry

### Environment Variables
```bash
# Add to .env file if needed
EBAY_API_KEY=your_api_key_here
```

## Best Practices

### Page Object Model
- Keep page objects focused on single responsibility
- Use meaningful method names
- Handle common scenarios in base classes

### Test Data
- Use centralized test data management
- Avoid hardcoded values in tests
- Use data-driven testing where appropriate

### Error Handling
- Implement proper error handling in page objects
- Use try-catch blocks for optional elements
- Provide meaningful error messages

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

## CI/CD Integration

### GitHub Actions
The project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:
- Runs tests on push to main branch
- Runs tests on pull requests
- Installs dependencies and browsers
- Uploads test results as artifacts

### Running in CI
```bash
npm ci
npx playwright install --with-deps
npx playwright test
```

## Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## Troubleshooting

### Common Issues
- **Timeout errors**: Increase timeout in config or add explicit waits
- **Element not found**: Update selectors or add better error handling
- **API errors**: Check API endpoints and authentication
- **WebKit failures**: Some tests may fail in WebKit due to site compatibility

### Running Specific Test Suites
```bash
# Run only smoke tests (most reliable)
npx playwright test tests/ui/smoke.spec.ts

# Run only Chromium tests
npx playwright test --project=chromium

# Run only UI tests
npx playwright test tests/ui/

# Run only API tests
npx playwright test tests/api/
```

### Debug Mode
```bash
npx playwright test --debug
```

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

### Performance Tips
- Use `--workers=1` for debugging
- Use `--headed` to see browser actions
- Use `--slowmo=1000` to slow down actions

## License

This project is for educational and testing purposes only. 