import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme';

// Screens
import AuthScreen from '@/screens/AuthScreen';
import { MainTabNavigator } from './MainTabNavigator';
import PracticeDetailScreen from '@/screens/PracticeDetailScreen';
import ChallengeDetailScreen from '@/screens/ChallengeDetailScreen';
import EventDetailScreen from '@/screens/EventDetailScreen';
import JournalEntryScreen from '@/screens/JournalEntryScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { LoadingContainer } from '@/components/ui';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingContainer style={{ backgroundColor: colors.background }} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ animationTypeForReplace: 'pop' }}
        />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="PracticeDetail"
            component={PracticeDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Practice',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.foreground,
            }}
          />
          <Stack.Screen
            name="ChallengeDetail"
            component={ChallengeDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Challenge',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.foreground,
            }}
          />
          <Stack.Screen
            name="EventDetail"
            component={EventDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Event',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.foreground,
            }}
          />
          <Stack.Screen
            name="JournalEntry"
            component={JournalEntryScreen}
            options={{
              headerShown: true,
              headerTitle: 'Journal Entry',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.foreground,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Settings',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.foreground,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
