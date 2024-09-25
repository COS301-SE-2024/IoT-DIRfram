const fs = require('fs');
const { test, expect } = require('@playwright/test');

test.describe('Login Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.coverage.startJSCoverage();
    // Navigate to the login page before each test
    await page.goto('http://localhost:3000/login');
  });

  test.afterEach(async ({ page }) => {
    const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
    fs.writeFileSync(`coverage/playwright/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
  });

  test('logs in successfully with valid credentials', async ({ page }) => {
    // Fill in the username and password fields
    await page.fill('#username', 'DaganTheKing');
    await page.fill('#password', 'Password@123');

    // Submit the form
    await page.click('button[type="submit"]');

    // Check that the user is redirected to the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('shows an error message with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('#username', 'invalidUsername');
    await page.fill('#password', 'invalidPassword');

    // Submit the form
    await page.click('button[type="submit"]');

    // Check that an error message is displayed
    const errorMessage = await page.locator('.error');
    await expect(errorMessage).toContainText('Invalid credentials');
  });

});
