const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@/components/ui': path.resolve(__dirname, '../../packages/registry/ui'),
            '@/components/blocks': path.resolve(__dirname, '../../packages/registry/blocks'),
            '@/components/screens': path.resolve(__dirname, '../../packages/registry/screens'),
            '@/components': './components',
            '@/lib': './lib',
            '@': '.',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
