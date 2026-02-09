# Migration Plan: Moving Screens to Mobile

## Status

### ✅ Completed
- Theme files copied to `mobile/src/theme/`
- UI components copied to `mobile/src/components/ui/`
- Need to update imports in UI components to use mobile paths

### 🔄 In Progress
- Converting screens from React Navigation to Expo Router
- Converting StyleSheet to NativeWind
- Updating API hooks

### 📋 To Do
- [ ] Update UI component imports (change `@/` paths)
- [ ] Convert all screens to Expo Router format
- [ ] Add routes in `mobile/app/`
- [ ] Merge API hooks from `src/lib/api.ts` into `mobile/src/hooks/use-api.ts`
- [ ] Update all imports to use mobile structure

## Screen Mapping

| Old Screen | New Route | Status |
|------------|-----------|--------|
| ChallengesScreen | `app/(tabs)/challenges.tsx` | Pending |
| ChallengeDetailScreen | `app/challenge/[id].tsx` | Pending |
| EventsScreen | `app/(tabs)/events.tsx` | Pending |
| EventDetailScreen | `app/event/[id].tsx` | Pending |
| SettingsScreen | `app/(tabs)/settings.tsx` | Pending |
| LibraryScreen | `app/(tabs)/library.tsx` | Pending |
| PracticeDetailScreen | `app/practice/[id].tsx` | Pending |
| FocusScreen | `app/(tabs)/focus.tsx` | Pending |
| MetricsScreen | Merge into `app/(tabs)/stats.tsx` | Pending |
| CoachScreen | `app/(tabs)/coach.tsx` | Pending |
| CoachDashboardScreen | `app/coach/dashboard.tsx` | Pending |
| AdminPanelScreen | `app/admin/panel.tsx` | Pending |

## Conversion Checklist

For each screen:
- [ ] Remove `useNavigation` from `@react-navigation/native`
- [ ] Replace with `router` from `expo-router`
- [ ] Convert `StyleSheet.create()` to NativeWind `className` props
- [ ] Update imports to use `@/src/` paths
- [ ] Replace `useSafeAreaInsets()` with `SafeAreaView` component
- [ ] Update API hooks to use mobile hooks
