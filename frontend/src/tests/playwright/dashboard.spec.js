const fs = require('fs');
const { test, expect } = require('@playwright/test');

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
        fs.writeFileSync(`coverage/playwright/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
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
    
        await page.fill('input[placeholder="Enter device serial number"]', 'device123'); // Enter a device serial number
    
        await page.click('button:has-text("Save")'); // Click save button
        await expect(page.locator('.modal-content-app')).not.toBeVisible(); // Ensure the modal is closed
    
        // Assuming page reload occurs after adding device, we can check for some indicator (like reloaded content)
        await expect(page).toHaveURL(/\/dashboard/);
    });
    

});