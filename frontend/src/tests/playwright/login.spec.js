const fs = require('fs');
const { test, expect } = require('@playwright/test');
const path = require('path');

const coverageDir = path.resolve(__dirname, '../../../playwrightcoverage');
if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
}

test.describe('Login Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.coverage.startJSCoverage();
    // Navigate to the login page before each test
    await page.goto('http://localhost:3000/login');
  });

  test.afterEach(async ({ page }) => {
    const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
    fs.writeFileSync(`playwrightcoverage/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
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

  test('performance test for login load', async ({ page }) => {
    const startTime = Date.now();
        await page.goto('http://localhost:3000/login');
        const loadTime = Date.now() - startTime;
        console.log(`Login load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(2000); // Expect load time to be under 2 seconds
  });

});
