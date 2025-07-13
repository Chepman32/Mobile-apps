const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript and other file extensions
config.resolver.assetExts.push('ttf', 'png', 'jpg', 'mp3', 'wav');
config.resolver.sourceExts.push('js', 'jsx', 'json', 'ts', 'tsx', 'cjs');

// Add module resolver configuration
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      if (typeof name !== 'string') return null;
      
      // Handle @/ alias
      if (name.startsWith('@/')) {
        return path.join(process.cwd(), 'src', name.substring(2));
      }
      
      // Fall back to the default resolution
      return path.join(process.cwd(), `node_modules/${name}`);
    },
  }
);

module.exports = config;
