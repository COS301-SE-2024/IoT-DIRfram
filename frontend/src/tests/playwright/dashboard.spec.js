const fs = require('fs');
const { test, expect } = require('@playwright/test');
const path = require('path');

const coverageDir = path.resolve(__dirname, '../../../playwrightcoverage');
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
    });

    test.afterEach(async ({ page }) => {
        const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
        fs.writeFileSync(`playwrightcoverage/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
      });

    test('opens and closes the Add Device modal', async ({ page }) => {
        await page.click('.addButton'); // Click the "Add device" button
        await expect(page.locator('.modal-content-app')).toBeVisible(); // Check if modal is visible
    
        await page.fill('input[placeholder="Enter device serial number"]', '12345'); // Enter device serial number
    
        await page.click('button:has-text("Cancel")'); // Close the modal
        await expect(page.locator('.modal-content-app')).not.toBeVisible(); // Ensure modal is closed
    });

    test('adds a device successfully', async ({ page }) => {
        await page.click('.addButton'); // Open the modal
    
        await page.fill('input[placeholder="Enter device serial number"]', '1000000013dcc3ee'); // Enter a device serial number
    
        await page.click('button:has-text("Save")'); // Click save button
        await expect(page.locator('.modal-content-app')).not.toBeVisible(); // Ensure the modal is closed
    
        await expect(page.locator('text=1000000013dcc3ee')).toBeVisible(); // Ensure the device is displayed
    });

    test ('edits device successfully', async ({ page }) => {
        // find the 2nd edit button
        const editButton = await page.locator('.edit-button-device').nth(1);
        await editButton.click();
        await page.fill('input[placeholder="Enter new device name"]', 'Pi2');
        await page.click('button:has-text("Save")');
        await expect(page.locator('text=Pi2')).toBeVisible();

    });

    test ('removes device successfully', async ({ page }) => {
        // find the 2nd remove button
        const removeButton = await page.locator('.remove-button').nth(1);
        await removeButton.click();
        await expect(page.locator('text=1000000013dcc3ee')).not.toBeVisible();
    });

    test ('displays device 1000000013dcc3ed', async ({ page }) => {
        await expect(page.locator('text=1000000013dcc3ed')).toBeVisible();
    });

    test ('clicking device directs to raspberrypi correctly', async ({ page }) => {
        await page.click(".device-link");
        await expect(page).toHaveURL(/\/raspberrypi/);
    });

    test('logs out successfully', async ({ page }) => {
        await page.click('.menu-btn');
        await expect(page.locator('.logout-btn')).toBeVisible(); // Ensure the logout button is visible
        await page.click('.logout-btn');
        await expect(page).toHaveURL(/\/splash/); // Ensure we are redirected to the splash
    });
    

});