import { useState } from "react";
import { View, ScrollView, RefreshControl, Alert, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "@/src/lib/auth-context";
import { colors, spacing } from "@/src/theme";
import {
  Text,
  H1,
  H3,
  Card,
  PressableCard,
  Button,
  Badge,
  Input,
  Separator,
  LoadingContainer,
} from "@/src/components/ui";

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
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");

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
      Alert.alert("Error", "Please enter an email address");
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createInvite.mutate({ email: inviteEmail, name: inviteName });
    setInviteEmail("");
    setInviteName("");
    setShowInviteForm(false);
    Alert.alert("Success", "Invitation sent!");
  };

  const handleCopyInviteLink = async (code: string) => {
    await Clipboard.setStringAsync(`https://rewire.app/join/${code}`);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copied", "Invite link copied to clipboard");
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
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingContainer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="flex-row justify-between items-start px-4 pb-3">
        <View>
          <H1 color="birch">Brotherhood</H1>
          <Text variant="body" color="mutedForeground">
            Guide Dashboard
          </Text>
        </View>
        {notifications && notifications.count > 0 && (
          <View className="relative">
            <Feather name="bell" size={24} color={colors.foreground} />
            <Badge variant="destructive" size="sm" className="absolute -top-1 -right-1">
              {notifications.count}
            </Badge>
          </View>
        )}
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
        <View className="flex-row gap-3 mb-5">
          <Card className="flex-1 items-center p-5">
            <Text variant="displayMedium" color="accent">
              {clients?.length || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Active Warriors
            </Text>
          </Card>
          <Card className="flex-1 items-center p-5">
            <Text variant="displayMedium" color="gold">
              {invites?.filter((i: any) => i.status === "pending").length || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Pending Invites
            </Text>
          </Card>
        </View>

        {/* Invite Section */}
        <Card className="p-5 mb-3">
          <View className="flex-row justify-between items-center mb-3">
            <H3 color="foreground">Invite Warriors</H3>
            <Button
              variant={showInviteForm ? "outline" : "default"}
              size="sm"
              onPress={() => setShowInviteForm(!showInviteForm)}
            >
              {showInviteForm ? "Cancel" : "New Invite"}
            </Button>
          </View>

          {showInviteForm && (
            <View className="mt-3 gap-2">
              <Input
                label="Name (optional)"
                placeholder="Warrior's name"
                value={inviteName}
                onChangeText={setInviteName}
                className="mb-2"
              />
              <Input
                label="Email"
                placeholder="warrior@example.com"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="mb-2"
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
            <View className="mt-3">
              <Separator />
              <Text variant="label" color="mutedForeground" className="my-3">
                Recent Invites
              </Text>
              {invites.slice(0, 5).map((invite: any) => (
                <View key={invite.id} className="flex-row justify-between items-center py-2">
                  <View className="flex-row items-center gap-2">
                    <Text variant="body" color="foreground">
                      {invite.inviteeName || invite.inviteeEmail || "Unnamed"}
                    </Text>
                    <Badge variant={invite.status === "pending" ? "warning" : "success"} size="sm">
                      {invite.status}
                    </Badge>
                  </View>
                  {invite.status === "pending" && (
                    <View className="flex-row gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => handleCopyInviteLink(invite.code)}
                      >
                        <Feather name="copy" size={18} color={colors.foreground} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => handleShareInviteLink(invite.code)}
                      >
                        <Feather name="share-2" size={18} color={colors.foreground} />
                      </Button>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Client List */}
        <Card className="p-5 mb-3">
          <H3 className="mb-3">Your Warriors</H3>
          {clients && clients.length > 0 ? (
            <View className="gap-2">
              {clients.map((client: any) => (
                <PressableCard
                  key={client.id}
                  className="flex-row items-center p-3"
                  onPress={() => Alert.alert("View Client", "Client detail view coming soon")}
                >
                  <View className="w-11 h-11 bg-accent/30 rounded-full items-center justify-center mr-3">
                    <Text variant="h3" color="accent">
                      {client.firstName?.[0] || client.email?.[0] || "W"}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text variant="labelLarge" color="foreground">
                      {client.firstName ? `${client.firstName} ${client.lastName || ""}` : "Warrior"}
                    </Text>
                    <Text variant="caption" color="mutedForeground">
                      {client.email}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
                </PressableCard>
              ))}
            </View>
          ) : (
            <View className="items-center py-6 gap-2">
              <Feather name="users" size={48} color={colors.mutedForeground} />
              <Text variant="body" color="mutedForeground" align="center">
                No warriors yet. Send an invite to get started!
              </Text>
            </View>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-5">
          <H3 className="mb-3">Quick Actions</H3>
          <View className="flex-row gap-3">
            <PressableCard
              className="flex-1 items-center p-4 gap-2"
              onPress={() => Alert.alert("Coming Soon", "Assign homework feature coming soon")}
            >
              <Feather name="file-text" size={24} color={colors.accent} />
              <Text variant="label" color="foreground">
                Assign Homework
              </Text>
            </PressableCard>
            <PressableCard
              className="flex-1 items-center p-4 gap-2"
              onPress={() => Alert.alert("Coming Soon", "Schedule session feature coming soon")}
            >
              <Feather name="calendar" size={24} color={colors.teal} />
              <Text variant="label" color="foreground">
                Schedule Session
              </Text>
            </PressableCard>
            <PressableCard
              className="flex-1 items-center p-4 gap-2"
              onPress={() => Alert.alert("Coming Soon", "Group message feature coming soon")}
            >
              <Feather name="message-circle" size={24} color={colors.violet} />
              <Text variant="label" color="foreground">
                Group Message
              </Text>
            </PressableCard>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
