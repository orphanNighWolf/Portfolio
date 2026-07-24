import { test, expect } from '@playwright/test';

const paths = [
  '/',
  '/about',
  '/skills',
  '/projects',
  '/writing',
  '/journey',
  '/contact'
];

test.describe('Accessibility & Layout Verification', () => {
  paths.forEach((path) => {
    test(`Verify ${path} renders properly and satisfies accessibility elements`, async ({ page }) => {
      // 1. Go to page
      await page.goto(`http://localhost:3000${path}`);

      // 2. Check semantic layout tags
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      // 3. Ensure single H1 per route
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // 4. Verify presence and validity of accessibility elements on motion toggle
      const motionToggle = page.locator('.motion-toggle');
      await expect(motionToggle).toBeVisible();

      const ariaLabel = await motionToggle.getAttribute('aria-label');
      expect(ariaLabel).toBeDefined();

      const ariaPressed = await motionToggle.getAttribute('aria-pressed');
      expect(ariaPressed).toBeDefined();
    });
  });
});
