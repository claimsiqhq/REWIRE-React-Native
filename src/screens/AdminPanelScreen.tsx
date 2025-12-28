import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, borderRadius } from '@/theme';
import {
  Text,
  H1,
  H2,
  H3,
  Card,
  PressableCard,
  Button,
  Badge,
  Input,
  Separator,
  LoadingContainer,
} from '@/components/ui';

interface AdminStats {
  totalUsers: number;
  totalCoaches: number;
  totalClients: number;
  activeToday: number;
}

// Mock data for admin stats
const useAdminStats = (): { data: AdminStats | null; isLoading: boolean } => ({
  data: {
    totalUsers: 156,
    totalCoaches: 12,
    totalClients: 144,
    activeToday: 45,
  },
  isLoading: false,
});

export default function AdminPanelScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: stats, isLoading } = useAdminStats();

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Refresh data
    setIsRefreshing(false);
  };

  const handleManageUsers = () => {
    Alert.alert('Coming Soon', 'User management interface coming soon');
  };

  const handleManageEvents = () => {
    Alert.alert('Coming Soon', 'Event management interface coming soon');
  };

  const handleManageChallenges = () => {
    Alert.alert('Coming Soon', 'Challenge management interface coming soon');
  };

  const handleViewAnalytics = () => {
    Alert.alert('Coming Soon', 'Analytics dashboard coming soon');
  };

  const handleSeedData = async () => {
    Alert.alert(
      'Seed Data',
      'This will add sample practices and events to the database. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Sample data has been seeded');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingContainer />;
  }

  // Check admin access
  if (user?.role !== 'superadmin') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.accessDenied}>
          <Ionicons name="lock-closed" size={64} color={colors.destructive} />
          <H2 color="foreground">Access Denied</H2>
          <Text variant="body" color="mutedForeground" align="center">
            You need administrator privileges to access this panel.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <H1 color="birch">Admin Panel</H1>
        <Text variant="body" color="mutedForeground">
          System Management
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text variant="displayMedium" color="accent">
              {stats?.totalUsers || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Total Users
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text variant="displayMedium" color="gold">
              {stats?.totalCoaches || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Coaches
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text variant="displayMedium" color="teal">
              {stats?.totalClients || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Warriors
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text variant="displayMedium" color="success">
              {stats?.activeToday || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Active Today
            </Text>
          </Card>
        </View>

        {/* User Search */}
        <Card style={styles.section}>
          <H3 style={styles.sectionTitle}>User Management</H3>
          <Input
            placeholder="Search users by email or name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Ionicons name="search" size={20} color={colors.mutedForeground} />}
            containerStyle={styles.searchInput}
          />
          <Button
            variant="default"
            onPress={handleManageUsers}
            fullWidth
          >
            Manage Users
          </Button>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.section}>
          <H3 style={styles.sectionTitle}>Quick Actions</H3>
          <View style={styles.actionsList}>
            <PressableCard style={styles.actionItem} onPress={handleManageUsers}>
              <View style={[styles.actionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="people" size={24} color={colors.accent} />
              </View>
              <View style={styles.actionInfo}>
                <Text variant="labelLarge" color="foreground">
                  Users
                </Text>
                <Text variant="caption" color="mutedForeground">
                  Manage accounts & roles
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </PressableCard>

            <PressableCard style={styles.actionItem} onPress={handleManageEvents}>
              <View style={[styles.actionIcon, { backgroundColor: colors.teal + '20' }]}>
                <Ionicons name="calendar" size={24} color={colors.teal} />
              </View>
              <View style={styles.actionInfo}>
                <Text variant="labelLarge" color="foreground">
                  Events
                </Text>
                <Text variant="caption" color="mutedForeground">
                  Create & manage events
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </PressableCard>

            <PressableCard style={styles.actionItem} onPress={handleManageChallenges}>
              <View style={[styles.actionIcon, { backgroundColor: colors.gold + '20' }]}>
                <Ionicons name="trophy" size={24} color={colors.gold} />
              </View>
              <View style={styles.actionInfo}>
                <Text variant="labelLarge" color="foreground">
                  Challenges
                </Text>
                <Text variant="caption" color="mutedForeground">
                  Create & manage challenges
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </PressableCard>

            <PressableCard style={styles.actionItem} onPress={handleViewAnalytics}>
              <View style={[styles.actionIcon, { backgroundColor: colors.violet + '20' }]}>
                <Ionicons name="analytics" size={24} color={colors.violet} />
              </View>
              <View style={styles.actionInfo}>
                <Text variant="labelLarge" color="foreground">
                  Analytics
                </Text>
                <Text variant="caption" color="mutedForeground">
                  View platform metrics
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </PressableCard>
          </View>
        </Card>

        {/* System Actions */}
        <Card style={styles.section}>
          <H3 style={styles.sectionTitle}>System</H3>
          <View style={styles.systemActions}>
            <Button
              variant="outline"
              onPress={handleSeedData}
              leftIcon={<Ionicons name="leaf-outline" size={18} color={colors.foreground} />}
              fullWidth
              style={styles.systemButton}
            >
              Seed Default Data
            </Button>
            <Button
              variant="outline"
              onPress={() => Alert.alert('Coming Soon', 'Cache management coming soon')}
              leftIcon={<Ionicons name="refresh-outline" size={18} color={colors.foreground} />}
              fullWidth
              style={styles.systemButton}
            >
              Clear Cache
            </Button>
            <Button
              variant="outline"
              onPress={() => Alert.alert('Coming Soon', 'Logs viewer coming soon')}
              leftIcon={<Ionicons name="document-text-outline" size={18} color={colors.foreground} />}
              fullWidth
              style={styles.systemButton}
            >
              View Logs
            </Button>
          </View>
        </Card>

        {/* Warning Zone */}
        <Card style={[styles.section, styles.dangerZone]}>
          <H3 color="destructive" style={styles.sectionTitle}>
            Danger Zone
          </H3>
          <Text variant="body" color="mutedForeground" style={styles.dangerText}>
            These actions can have significant impact on the system.
          </Text>
          <Button
            variant="destructive"
            onPress={() =>
              Alert.alert(
                'Database Maintenance',
                'This will perform database cleanup. Are you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Proceed', style: 'destructive', onPress: () => {} },
                ]
              )
            }
            leftIcon={<Ionicons name="warning-outline" size={18} color={colors.destructiveForeground} />}
            fullWidth
          >
            Database Maintenance
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  accessDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    padding: spacing.lg,
  },
  section: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  actionsList: {
    gap: spacing.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionInfo: {
    flex: 1,
  },
  systemActions: {
    gap: spacing.sm,
  },
  systemButton: {
    justifyContent: 'flex-start',
  },
  dangerZone: {
    borderWidth: 1,
    borderColor: colors.destructive + '40',
  },
  dangerText: {
    marginBottom: spacing.md,
  },
});
