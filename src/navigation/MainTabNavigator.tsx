import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { colors, layout } from '@/theme';
import { useAuth } from '@/hooks/useAuth';

// Import screens
import HomeScreen from '@/screens/HomeScreen';
import FocusScreen from '@/screens/FocusScreen';
import LibraryScreen from '@/screens/LibraryScreen';
import JournalScreen from '@/screens/JournalScreen';
import CoachScreen from '@/screens/CoachScreen';
import ChallengesScreen from '@/screens/ChallengesScreen';
import EventsScreen from '@/screens/EventsScreen';
import MetricsScreen from '@/screens/MetricsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import CoachDashboardScreen from '@/screens/CoachDashboardScreen';
import AdminPanelScreen from '@/screens/AdminPanelScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

// Core tabs shown to all users
const coreTabIcons: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Focus: { active: 'flower', inactive: 'flower-outline' },
  Library: { active: 'library', inactive: 'library-outline' },
  Coach: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

// Alternative layouts for different user roles
const coachTabIcons: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Brotherhood: { active: 'people', inactive: 'people-outline' },
  Library: { active: 'library', inactive: 'library-outline' },
  Coach: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const isCoach = user?.role === 'coach' || user?.role === 'superadmin';
  const isAdmin = user?.role === 'superadmin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: layout.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = isCoach ? coachTabIcons : coreTabIcons;
          const iconConfig = icons[route.name];
          if (!iconConfig) return null;
          const iconName = focused ? iconConfig.active : iconConfig.inactive;
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />

      {isCoach ? (
        // Coach gets Brotherhood tab instead of Focus
        <Tab.Screen
          name="Brotherhood"
          component={CoachDashboardScreen}
          options={{ tabBarLabel: 'Brotherhood' }}
        />
      ) : (
        <Tab.Screen
          name="Focus"
          component={FocusScreen}
          options={{ tabBarLabel: 'Focus' }}
        />
      )}

      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{ tabBarLabel: 'Library' }}
      />

      <Tab.Screen
        name="Coach"
        component={CoachScreen}
        options={{ tabBarLabel: 'Coach' }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />

      {/* Hidden screens accessible via navigation */}
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Metrics"
        component={MetricsScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}
