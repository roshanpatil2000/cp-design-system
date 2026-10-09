/** Native component tests. Web tests run in Vitest (see vitest.config.mts). */
module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Loads react-native-worklets' JS implementation instead of its native module.
  resolver: 'react-native-worklets/jest/resolver',
  testMatch: ['<rootDir>/src/**/*.native.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-reanimated|react-native-worklets|react-native-gesture-handler)/)',
  ],
};
