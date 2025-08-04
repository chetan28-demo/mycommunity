module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@components': './src/Components',
            '@screens': './src/Screens',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@context': './src/context',
          },
        },
      ],
    ],
  };
};