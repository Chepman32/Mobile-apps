module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@assets': './src/assets',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@navigation': './src/navigation',
            '@context': './src/context',
            '@types': './src/types',
            '@constants': './src/constants'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
