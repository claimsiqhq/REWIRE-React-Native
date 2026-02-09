# Build Error Fix: expo-router Plugin Resolution

## Error
```
Failed to resolve plugin for module "expo-router" relative to "/Users/expo/workingdir/build/"
```

## Root Cause
The EAS build process may be running from the root directory instead of the `mobile/` directory, causing it to use the root `babel.config.js` which doesn't have the `expo-router/babel` plugin.

## Fixes Applied

### 1. Updated `eas.json`
Added `workingDirectory: "mobile"` to ensure builds run from the correct directory:
```json
{
  "build": {
    "base": {
      "workingDirectory": "mobile"
    },
    ...
  }
}
```

### 2. Verified `mobile/babel.config.js`
Confirmed it has the correct configuration:
```javascript
plugins: [
  "expo-router/babel",  // ✅ Present
  "react-native-reanimated/plugin",  // Must be last
]
```

### 3. Updated Root `babel.config.js`
Added comment noting it's not used for mobile builds.

## Additional Steps

If the error persists, try:

1. **Clear EAS build cache:**
   ```bash
   eas build --clear-cache
   ```

2. **Verify build runs from mobile directory:**
   ```bash
   cd mobile
   eas build --platform android
   ```

3. **Check if expo-router is installed:**
   ```bash
   cd mobile
   npm list expo-router
   ```

4. **Reinstall dependencies:**
   ```bash
   cd mobile
   rm -rf node_modules package-lock.json
   npm install
   ```

## Verification

The `mobile/babel.config.js` file is correct and includes:
- ✅ `expo-router/babel` plugin
- ✅ `react-native-reanimated/plugin` (last)
- ✅ NativeWind configuration
- ✅ Proper preset order

The EAS build should now use the mobile directory's babel config.
