import { test, expect } from '@playwright/test';

test.describe('CentralMap E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'CentralMap' })).toBeVisible();
    await expect(page.getByText('El lugar del encuentro.')).toBeVisible();
  });

  test('should add a new address input', async ({ page }) => {
    const initialInputs = await page.locator('.address-input').count();
    await page.getByRole('button', { name: /agregar dirección/i }).click();
    const newInputs = await page.locator('.address-input').count();
    expect(newInputs).toBe(initialInputs + 1);
  });

  test('should show autocomplete suggestions when typing', async ({ page }) => {
    const input = page.locator('.address-input').first();
    await input.fill('Buenos Aires');
    await page.waitForTimeout(500); // Wait for debounce
    const suggestions = page.locator('.suggestions-list li');
    await expect(suggestions.first()).toBeVisible({ timeout: 5000 });
  });

  test('should calculate center of mass for multiple addresses', async ({ page }) => {
    // Add first address
    const firstInput = page.locator('.address-input').first();
    await firstInput.fill('Buenos Aires, Argentina');
    await page.waitForTimeout(500);

    // Add second address
    await page.getByRole('button', { name: /agregar dirección/i }).click();
    const secondInput = page.locator('.address-input').nth(1);
    await secondInput.fill('Córdoba, Argentina');
    await page.waitForTimeout(500);

    // Calculate center
    await page.getByRole('button', { name: /calcular centro/i }).click();

    // Wait for result
    await expect(page.locator('#result')).toContainText('Ubicación central', { timeout: 10000 });
  });
});
