# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Configure API URL

Create a `.env` file in the `mobile/` directory:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Or configure in `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3000"
    }
  }
}
```

### 3. Add App Assets

Add the following images to `mobile/assets/images/`:

- **icon.png** (1024x1024) - App icon
- **splash-icon.png** (1242x2436) - Splash screen image  
- **adaptive-icon.png** (1024x1024) - Android adaptive icon
- **favicon.png** (48x48) - Web favicon

If assets are missing, Expo will use defaults, but you should add your branding.

### 4. Start Development Server

```bash
# From root directory
npm run dev

# Or from mobile directory
cd mobile
npm start
```

### 5. Run on Device/Simulator

```bash
# iOS Simulator (Mac only)
npm run mobile:ios

# Android Emulator
npm run mobile:android

# Web browser
npm run mobile:web
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |
| `EXPO_PUBLIC_DEBUG` | Enable debug logging | `false` |

## Troubleshooting

### "expo: not found"
Make sure you're running commands from the `mobile/` directory or use `npx expo`.

### API Connection Errors
1. Check that your backend server is running
2. Verify `EXPO_PUBLIC_API_URL` is correct
3. Check CORS settings on your backend
4. For localhost on physical device, use your computer's IP address

### Authentication Issues
- The app uses cookie-based sessions
- Make sure `credentials: "include"` is set (already configured)
- Check that your backend accepts cookies from the mobile app origin

### Build Errors
- Clear cache: `npx expo start -c`
- Delete `node_modules` and reinstall
- Check that all dependencies are compatible with Expo SDK 52

## Production Build

### Android
```bash
npm run mobile:build:android
```

### iOS
```bash
npm run mobile:build:ios
```

Requires EAS account setup. See [Expo EAS Build docs](https://docs.expo.dev/build/introduction/).
