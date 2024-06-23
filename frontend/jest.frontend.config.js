module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testMatch: ['**/frontend/src/tests/**/*.test.js'],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less)$': 'identity-obj-proxy'
    },
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
};
  