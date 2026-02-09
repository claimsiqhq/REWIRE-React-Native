# Migration Status: Old App → Mobile

## ✅ Completed

1. **Theme System**
   - ✅ Copied all theme files to `mobile/src/theme/`
   - ✅ Colors, spacing, typography, shadows all migrated

2. **UI Components**
   - ✅ Copied all UI components to `mobile/src/components/ui/`
   - ✅ Updated all imports from `@/theme` to `@/src/theme`
   - ✅ Components ready to use: Button, Card, Text, Input, Badge, Checkbox, Slider, Spinner, Separator

3. **Settings Screen**
   - ✅ Converted to Expo Router format
   - ✅ Converted StyleSheet to NativeWind
   - ✅ Added to tab navigation

## 🔄 In Progress

### Screens to Convert

The following screens need to be converted from React Navigation + StyleSheet to Expo Router + NativeWind:

1. **ChallengesScreen** → `app/(tabs)/challenges.tsx`
   - Uses tabs (discover/my-challenges)
   - Has challenge cards and join functionality
   - Needs: ChallengeDetail route

2. **EventsScreen** → `app/(tabs)/events.tsx`
   - Uses tabs (upcoming/registered/recordings)
   - Has event cards and registration
   - Needs: EventDetail route

3. **LibraryScreen** → `app/(tabs)/library.tsx`
   - Practice library with filtering
   - Needs: PracticeDetail route

4. **FocusScreen** → `app/(tabs)/focus.tsx`
   - Breathing exercises and practices
   - Already partially exists as `practices.tsx`

5. **MetricsScreen** → Merge into `app/(tabs)/stats.tsx`
   - Dashboard with metrics and charts

6. **CoachScreen** → `app/(tabs)/coach.tsx`
   - AI coach interface

7. **ProfileScreen** → Already exists as `app/(tabs)/profile.tsx`
   - May need updates

### Detail Screens (Stack Routes)

These should be stack routes (not in tabs):

- `app/challenge/[id].tsx` - ChallengeDetailScreen
- `app/event/[id].tsx` - EventDetailScreen  
- `app/practice/[id].tsx` - PracticeDetailScreen
- `app/journal/[id].tsx` - JournalEntryScreen
- `app/coach/dashboard.tsx` - CoachDashboardScreen
- `app/admin/panel.tsx` - AdminPanelScreen

## 📋 Conversion Checklist (per screen)

For each screen conversion:
- [ ] Remove `useNavigation` from `@react-navigation/native`
- [ ] Replace with `router` from `expo-router` for navigation
- [ ] Convert `StyleSheet.create()` to NativeWind `className` props
- [ ] Update imports:
  - `@/theme` → `@/src/theme`
  - `@/components/ui` → `@/src/components/ui`
  - `@/lib/api` → `@/src/hooks/use-api` (after merging)
- [ ] Replace `useSafeAreaInsets()` with `SafeAreaView` component
- [ ] Update icon imports: `Ionicons` → `Feather` (or keep Ionicons if preferred)
- [ ] Update API hooks to use mobile hooks structure

## 🔧 API Hooks Migration

The old `src/lib/api.ts` has many hooks that need to be merged into `mobile/src/hooks/use-api.ts`:

- Challenges hooks (useChallenges, useJoinChallenge, etc.)
- Events hooks (useEvents, useRegisterForEvent, etc.)
- Library/Practices hooks (already partially exists)
- Metrics hooks
- Coach/AI hooks
- Admin hooks

## 📝 Next Steps

1. **Priority 1**: Convert main tab screens
   - Challenges
   - Events  
   - Library
   - Focus/Practices

2. **Priority 2**: Add detail routes
   - Challenge detail
   - Event detail
   - Practice detail

3. **Priority 3**: Merge API hooks
   - Consolidate all hooks into `use-api.ts`
   - Update all screens to use new hooks

4. **Priority 4**: Polish and test
   - Test all navigation flows
   - Verify API calls work
   - Fix any styling issues

## 🎯 Quick Reference

**Old Structure:**
```tsx
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({...});
```

**New Structure:**
```tsx
import { router } from 'expo-router';
// Use className props instead of StyleSheet
<View className="flex-1 bg-background">
```

**Old Navigation:**
```tsx
navigation.navigate('ScreenName', { param: value });
```

**New Navigation:**
```tsx
router.push('/screen-name');
router.push({ pathname: '/screen/[id]', params: { id: value } });
```
