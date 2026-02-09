# REWIRE Mobile App

A React Native mobile application built with Expo Router and NativeWind.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
# or
expo start
```

3. Run on a specific platform:
```bash
npm run android  # Android
npm run ios       # iOS
npm run web       # Web (for testing)
```

## Project Structure

```
mobile/
├── app/                 # Expo Router app directory
│   ├── (auth)/          # Authentication routes
│   ├── (tabs)/          # Main tab navigation
│   └── _layout.tsx      # Root layout
├── src/
│   ├── components/      # Reusable components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and contexts
├── assets/              # Images and static assets
├── app.json            # Expo configuration
├── babel.config.js     # Babel configuration
└── metro.config.js     # Metro bundler configuration
```

## Features

- **Expo Router**: File-based routing system
- **NativeWind**: Tailwind CSS for React Native
- **React Query**: Data fetching and caching
- **Expo Secure Store**: Secure token storage
- **TypeScript**: Type-safe development

## Configuration

### API Configuration

The app uses `expo-constants` for API configuration. Set your API URL in `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-api-url.com"
    }
  }
}
```

Or use environment variables (create a `.env` file):

```
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

### Assets

Add the following assets to `assets/images/`:
- `icon.png` (1024x1024) - App icon
- `splash-icon.png` (1242x2436) - Splash screen image
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `favicon.png` (48x48) - Web favicon

## Building for Production

### Android

```bash
npm run build:android
# or
eas build --platform android
```

### iOS

```bash
npm run build:ios
# or
eas build --platform ios
```

## Development Notes

- The app uses Expo Router for navigation (file-based routing)
- NativeWind is configured for styling with Tailwind CSS classes
- All API calls go through `src/lib/api-client.ts`
- Authentication state is managed via `src/lib/auth-context.tsx`

## Troubleshooting

### Metro bundler cache issues
```bash
expo start --clear
```

### Reset Expo cache
```bash
expo start -c
```

### Clear node_modules and reinstall
```bash
rm -rf node_modules
npm install
```
