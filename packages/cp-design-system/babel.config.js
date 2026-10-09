// Used only by Jest for native tests; the published build is produced by tsup.
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Reanimated 4 worklets. Must be the last plugin.
  plugins: ['react-native-worklets/plugin'],
};
