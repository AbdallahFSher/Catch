module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: [
          'react-native-paper/babel',
          'react-native-code-push',
          'expo-font',
          {
            "fonts":["./assets/fonts/BethEllen-Regular.ttf"]
          },
          'react'
        ],
      },
    },
  };
};
