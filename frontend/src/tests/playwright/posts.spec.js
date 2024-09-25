const fs = require('fs');
const { test, expect } = require('@playwright/test');
const path = require('path');

const coverageDir = path.resolve(__dirname, '../../../coverage/playwright');
if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
}

test.describe('Posts Flow', () => {    

    test.beforeEach(async ({ page }) => {
        await page.coverage.startJSCoverage(); // Start JS coverage
        // Navigate to the login page before each test
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'DaganTheKing');
        await page.fill('#password', 'Password@123');

        // Submit the form
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test.afterEach(async ({ page }) => {
        const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
        fs.writeFileSync(`coverage/playwright/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
      });
    

});