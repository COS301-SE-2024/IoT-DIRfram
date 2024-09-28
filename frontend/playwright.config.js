module.exports = {
    testDir: './src/tests/playwright', 
    use: {
      headless: true,
      baseURL: 'http://localhost:3000',  // This is optional but can help simplify tests
      browserName: 'chromium',
  },
  };
  