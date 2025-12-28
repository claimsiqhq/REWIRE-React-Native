import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/lib/auth-context";
import { useGamification } from "@/src/hooks/use-api";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { data: gamification } = useGamification();

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      title: "Account",
      items: [
        { icon: "user", label: "Edit Profile", onPress: () => {} },
        { icon: "lock", label: "Change Password", onPress: () => {} },
        { icon: "bell", label: "Notifications", onPress: () => {} },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: "moon", label: "Dark Mode", value: "On", onPress: () => {} },
        { icon: "volume-2", label: "Voice Guidance", value: "On", onPress: () => {} },
        { icon: "clock", label: "Reminders", onPress: () => {} },
      ],
    },
    {
      title: "Coach",
      items: [
        { icon: "users", label: "My Coach", onPress: () => {} },
        { icon: "mail", label: "Join Coach", onPress: () => {} },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "help-circle", label: "Help & FAQ", onPress: () => {} },
        { icon: "message-circle", label: "Contact Us", onPress: () => {} },
        { icon: "info", label: "About", onPress: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-foreground text-2xl font-bold">Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="px-5 mb-6">
          <View className="bg-card rounded-2xl p-5 border border-border">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
                <Text className="text-white text-2xl font-bold">
                  {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "W"}
                </Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-foreground text-xl font-bold">
                  {user?.firstName || user?.username || "Warrior"}
                </Text>
                <Text className="text-muted-foreground">
                  {user?.email || "warrior@rewire.app"}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Feather name="award" size={14} color="#4A7C59" />
                  <Text className="text-primary text-sm ml-1">
                    Level {gamification?.level || 1} • {gamification?.totalXp || 0} XP
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats Row */}
            <View className="flex-row mt-5 pt-5 border-t border-border">
              <View className="flex-1 items-center">
                <Text className="text-foreground text-xl font-bold">
                  {gamification?.currentStreak || 0}
                </Text>
                <Text className="text-muted-foreground text-sm">Day Streak</Text>
              </View>
              <View className="w-px bg-border" />
              <View className="flex-1 items-center">
                <Text className="text-foreground text-xl font-bold">
                  {gamification?.longestStreak || 0}
                </Text>
                <Text className="text-muted-foreground text-sm">Best Streak</Text>
              </View>
              <View className="w-px bg-border" />
              <View className="flex-1 items-center">
                <Text className="text-foreground text-xl font-bold">
                  {user?.role === "coach" ? "Coach" : "Warrior"}
                </Text>
                <Text className="text-muted-foreground text-sm">Role</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuItems.map((section) => (
          <View key={section.title} className="px-5 mb-6">
            <Text className="text-muted-foreground text-sm font-medium mb-3">
              {section.title.toUpperCase()}
            </Text>
            <View className="bg-card rounded-2xl border border-border overflow-hidden">
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.label}
                  className={`flex-row items-center px-4 py-4 ${
                    index < section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                  onPress={item.onPress}
                >
                  <View className="w-9 h-9 bg-muted rounded-full items-center justify-center">
                    <Feather name={item.icon as any} size={18} color="#A0A0A0" />
                  </View>
                  <Text className="flex-1 text-foreground ml-3">{item.label}</Text>
                  {"value" in item && (
                    <Text className="text-muted-foreground mr-2">{item.value}</Text>
                  )}
                  <Feather name="chevron-right" size={20} color="#A0A0A0" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View className="px-5 mb-8">
          <TouchableOpacity
            className="bg-destructive/10 rounded-2xl py-4 flex-row items-center justify-center"
            onPress={handleLogout}
          >
            <Feather name="log-out" size={20} color="#DC3545" />
            <Text className="text-destructive font-semibold ml-2">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View className="items-center mb-8">
          <Text className="text-muted-foreground text-sm">REWIRE v1.0.0</Text>
        </View>

        {/* Bottom padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
