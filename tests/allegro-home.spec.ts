import { test, expect } from '@playwright/test';

test('Allegro homepage loads and search bar is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('input[role="combobox"][type="search"]')).toBeVisible();
}); 