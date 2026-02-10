# iOS Build Setup

## Configuration Verified ✅

### 1. EAS Build Configuration
- ✅ `workingDirectory: "mobile"` set in `eas.json`
- ✅ iOS simulator enabled for development builds
- ✅ Bundle identifier: `com.rewire.app`
- ✅ API URL configured in environment variables

### 2. Babel Configuration
- ✅ `expo-router/babel` plugin included
- ✅ `react-native-reanimated/plugin` (last in array)
- ✅ NativeWind properly configured

### 3. iOS App Configuration
- ✅ Bundle identifier: `com.rewire.app`
- ✅ Tablet support enabled
- ✅ Splash screen configured

## Building for iOS

### Development Build (Simulator)
```bash
cd mobile
eas build --profile development --platform ios
```

### Preview Build (TestFlight)
```bash
cd mobile
eas build --profile preview --platform ios
```

### Production Build (App Store)
```bash
cd mobile
eas build --profile production --platform ios
```

## Requirements

1. **Apple Developer Account**: Required for iOS builds
2. **EAS CLI**: Install with `npm install -g eas-cli`
3. **Login**: `eas login` before building

## Troubleshooting

### If build fails with expo-router error:
1. Verify `mobile/babel.config.js` has `expo-router/babel` plugin
2. Clear cache: `eas build --clear-cache --platform ios`
3. Ensure you're running from `mobile/` directory

### If bundle identifier error:
- Check `mobile/app.json` has correct `bundleIdentifier: "com.rewire.app"`
- Ensure it matches your Apple Developer account

### If simulator build fails:
- Development profile has `"simulator": true` - this is correct
- Use `--profile development` for simulator builds

## Next Steps

1. **Login to EAS**: `eas login`
2. **Configure Apple credentials**: `eas build:configure`
3. **Start build**: `eas build --profile development --platform ios`

The build should now work correctly with the expo-router plugin properly configured!
