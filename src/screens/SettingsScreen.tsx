import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '@/theme';
import {
  Text,
  H3,
  Card,
  PressableCard,
  Separator,
} from '@/components/ui';

interface SettingsItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
}

function SettingsItem({ icon, label, value, onPress }: SettingsItemProps) {
  return (
    <PressableCard style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon as any} size={22} color={colors.accent} />
        <Text variant="body" color="foreground">
          {label}
        </Text>
      </View>
      <View style={styles.itemRight}>
        {value && (
          <Text variant="body" color="mutedForeground">
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
      </View>
    </PressableCard>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const handleComingSoon = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} settings will be available soon!`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <H3 style={styles.sectionTitle}>Account</H3>
        <Card style={styles.section}>
          <SettingsItem
            icon="person-outline"
            label="Edit Profile"
            onPress={() => handleComingSoon('Edit Profile')}
          />
          <SettingsItem
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => handleComingSoon('Change Password')}
          />
          <SettingsItem
            icon="mail-outline"
            label="Email Preferences"
            onPress={() => handleComingSoon('Email Preferences')}
          />
        </Card>

        {/* App Settings */}
        <H3 style={styles.sectionTitle}>App Settings</H3>
        <Card style={styles.section}>
          <SettingsItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => handleComingSoon('Notification')}
          />
          <SettingsItem
            icon="moon-outline"
            label="Appearance"
            value="Dark"
            onPress={() => handleComingSoon('Appearance')}
          />
          <SettingsItem
            icon="volume-high-outline"
            label="Sound & Haptics"
            onPress={() => handleComingSoon('Sound')}
          />
        </Card>

        {/* Data & Privacy */}
        <H3 style={styles.sectionTitle}>Data & Privacy</H3>
        <Card style={styles.section}>
          <SettingsItem
            icon="download-outline"
            label="Export Data"
            onPress={() => handleComingSoon('Export')}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => Linking.openURL('https://rewire.com/privacy')}
          />
          <SettingsItem
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Linking.openURL('https://rewire.com/terms')}
          />
        </Card>

        {/* About */}
        <H3 style={styles.sectionTitle}>About</H3>
        <Card style={styles.section}>
          <SettingsItem
            icon="information-circle-outline"
            label="Version"
            value="1.0.0"
            onPress={() => {}}
          />
          <SettingsItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => handleComingSoon('Help Center')}
          />
          <SettingsItem
            icon="chatbox-outline"
            label="Send Feedback"
            onPress={() => handleComingSoon('Feedback')}
          />
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
  scrollContent: {
    padding: spacing.base,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  section: {
    padding: 0,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
