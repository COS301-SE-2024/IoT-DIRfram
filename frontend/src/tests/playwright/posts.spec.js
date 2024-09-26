const fs = require('fs');
const { test, expect } = require('@playwright/test');
const path = require('path');

const coverageDir = path.resolve(__dirname, '../../../playwrightcoverage');
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

        // Open the menu
        await page.click('.menu-btn');
        await page.click('text=Posts');
    });

    test.afterEach(async ({ page }) => {
        const jsCoverage = await page.coverage.stopJSCoverage(); // Stop JS coverage
        fs.writeFileSync(`playwrightcoverage/coverage-${Date.now()}.json`, JSON.stringify(jsCoverage)); // Save coverage
      });

    test('shows the posts page', async ({ page }) => {
        await expect(page).toHaveURL(/\/postslist/);
    });

    test ('shows the posts', async ({ page }) => {
        await expect(page.locator('text=How to Turn on Device')).toBeVisible();
    });

    test ('clicking on the post opens the post', async ({ page }) => {
        await page.click('text=How to Turn on Device');
        await expect(page).toHaveURL(/\/posts\/66c7a5b4ce7e80fd2206ba97/);
    });

    test ('shows the post content', async ({ page }) => {
        await page.click('text=How to Turn on Device');
        await expect(page).toHaveURL(/\/posts\/66c7a5b4ce7e80fd2206ba97/);
        await expect(page.locator('text=How to Turn on Device')).toBeVisible();
        await expect(page.locator('text=I\'m having trouble turning it on, any help would be appreciated')).toBeVisible();
    });

    test ('shows the author of the post', async ({ page }) => {
        await page.click('text=How to Turn on Device');
        await expect(page).toHaveURL(/\/posts\/66c7a5b4ce7e80fd2206ba97/);
        await expect(page.locator('text=@DaganTheKing').nth(0)).toBeVisible();
    });

    test ('shows the responses', async ({ page }) => {
        await page.click('text=How to Turn on Device');
        await expect(page).toHaveURL(/\/posts\/66c7a5b4ce7e80fd2206ba97/);
        await expect(page.locator('text=Responses')).toBeVisible();
        await expect(page.locator('text=Well Boe, as I\'ve said, Just don\'t lol')).toBeVisible();
    });

    test ('can rate a response', async ({ page }) => {
        await page.click('text=How to Turn on Device');
        await expect(page).toHaveURL(/\/posts\/66c7a5b4ce7e80fd2206ba97/);
        await expect(page.locator('text=1 user(s) found this unhelpful')).toBeVisible();
        await page.click('.like-button');
        await expect(page.locator('text=0 user(s) found this helpful')).toBeVisible();
    });

    test ('can add a response', async ({ page }) => {
        await page.click('text=How to Turn on Device');
        await expect(page).toHaveURL(/\/posts\/66c7a5b4ce7e80fd2206ba97/);
        await page.fill('.response-textarea', 'I can help you with that');
        await page.click('.submit-button');
        await expect(page.locator('text=I can help you with that')).toBeVisible();
    });

    test ('can delete a response', async ({ page }) => {
        await page.click('text=How to Turn on Device');
        await expect(page).toHaveURL(/\/posts\/66c7a5b4ce7e80fd2206ba97/);
        await page.locator('.delete-button').nth(1).click();
        await expect(page.locator('text=I can help you with that')).not.toBeVisible();
    });

    test ('can create a post', async ({ page }) => {
        await page.click('text=Create Post');
        //expect modal to be visible
        await expect(page.locator('.modal-content')).toBeVisible();
        await page.fill('input[placeholder="Title"]', 'Help me please');
        await page.fill('textarea[placeholder="Description"]', 'I need help with this');

        await page.locator('button', { hasText: 'Post' }).nth(2).click();
        await expect(page.locator('text=Help me please')).toBeVisible();
    });

    test ('can delete a post', async ({ page }) => {
        await expect(page.locator('text=Help me please')).toBeVisible();
        await page.locator('.delete-button').nth(0).click();
        await expect(page.locator('text=Help me please')).not.toBeVisible();
    });

    test ('Show My Posts shows only my posts', async ({ page }) => {
        await page.click('text=Show My Posts');
        await expect(page.locator('text=How to Turn on Device')).not.toBeVisible();
    });

    test ('Show All Posts shows all posts', async ({ page }) => {
        await page.click('text=Show My Posts');
        await expect(page.locator('text=How to Turn on Device')).not.toBeVisible();
        await expect(page.locator('text=Show All Posts')).toBeVisible();
        await page.click('text=Show All Posts');
        await expect(page.locator('text=How to Turn on Device')).toBeVisible();
    });

    test ('can search for a post by title', async ({ page }) => {
        await page.fill('input[placeholder="Search posts by title or author..."]', 'How to Turn on Device');
        await expect(page.locator('text=How to Turn on Device')).toBeVisible();
        await expect(page.locator('text=Search Testing')).not.toBeVisible();
    });

    test ('can search for a post by author', async ({ page }) => {
        await page.fill('input[placeholder="Search posts by title or author..."]', 'BoeJiden');
        await expect(page.locator('text=How to Turn on Device')).toBeVisible();
        await expect(page.locator('text=Search Testing')).not.toBeVisible();
    });
    

});