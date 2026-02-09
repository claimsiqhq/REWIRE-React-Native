import { useState } from "react";
import { View, ScrollView, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/src/lib/auth-context";
import { colors, spacing } from "@/src/theme";
import {
  Text,
  H1,
  H2,
  H3,
  Card,
  PressableCard,
  Button,
  Input,
  LoadingContainer,
} from "@/src/components/ui";

import { useAdminStats, useAdminUsers, useUpdateUserRole } from "@/src/hooks/use-api";

export default function AdminPanelScreen() {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats, isLoading } = useAdminStats();

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Refresh data
    setIsRefreshing(false);
  };

  const handleManageUsers = () => {
    // TODO: Navigate to user management screen when implemented
    Alert.alert("User Management", "User management screen coming soon. Use the search to find users.");
  };

  const handleManageEvents = () => {
    Alert.alert("Coming Soon", "Event management interface coming soon");
  };

  const handleManageChallenges = () => {
    Alert.alert("Coming Soon", "Challenge management interface coming soon");
  };

  const handleViewAnalytics = () => {
    Alert.alert("Coming Soon", "Analytics dashboard coming soon");
  };

  const handleSeedData = async () => {
    Alert.alert(
      "Seed Data",
      "This will add sample practices and events to the database. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Seed",
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Success", "Sample data has been seeded");
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingContainer />
      </SafeAreaView>
    );
  }

  // Check admin access
  if (user?.role !== "superadmin") {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 items-center justify-center p-6 gap-3">
          <Feather name="lock" size={64} color={colors.destructive} />
          <H2 color="foreground">Access Denied</H2>
          <Text variant="body" color="mutedForeground" align="center">
            You need administrator privileges to access this panel.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pb-3">
        <H1 color="birch">Admin Panel</H1>
        <Text variant="body" color="mutedForeground">
          System Management
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: spacing.base, paddingBottom: spacing["3xl"] }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        {/* Stats Overview */}
        <View className="flex-row flex-wrap gap-3 mb-5">
          <Card className="w-[47%] items-center p-5">
            <Text variant="displayMedium" color="accent">
              {stats?.totalUsers || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Total Users
            </Text>
          </Card>
          <Card className="w-[47%] items-center p-5">
            <Text variant="displayMedium" color="gold">
              {stats?.totalCoaches || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Coaches
            </Text>
          </Card>
          <Card className="w-[47%] items-center p-5">
            <Text variant="displayMedium" color="teal">
              {stats?.totalClients || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Warriors
            </Text>
          </Card>
          <Card className="w-[47%] items-center p-5">
            <Text variant="displayMedium" color="success">
              {stats?.activeToday || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Active Today
            </Text>
          </Card>
        </View>

        {/* User Search */}
        <Card className="p-5 mb-3">
          <H3 className="mb-3">User Management</H3>
          <Input
            placeholder="Search users by email or name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Feather name="search" size={20} color={colors.mutedForeground} />}
            className="mb-3"
          />
          <Button variant="default" onPress={handleManageUsers} fullWidth>
            Manage Users
          </Button>
        </Card>

        {/* Quick Actions */}
        <Card className="p-5 mb-3">
          <H3 className="mb-3">Quick Actions</H3>
          <View className="gap-2">
            <PressableCard className="flex-row items-center p-3" onPress={handleManageUsers}>
              <View
                className="w-11 h-11 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.accent}20` }}
              >
                <Feather name="users" size={24} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text variant="labelLarge" color="foreground">
                  Users
                </Text>
                <Text variant="caption" color="mutedForeground">
                  Manage accounts & roles
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
            </PressableCard>

            <PressableCard className="flex-row items-center p-3" onPress={handleManageEvents}>
              <View
                className="w-11 h-11 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.teal}20` }}
              >
                <Feather name="calendar" size={24} color={colors.teal} />
              </View>
              <View className="flex-1">
                <Text variant="labelLarge" color="foreground">
                  Events
                </Text>
                <Text variant="caption" color="mutedForeground">
                  Create & manage events
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
            </PressableCard>

            <PressableCard className="flex-row items-center p-3" onPress={handleManageChallenges}>
              <View
                className="w-11 h-11 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.gold}20` }}
              >
                <Feather name="award" size={24} color={colors.gold} />
              </View>
              <View className="flex-1">
                <Text variant="labelLarge" color="foreground">
                  Challenges
                </Text>
                <Text variant="caption" color="mutedForeground">
                  Create & manage challenges
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
            </PressableCard>

            <PressableCard className="flex-row items-center p-3" onPress={handleViewAnalytics}>
              <View
                className="w-11 h-11 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.violet}20` }}
              >
                <Feather name="bar-chart-2" size={24} color={colors.violet} />
              </View>
              <View className="flex-1">
                <Text variant="labelLarge" color="foreground">
                  Analytics
                </Text>
                <Text variant="caption" color="mutedForeground">
                  View platform metrics
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
            </PressableCard>
          </View>
        </Card>

        {/* System Actions */}
        <Card className="p-5 mb-3">
          <H3 className="mb-3">System</H3>
          <View className="gap-2">
            <Button
              variant="outline"
              onPress={handleSeedData}
              leftIcon={<Feather name="leaf" size={18} color={colors.foreground} />}
              fullWidth
              className="justify-start"
            >
              Seed Default Data
            </Button>
            <Button
              variant="outline"
              onPress={() => Alert.alert("Coming Soon", "Cache management coming soon")}
              leftIcon={<Feather name="refresh-cw" size={18} color={colors.foreground} />}
              fullWidth
              className="justify-start"
            >
              Clear Cache
            </Button>
            <Button
              variant="outline"
              onPress={() => Alert.alert("Coming Soon", "Logs viewer coming soon")}
              leftIcon={<Feather name="file-text" size={18} color={colors.foreground} />}
              fullWidth
              className="justify-start"
            >
              View Logs
            </Button>
          </View>
        </Card>

        {/* Warning Zone */}
        <Card className="p-5 border border-destructive/40">
          <H3 color="destructive" className="mb-3">
            Danger Zone
          </H3>
          <Text variant="body" color="mutedForeground" className="mb-3">
            These actions can have significant impact on the system.
          </Text>
          <Button
            variant="destructive"
            onPress={() =>
              Alert.alert(
                "Database Maintenance",
                "This will perform database cleanup. Are you sure?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Proceed", style: "destructive", onPress: () => {} },
                ]
              )
            }
            leftIcon={<Feather name="alert-triangle" size={18} color={colors.destructiveForeground} />}
            fullWidth
          >
            Database Maintenance
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
