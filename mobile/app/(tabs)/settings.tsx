import { View, ScrollView, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Text, H3, Card, PressableCard } from "@/src/components/ui";
import { colors, spacing } from "@/src/theme";

interface SettingsItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
}

function SettingsItem({ icon, label, value, onPress }: SettingsItemProps) {
  return (
    <PressableCard
      className="flex-row items-center justify-between p-4 rounded-none"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <Feather name={icon as any} size={22} color={colors.accent} />
        <Text variant="body" color="foreground">
          {label}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        {value && (
          <Text variant="body" color="mutedForeground">
            {value}
          </Text>
        )}
        <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
      </View>
    </PressableCard>
  );
}

export default function SettingsScreen() {
  const handleComingSoon = (feature: string) => {
    Alert.alert("Coming Soon", `${feature} settings will be available soon!`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          {/* Account Section */}
          <H3 className="mt-5 mb-2 ml-1">Account</H3>
          <Card className="p-0 overflow-hidden">
            <SettingsItem
              icon="user"
              label="Edit Profile"
              onPress={() => handleComingSoon("Edit Profile")}
            />
            <SettingsItem
              icon="lock"
              label="Change Password"
              onPress={() => handleComingSoon("Change Password")}
            />
            <SettingsItem
              icon="mail"
              label="Email Preferences"
              onPress={() => handleComingSoon("Email Preferences")}
            />
          </Card>

          {/* App Settings */}
          <H3 className="mt-5 mb-2 ml-1">App Settings</H3>
          <Card className="p-0 overflow-hidden">
            <SettingsItem
              icon="bell"
              label="Notifications"
              onPress={() => handleComingSoon("Notification")}
            />
            <SettingsItem
              icon="moon"
              label="Appearance"
              value="Dark"
              onPress={() => handleComingSoon("Appearance")}
            />
            <SettingsItem
              icon="volume-2"
              label="Sound & Haptics"
              onPress={() => handleComingSoon("Sound")}
            />
          </Card>

          {/* Data & Privacy */}
          <H3 className="mt-5 mb-2 ml-1">Data & Privacy</H3>
          <Card className="p-0 overflow-hidden">
            <SettingsItem
              icon="download"
              label="Export Data"
              onPress={() => handleComingSoon("Export")}
            />
            <SettingsItem
              icon="shield"
              label="Privacy Policy"
              onPress={() => Linking.openURL("https://rewire.com/privacy")}
            />
            <SettingsItem
              icon="file-text"
              label="Terms of Service"
              onPress={() => Linking.openURL("https://rewire.com/terms")}
            />
          </Card>

          {/* About */}
          <H3 className="mt-5 mb-2 ml-1">About</H3>
          <Card className="p-0 overflow-hidden">
            <SettingsItem
              icon="info"
              label="Version"
              value="1.0.0"
              onPress={() => {}}
            />
            <SettingsItem
              icon="help-circle"
              label="Help Center"
              onPress={() => handleComingSoon("Help Center")}
            />
            <SettingsItem
              icon="message-circle"
              label="Send Feedback"
              onPress={() => handleComingSoon("Feedback")}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
