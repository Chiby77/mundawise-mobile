// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow Metro to bundle TFLite model files and text label files
config.resolver.assetExts.push('tflite', 'txt');

module.exports = config;
