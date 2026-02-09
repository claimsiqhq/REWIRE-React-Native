// Root babel config - not used for mobile app
// Mobile app uses mobile/babel.config.js
// This file exists for compatibility but mobile builds should use mobile/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Note: expo-router is configured in mobile/babel.config.js
      'react-native-reanimated/plugin',
    ],
  };
};
