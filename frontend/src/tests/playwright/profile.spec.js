const fs = require('fs');
const { test, expect } = require('@playwright/test');
const path = require('path');

const coverageDir = path.resolve(__dirname, '../../../coverage/playwright');
if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
}

test.describe('Dashboard Flow', () => {
    

    test.beforeEach(async ({ page }) => {
        await page.coverage.startJSCoverage(); // Start JS coverage
        // Navigate to the login page before each test
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'DaganTheKing');
        await page.fill('#password', 'Password@123');

        // Submit the form
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/dashboard/);

        await page.goto('http://localhost:3000/profile');
    });

    test.afterEach(async ({ page }) => {
        const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
        fs.writeFileSync(`coverage/playwright/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
      });    

    test('shows the profile page', async ({ page }) => {
        await expect(page).toHaveURL(/\/profile/);
    });

    test ('shows the user\'s profile information', async ({ page }) => {
        await expect(page.locator('text=DaganTheKing').nth(0)).toBeVisible();
        await expect(page.locator('text=dagantheking@gmail.com')).toBeVisible();
        await expect(page.locator('text=Monica')).toBeVisible();
        await expect(page.locator('text=King').nth(2)).toBeVisible();
        await expect(page.locator('text=21')).toBeVisible();
    });

    test ('edits user information', async ({ page }) => {
        
    });

});