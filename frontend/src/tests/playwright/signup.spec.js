//COMMENTED OUT BECAUSE I DONT WANT TO CREATE NEWQ USERS THE WHOLE TIME

// const { test, expect } = require('@playwright/test');

// test.describe('Signup Flow', () => {
//   test('signs up successfully with valid credentials', async ({ page }) => {
//     await page.goto('http://localhost:3000/signup');

//     await page.fill('input[name="username"]', 'newuser12');
//     await page.fill('input[name="email"]', 'newuser12@example.com');
//     await page.fill('input[name="password"]', 'Password@123');
//     await page.fill('input[name="confirmPassword"]', 'Password@123');

//     await page.click('button[type="submit"]');

//     await expect(page).toHaveURL(/\/login/);
//   });

//   test('shows validation errors with invalid inputs', async ({ page }) => {
//     await page.goto('http://localhost:3000/signup');

//     await page.fill('input[name="username"]', 'BoeJiden');
//     await page.fill('input[name="email"]', 'invalid-email');
//     await page.fill('input[name="password"]', '123');
//     await page.fill('input[name="confirmPassword"]', '321');

//     await page.click('button[type="submit"]');

//     // Check for validation error messages
//     await expect(page.locator('text=Invalid email address')).toBeVisible();
//     await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
//     await expect(page.locator('text=Passwords do not match')).toBeVisible();
//     await expect(page.locator('text=Username is already taken')).toBeVisible();
//   });
// });
