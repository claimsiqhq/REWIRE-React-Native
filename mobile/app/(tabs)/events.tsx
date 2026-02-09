import { useState, useCallback } from "react";
import { View, ScrollView, RefreshControl, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import {
  useEvents,
  useMyEventRegistrations,
  useRegisterForEvent,
  type Event,
} from "@/src/hooks/use-api";
import { colors, spacing } from "@/src/theme";
import { Text, H1, Card, Button, Badge, LoadingContainer } from "@/src/components/ui";

type TabType = "upcoming" | "registered" | "recordings";

const EVENT_TYPE_ICONS: Record<string, string> = {
  retreat: "leaf",
  webinar: "video",
  masterclass: "book",
  workshop: "tool",
  group_session: "users",
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  retreat: colors.teal,
  webinar: colors.accent,
  masterclass: colors.gold,
  workshop: colors.ember,
  group_session: colors.violet,
};

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: upcomingEvents,
    isLoading: loadingUpcoming,
    refetch: refetchUpcoming,
  } = useEvents({ upcoming: true });
  const {
    data: recordingEvents,
    isLoading: loadingRecordings,
    refetch: refetchRecordings,
  } = useEvents({ hasRecording: true });
  const {
    data: myRegistrations,
    isLoading: loadingRegistrations,
    refetch: refetchRegistrations,
  } = useMyEventRegistrations();
  const registerForEvent = useRegisterForEvent();

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchUpcoming(), refetchRecordings(), refetchRegistrations()]);
    setIsRefreshing(false);
  }, [refetchUpcoming, refetchRecordings, refetchRegistrations]);

  const handleRegister = async (eventId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    registerForEvent.mutate(eventId);
  };

  const handleViewRecording = (url: string) => {
    Linking.openURL(url);
  };

  const isRegistered = (eventId: string) => {
    return myRegistrations?.some((r) => r.eventId === eventId) ?? false;
  };

  const formatEventDate = (startTime: string) => {
    return format(new Date(startTime), "MMM d, yyyy • h:mm a");
  };

  const formatPrice = (cents: number) => {
    if (cents === 0) return "Free";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getEvents = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingEvents;
      case "registered":
        return myRegistrations?.map((r) => r.event);
      case "recordings":
        return recordingEvents;
      default:
        return [];
    }
  };

  const isLoading =
    (activeTab === "upcoming" && loadingUpcoming) ||
    (activeTab === "registered" && loadingRegistrations) ||
    (activeTab === "recordings" && loadingRecordings);

  const events = getEvents();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pb-3">
        <H1 color="birch">Events</H1>
        <Text variant="body" color="mutedForeground">
          Connect with the community
        </Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.md }}
        className="gap-2"
      >
        <TouchableOpacity
          className={`flex-row items-center gap-1 px-3 py-2 bg-card rounded-full border ${
            activeTab === "upcoming" ? "border-accent bg-accent/15" : "border-transparent"
          }`}
          onPress={() => setActiveTab("upcoming")}
        >
          <Feather
            name="calendar"
            size={18}
            color={activeTab === "upcoming" ? colors.accent : colors.mutedForeground}
          />
          <Text
            variant="label"
            color={activeTab === "upcoming" ? "accent" : "mutedForeground"}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-row items-center gap-1 px-3 py-2 bg-card rounded-full border ${
            activeTab === "registered" ? "border-accent bg-accent/15" : "border-transparent"
          }`}
          onPress={() => setActiveTab("registered")}
        >
          <Feather
            name="check-circle"
            size={18}
            color={activeTab === "registered" ? colors.accent : colors.mutedForeground}
          />
          <Text
            variant="label"
            color={activeTab === "registered" ? "accent" : "mutedForeground"}
          >
            Registered
          </Text>
          {myRegistrations && myRegistrations.length > 0 && (
            <Badge variant="success" size="sm">
              {myRegistrations.length}
            </Badge>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-row items-center gap-1 px-3 py-2 bg-card rounded-full border ${
            activeTab === "recordings" ? "border-accent bg-accent/15" : "border-transparent"
          }`}
          onPress={() => setActiveTab("recordings")}
        >
          <Feather
            name="play-circle"
            size={18}
            color={activeTab === "recordings" ? colors.accent : colors.mutedForeground}
          />
          <Text
            variant="label"
            color={activeTab === "recordings" ? "accent" : "mutedForeground"}
          >
            Recordings
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {isLoading ? (
        <LoadingContainer />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: spacing.base, paddingBottom: spacing["3xl"] }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          }
        >
          {events && events.length > 0 ? (
            <View className="gap-3">
              {events.map((event) =>
                event ? (
                  <Card key={event.id} className="p-4">
                    <View className="flex-row gap-3 mb-3">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: `${EVENT_TYPE_COLORS[event.eventType] || colors.accent}20`,
                        }}
                      >
                        <Feather
                          name={EVENT_TYPE_ICONS[event.eventType] as any || "calendar"}
                          size={24}
                          color={EVENT_TYPE_COLORS[event.eventType] || colors.accent}
                        />
                      </View>
                      <View className="flex-1">
                        <Text variant="h4" color="foreground" numberOfLines={2}>
                          {event.title}
                        </Text>
                        <Text variant="caption" color="mutedForeground">
                          {formatEventDate(event.startTime)}
                        </Text>
                      </View>
                    </View>

                    {event.description && (
                      <Text variant="body" color="mutedForeground" numberOfLines={2} className="mb-3">
                        {event.description}
                      </Text>
                    )}

                    <View className="mb-3">
                      <View className="flex-row flex-wrap gap-1">
                        <Badge variant="outline" size="sm">
                          {event.eventType.replace("_", " ")}
                        </Badge>
                        <Badge
                          variant={event.locationType === "virtual" ? "secondary" : "success"}
                          size="sm"
                        >
                          {event.locationType}
                        </Badge>
                        <Badge variant="warning" size="sm">
                          {formatPrice(event.priceCents)}
                        </Badge>
                      </View>
                    </View>

                    <View>
                      {activeTab === "recordings" && event.recordingUrl ? (
                        <Button
                          variant="default"
                          size="sm"
                          leftIcon={<Feather name="play" size={16} color={colors.primaryForeground} />}
                          onPress={() => handleViewRecording(event.recordingUrl!)}
                          fullWidth
                        >
                          Watch Recording
                        </Button>
                      ) : isRegistered(event.id) ? (
                        <Button variant="outline" size="sm" fullWidth disabled>
                          Registered
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onPress={() => handleRegister(event.id)}
                          loading={registerForEvent.isPending}
                          fullWidth
                        >
                          Register
                        </Button>
                      )}
                    </View>
                  </Card>
                ) : null
              )}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center pt-24 gap-3">
              <Feather
                name={activeTab === "recordings" ? "play-circle" : "calendar"}
                size={64}
                color={colors.mutedForeground}
              />
              <Text variant="h3" color="foreground" align="center">
                {activeTab === "upcoming" && "No Upcoming Events"}
                {activeTab === "registered" && "No Registrations"}
                {activeTab === "recordings" && "No Recordings Available"}
              </Text>
              <Text variant="body" color="mutedForeground" align="center">
                {activeTab === "upcoming" && "Check back soon for new events"}
                {activeTab === "registered" && "Register for an event to see it here"}
                {activeTab === "recordings" && "Past event recordings will appear here"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
