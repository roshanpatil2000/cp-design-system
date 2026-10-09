/** Native component tests. Web tests run in Vitest (see vitest.config.ts). */
module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['<rootDir>/src/**/*.native.test.tsx'],
};
