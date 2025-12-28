import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

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

// Mock hooks for coach functionality - would need to add to api.ts
const useCoachClients = () => ({
  data: [] as any[],
  isLoading: false,
  refetch: async () => {},
});

const useCreateCoachInvite = () => ({
  mutate: async (data: any) => {},
  isPending: false,
});

const useCoachInvites = () => ({
  data: [] as any[],
  isLoading: false,
});

const useUnreadNotificationCount = () => ({
  data: { count: 0 },
});

export default function CoachDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');

  const { data: clients, isLoading: loadingClients, refetch: refetchClients } = useCoachClients();
  const { data: invites, isLoading: loadingInvites } = useCoachInvites();
  const { data: notifications } = useUnreadNotificationCount();
  const createInvite = useCreateCoachInvite();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetchClients();
    setIsRefreshing(false);
  };

  const handleCreateInvite = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createInvite.mutate({ email: inviteEmail, name: inviteName });
    setInviteEmail('');
    setInviteName('');
    setShowInviteForm(false);
    Alert.alert('Success', 'Invitation sent!');
  };

  const handleCopyInviteLink = async (code: string) => {
    await Clipboard.setStringAsync(`https://rewire.app/join/${code}`);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied', 'Invite link copied to clipboard');
  };

  const handleShareInviteLink = async (code: string) => {
    try {
      await Share.share({
        message: `Join me on REWIRE for your transformation journey! Use this link: https://rewire.app/join/${code}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loadingClients) {
    return <LoadingContainer />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <H1 color="birch">Brotherhood</H1>
          <Text variant="body" color="mutedForeground">
            Guide Dashboard
          </Text>
        </View>
        {notifications && notifications.count > 0 && (
          <View style={styles.notificationBadge}>
            <Ionicons name="notifications" size={24} color={colors.foreground} />
            <Badge variant="destructive" size="sm" style={styles.badgeCount}>
              {notifications.count}
            </Badge>
          </View>
        )}
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
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text variant="displayMedium" color="accent">
              {clients?.length || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Active Warriors
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text variant="displayMedium" color="gold">
              {invites?.filter((i: any) => i.status === 'pending').length || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Pending Invites
            </Text>
          </Card>
        </View>

        {/* Invite Section */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <H3 color="foreground">Invite Warriors</H3>
            <Button
              variant={showInviteForm ? 'outline' : 'default'}
              size="sm"
              onPress={() => setShowInviteForm(!showInviteForm)}
            >
              {showInviteForm ? 'Cancel' : 'New Invite'}
            </Button>
          </View>

          {showInviteForm && (
            <View style={styles.inviteForm}>
              <Input
                label="Name (optional)"
                placeholder="Warrior's name"
                value={inviteName}
                onChangeText={setInviteName}
                containerStyle={styles.input}
              />
              <Input
                label="Email"
                placeholder="warrior@example.com"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.input}
              />
              <Button
                variant="default"
                onPress={handleCreateInvite}
                loading={createInvite.isPending}
                fullWidth
              >
                Send Invitation
              </Button>
            </View>
          )}

          {/* Pending Invites */}
          {invites && invites.length > 0 && (
            <View style={styles.invitesList}>
              <Separator />
              <Text variant="label" color="mutedForeground" style={styles.listTitle}>
                Recent Invites
              </Text>
              {invites.slice(0, 5).map((invite: any) => (
                <View key={invite.id} style={styles.inviteItem}>
                  <View style={styles.inviteInfo}>
                    <Text variant="body" color="foreground">
                      {invite.inviteeName || invite.inviteeEmail || 'Unnamed'}
                    </Text>
                    <Badge
                      variant={invite.status === 'pending' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {invite.status}
                    </Badge>
                  </View>
                  {invite.status === 'pending' && (
                    <View style={styles.inviteActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => handleCopyInviteLink(invite.code)}
                      >
                        <Ionicons name="copy-outline" size={18} color={colors.foreground} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => handleShareInviteLink(invite.code)}
                      >
                        <Ionicons name="share-outline" size={18} color={colors.foreground} />
                      </Button>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Client List */}
        <Card style={styles.section}>
          <H3 style={styles.sectionTitle}>Your Warriors</H3>
          {clients && clients.length > 0 ? (
            <View style={styles.clientList}>
              {clients.map((client: any) => (
                <PressableCard
                  key={client.id}
                  style={styles.clientCard}
                  onPress={() => Alert.alert('View Client', 'Client detail view coming soon')}
                >
                  <View style={styles.clientAvatar}>
                    <Text variant="h3" color="accent">
                      {client.firstName?.[0] || client.email?.[0] || 'W'}
                    </Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text variant="labelLarge" color="foreground">
                      {client.firstName
                        ? `${client.firstName} ${client.lastName || ''}`
                        : 'Warrior'}
                    </Text>
                    <Text variant="caption" color="mutedForeground">
                      {client.email}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
                </PressableCard>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={colors.mutedForeground} />
              <Text variant="body" color="mutedForeground" align="center">
                No warriors yet. Send an invite to get started!
              </Text>
            </View>
          )}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.section}>
          <H3 style={styles.sectionTitle}>Quick Actions</H3>
          <View style={styles.quickActions}>
            <PressableCard
              style={styles.actionCard}
              onPress={() => Alert.alert('Coming Soon', 'Assign homework feature coming soon')}
            >
              <Ionicons name="document-text-outline" size={24} color={colors.accent} />
              <Text variant="label" color="foreground">
                Assign Homework
              </Text>
            </PressableCard>
            <PressableCard
              style={styles.actionCard}
              onPress={() => Alert.alert('Coming Soon', 'Schedule session feature coming soon')}
            >
              <Ionicons name="calendar-outline" size={24} color={colors.teal} />
              <Text variant="label" color="foreground">
                Schedule Session
              </Text>
            </PressableCard>
            <PressableCard
              style={styles.actionCard}
              onPress={() => Alert.alert('Coming Soon', 'Group message feature coming soon')}
            >
              <Ionicons name="chatbubbles-outline" size={24} color={colors.violet} />
              <Text variant="label" color="foreground">
                Group Message
              </Text>
            </PressableCard>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
  },
  notificationBadge: {
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  section: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  inviteForm: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  input: {
    marginBottom: spacing.sm,
  },
  invitesList: {
    marginTop: spacing.md,
  },
  listTitle: {
    marginVertical: spacing.md,
  },
  inviteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  inviteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inviteActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  clientList: {
    gap: spacing.sm,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  clientInfo: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.sm,
  },
});
