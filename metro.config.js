const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tell Metro to bundle .tflite and .txt files with the app
config.resolver.assetExts.push('tflite', 'txt');

module.exports = config;