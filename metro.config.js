const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable Hermes for better performance
config.transformer.hermesCommand = 'hermes';

// Optimize bundle splitting
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Asset optimization
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

module.exports = config;