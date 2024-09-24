//COMMENTED OUT BECAUSE I DONT WANT TO CREATE NEWQ USERS THE WHOLE TIME

const { test, expect } = require('@playwright/test');

test.describe('Signup Flow', () => {
  test('signs up successfully with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');

    await page.fill('input[name="username"]', 'newuser12');
    await page.fill('input[name="email"]', 'newuser12@example.com');
    await page.fill('input[name="password"]', 'Password@123');
    await page.fill('input[name="confirmPassword"]', 'Password@123');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login/);
  });

  test('shows validation errors with taken username', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');

    await page.fill('input[name="username"]', 'DaganTheKing');
    await page.fill('input[name="email"]', 'email@email.com');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Username is already taken')).toBeVisible();
  });
});
