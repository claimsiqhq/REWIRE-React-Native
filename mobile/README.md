# REWIRE Mobile App

React Native (Expo) mobile application for the REWIRE personal transformation coaching platform.

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

## Getting Started

1. Install dependencies:
   ```bash
   cd mobile
   npm install
   ```

2. Copy environment file and configure:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. Add app icons:
   - Place your icon files in `assets/images/`:
     - `icon.png` (1024x1024)
     - `splash-icon.png` (512x512)
     - `adaptive-icon.png` (1024x1024)
     - `favicon.png` (48x48)

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on device/simulator:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab screens
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry redirect
├── src/
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities and contexts
├── assets/                # Images, fonts, etc.
├── app.json              # Expo configuration
├── tailwind.config.js    # NativeWind configuration
└── package.json
```

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS for RN)
- **State Management**: React Query + React Context
- **Forms**: React Hook Form
- **Icons**: @expo/vector-icons (Feather)

## Features

- Mood tracking with energy/stress levels
- Habit tracking with streaks
- Journaling with prompts
- Breathing & meditation practices
- Gamification (XP, levels, streaks)
- AI coaching integration
- Dark mode UI

## Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request
