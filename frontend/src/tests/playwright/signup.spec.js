const fs = require('fs');
const { test, expect } = require('@playwright/test');
const path = require('path');

const coverageDir = path.resolve(__dirname, '../../../playwrightcoverage');
if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
}



test.describe('Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.coverage.startJSCoverage(); // Start JS coverage
  });

  test.afterEach(async ({ page }) => {
    const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
    fs.writeFileSync(`playwrightcoverage/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
  });

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

  test('shows validation errors with taken email', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');

    await page.fill('input[name="username"]', 'newuser');
    await page.fill('input[name="email"]', 'testemail@email.com');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email is already taken').first()).toBeVisible();
  });

  test('shows validation errors with mismatched passwords', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');

    await page.fill('input[name="username"]', 'newuser');
    await page.fill('input[name="email"]', 'email@email.com');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password1234');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Passwords do not match').first()).toBeVisible();
  });

  test('shows validation errors with invalid email', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');

    await page.fill('input[name="username"]', 'newuser5');
    await page.fill('input[name="email"]', 'invalid-email@email.x');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid email address')).toBeVisible();
  });

  test('shows validation errors with invalid password', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');

    await page.fill('input[name="username"]', 'newuser');
    await page.fill('input[name="email"]', 'email@email.com');
    await page.fill('input[name="password"]', 'password');
    await page.fill('input[name="confirmPassword"]', 'password');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Password must be at least 8 characters long and include at least one number').first()).toBeVisible();
  });

});
