const fs = require('fs');
const { test, expect } = require('@playwright/test');
const path = require('path');

const coverageDir = path.resolve(__dirname, '../../../playwrightcoverage');
if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
}



test.describe('RaspberryPi Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.coverage.startJSCoverage(); // Start JS coverage
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'DaganTheKing');
        await page.fill('#password', 'Password@123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/dashboard/);
        const butn = await page.locator('.device-link').nth(0);
        await butn.click();
    });

    test.afterEach(async ({ page }) => {
        const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
        fs.writeFileSync(`playwrightcoverage/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
    });

    test('shows the RaspberryPi page', async ({ page }) => {
        await expect(page).toHaveURL(/\/raspberrypi/);
    });

    test('shows the connected device', async ({ page }) => {
        await expect(page.locator('text=IoT Device 1').nth(0)).toBeVisible();
    });

    test('shows the device information', async ({ page }) => {
        await page.locator('.device-item').nth(0).click();
        await expect(page.locator('.modal-overlay-iot')).toBeVisible();
        await expect(page.locator('.graphDiv')).toBeVisible();
        await expect (page.locator('text=Extracted from: raspberrypi')).toBeVisible();
        await expect (page.locator('text=Firmware and Chip information:')).toBeVisible();
        await expect (page.locator('text=ContentHere').nth(0)).toBeVisible();
        await expect (page.locator('text=7.200000')).toBeVisible();
        await expect (page.locator('text=3.300000')).toBeVisible();
        await expect (page.locator('text=5.250000')).toBeVisible();
    });

    test('allows device comparison', async ({ page }) => {
        await page.locator('.device-item').nth(0).click();
        await expect(page.locator('.modal-overlay-iot')).toBeVisible();
        await page.click('text=Compare Current');
        //modal disappears
        await expect(page.locator('.modal-overlay-iot')).not.toBeVisible();
        //click on other device item
        await page.locator('.device-item').nth(1).click();
        await expect(page.locator('.modal-overlay-iot')).toBeVisible();
        await expect(page.locator('.graphDiv')).toBeVisible();
        
    });

    test('allows for date searching', async ({ page }) => {
        // find the first input of type date, make the value 2024-08-01
        await page.locator('input[type="date"]').nth(0).fill('2024-08-01');

        //Click search button
        await page.click('text=Search');
        //IoT Device 2 must not be visible
        await expect(page.locator('text=IoT Device 2')).not.toBeVisible();
        //IoT Device 1 must be visible
        await expect(page.locator('text=IoT Device 1')).toBeVisible();
    });



});
