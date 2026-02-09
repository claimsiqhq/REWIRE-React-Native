# Build Fix Applied

## Issue
```
Failed to resolve plugin for module "expo-router" relative to "/Users/expo/workingdir/build/"
```

## Root Cause
The `babel.config.js` was missing the `expo-router/babel` plugin, which is required for Expo Router to work properly.

## Fix Applied

Updated `mobile/babel.config.js` to include the expo-router plugin:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Required for expo-router
      "expo-router/babel",
      // Required for react-native-reanimated (must be last)
      "react-native-reanimated/plugin",
    ],
  };
};
```

## Important Notes

1. **Plugin Order**: `react-native-reanimated/plugin` MUST be last in the plugins array
2. **expo-router/babel**: This plugin is required for Expo Router's file-based routing to work
3. **NativeWind**: Already properly configured with `jsxImportSource: "nativewind"` in the preset

## Next Steps

1. Clear cache and rebuild:
   ```bash
   cd mobile
   rm -rf node_modules/.cache
   npx expo start -c
   ```

2. If build still fails, try:
   ```bash
   cd mobile
   rm -rf node_modules
   npm install
   npx expo start -c
   ```

## Verification

The build should now work. The expo-router plugin will:
- Process file-based routes in the `app/` directory
- Enable dynamic imports for route components
- Handle navigation properly
