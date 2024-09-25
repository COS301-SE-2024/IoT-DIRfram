const fs = require('fs');
const { test, expect } = require('@playwright/test');
const path = require('path');

const coverageDir = path.resolve(__dirname, '../../../coverage/playwright');
if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
}



test.describe('RaspberryPi Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.coverage.startJSCoverage(); // Start JS coverage
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="username"]', 'DaganTheKing');
    await page.fill('input[name="password"]', 'Password123');
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/raspberrypi');
  });

  test.afterEach(async ({ page }) => {
    const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
    fs.writeFileSync(`coverage/playwright/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
  });

  

});
