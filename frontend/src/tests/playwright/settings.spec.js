const fs = require('fs');
const { test, expect } = require('@playwright/test');
const path = require('path');

const coverageDir = path.resolve(__dirname, '../../../playwrightcoverage');
if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
}



test.describe('Settings Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.coverage.startJSCoverage(); // Start JS coverage
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'DaganTheKing');
        await page.fill('#password', 'Password@123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/dashboard/);
        const butn = await page.locator('.menu-btn');
        await butn.click();
        await page.click('text=Settings');
    });

    test.afterEach(async ({ page }) => {
        const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
        fs.writeFileSync(`playwrightcoverage/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
    });

    test('shows the settings page', async ({ page }) => {
        await expect(page).toHaveURL(/\/settings/);
    });

    test('shows the correct user settings', async ({ page }) => {
        //checkbox with name newDataAvailable is checked
        await expect(page.locator('input[name="newDataAvailable"]').first()).toBeChecked();
        //checkbox with name newResponseToPosts is not checked
        await expect(page.locator('input[name="newResponseToPosts"]').first()).not.toBeChecked();

    });

    test('updates user settings', async ({ page }) => {
        await page.check('input[name="newResponseToPosts"]');
        await page.uncheck('input[name="newDataAvailable"]');
        await page.click('.save-button');
        //refresh the page
        await page.reload();
        //checkbox with name newResponseToPosts is checked
        await expect(page.locator('input[name="newResponseToPosts"]').first()).toBeChecked();
        //checkbox with name newDataAvailable is not checked
        await expect(page.locator('input[name="newDataAvailable"]').first()).not.toBeChecked();

    });

    test('user settings correctly persisted', async ({ page }) => {
        await expect (page.locator('input[name="newDataAvailable"]').first()).not.toBeChecked();
        await expect (page.locator('input[name="newResponseToPosts"]').first()).toBeChecked();
    });
    test('performance test for settings load', async ({ page }) => {
        const startTime = Date.now();
            await page.goto('http://localhost:3000/settings');
            const loadTime = Date.now() - startTime;
            console.log(`Settings load time: ${loadTime}ms`);
            expect(loadTime).toBeLessThan(2000); // Expect load time to be under 2 seconds
      });


});
