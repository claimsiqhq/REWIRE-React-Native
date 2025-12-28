import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/hooks/useAuth';
import { useGamification, useDashboardStats } from '@/lib/api';
import { colors, spacing, borderRadius } from '@/theme';
import {
  Text,
  H1,
  H2,
  Card,
  PressableCard,
  Button,
  Badge,
  Separator,
} from '@/components/ui';

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({ icon, label, onPress, destructive }: MenuItemProps) {
  return (
    <PressableCard
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons
          name={icon as any}
          size={22}
          color={destructive ? colors.destructive : colors.foreground}
        />
        <Text
          variant="body"
          color={destructive ? 'destructive' : 'foreground'}
        >
          {label}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.mutedForeground}
      />
    </PressableCard>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const { data: gamification } = useGamification();
  const { data: stats } = useDashboardStats();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await logout();
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    navigation.navigate('Settings' as never);
  };

  const xpProgress = gamification
    ? (gamification.totalXp % gamification.xpToNextLevel) / gamification.xpToNextLevel
    : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <H1 color="birch">Profile</H1>
        </View>

        {/* User Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatar}>
            <Text variant="displayLarge" color="accent">
              {user?.firstName?.[0] || user?.email?.[0] || 'W'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <H2 color="foreground">
              {user?.firstName
                ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
                : 'Warrior'}
            </H2>
            <Text variant="body" color="mutedForeground">
              {user?.email}
            </Text>
            <Badge variant="secondary" size="sm" style={styles.roleBadge}>
              {user?.role || 'client'}
            </Badge>
          </View>
        </Card>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text variant="displaySmall" color="gold">
                {gamification?.currentLevel || 1}
              </Text>
              <Text variant="caption" color="mutedForeground">Level</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="displaySmall" color="accent">
                {gamification?.totalXp || 0}
              </Text>
              <Text variant="caption" color="mutedForeground">Total XP</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="displaySmall" color="success">
                {stats?.currentStreak || 0}
              </Text>
              <Text variant="caption" color="mutedForeground">Day Streak</Text>
            </View>
          </View>

          {/* XP Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text variant="caption" color="mutedForeground">
                Level {gamification?.currentLevel || 1}
              </Text>
              <Text variant="caption" color="mutedForeground">
                Level {(gamification?.currentLevel || 1) + 1}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${xpProgress * 100}%` }]}
              />
            </View>
            <Text variant="caption" color="accent" align="center">
              {gamification?.xpToNextLevel
                ? `${gamification.xpToNextLevel - (gamification.totalXp % gamification.xpToNextLevel)} XP to next level`
                : 'Loading...'}
            </Text>
          </View>
        </Card>

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem
            icon="settings-outline"
            label="Settings"
            onPress={handleSettings}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => Alert.alert('Coming Soon', 'Help center coming soon!')}
          />
          <MenuItem
            icon="information-circle-outline"
            label="About REWIRE"
            onPress={() => Alert.alert('REWIRE', 'Version 1.0.0\n\nTransform your mindset.')}
          />

          <Separator style={styles.separator} />

          <MenuItem
            icon="log-out-outline"
            label="Sign Out"
            onPress={handleLogout}
            destructive
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  header: {
    marginBottom: spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  roleBadge: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  statsCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  progressContainer: {
    gap: spacing.sm,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: borderRadius.full,
  },
  menu: {
    gap: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  separator: {
    marginVertical: spacing.md,
  },
});
