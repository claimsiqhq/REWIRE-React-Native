# Fixes Applied

## Issue: npm update errors in root directory

### Problem
Running `npm update` from the root directory was causing dependency conflicts because the root `package.json` contained React Native/Expo dependencies that conflicted with the mobile app's dependencies.

### Solution
Removed React Native/Expo dependencies from root `package.json`:
- Removed `expo` dependency
- Removed `@types/react-native` dev dependency  
- Removed `jest-expo` dev dependency

These dependencies now only exist in `mobile/package.json` where they belong.

### Fixed Root Layout
Changed `mobile/app/_layout.tsx` to use `<Slot />` instead of `<Stack>` for proper Expo Router v4 compatibility.

### Updated Package Versions
Updated mobile app dependencies to match Expo SDK 52:
- `@expo/vector-icons`: `^14.0.0` → `~14.0.4`
- `react-native`: `0.76.2` → `0.76.9`
- `react-native-screens`: `~4.1.0` → `~4.4.0`
- `react-native-svg`: `^15.8.0` → `15.8.0`

## How to Use

### For Mobile Development
Always work from the `mobile/` directory:
```bash
cd mobile
npm install    # Install mobile dependencies
npm start      # Start Expo dev server
npm update     # Update mobile dependencies
```

### For Root/Server Development
```bash
# From root directory
npm install    # Install server dependencies only
npm run server:dev  # Start server
```

### Important Notes
- **Never run `npm update` from root** - it will try to update React Native dependencies that don't belong there
- **Always run mobile commands from `mobile/` directory** or use the proxy scripts:
  - `npm run mobile:start`
  - `npm run mobile:android`
  - `npm run mobile:ios`

## Project Structure

```
workspace/
├── mobile/          # React Native Expo app (has its own package.json)
│   ├── app/        # Expo Router routes
│   ├── src/       # App source code
│   └── package.json # Mobile dependencies only
├── server/         # Backend server
├── shared/         # Shared code
└── package.json    # Root dependencies (server only, no React Native)
```

## Verification

The app should now:
1. ✅ Run without dependency conflicts
2. ✅ Have proper Expo Router setup with Slot
3. ✅ Have correct package versions for Expo SDK 52
4. ✅ Separate mobile and server dependencies
