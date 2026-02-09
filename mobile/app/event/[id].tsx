import { View, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { useEvents, useMyEventRegistrations, useRegisterForEvent } from "@/src/hooks/use-api";
import { colors, spacing } from "@/src/theme";
import { Text, H1, Card, Button, Badge, LoadingContainer } from "@/src/components/ui";

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

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: events, isLoading } = useEvents({ upcoming: true });
  const { data: myRegistrations } = useMyEventRegistrations();
  const registerForEvent = useRegisterForEvent();

  const event = events?.find((e) => e.id === id);
  const isRegistered = myRegistrations?.some((r) => r.eventId === id) ?? false;

  const formatEventDate = (startTime: string) => {
    return format(new Date(startTime), "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  const formatPrice = (cents: number) => {
    if (cents === 0) return "Free";
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingContainer />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center p-5">
          <Feather name="alert-circle" size={64} color={colors.mutedForeground} />
          <Text variant="h3" color="foreground" align="center" className="mt-4">
            Event Not Found
          </Text>
          <Button variant="default" onPress={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: spacing.base }}>
        <Card className="p-5">
          <View className="flex-row items-center gap-3 mb-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{
                backgroundColor: `${EVENT_TYPE_COLORS[event.eventType] || colors.accent}20`,
              }}
            >
              <Feather
                name={EVENT_TYPE_ICONS[event.eventType] as any || "calendar"}
                size={32}
                color={EVENT_TYPE_COLORS[event.eventType] || colors.accent}
              />
            </View>
            <View className="flex-1">
              <H1 color="foreground">{event.title}</H1>
              <Text variant="caption" color="mutedForeground">
                {formatEventDate(event.startTime)}
              </Text>
            </View>
          </View>

          {event.description && (
            <Text variant="body" color="foreground" className="mb-4">
              {event.description}
            </Text>
          )}

          <View className="flex-row flex-wrap gap-2 mb-4">
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

          {event.locationDetails && (
            <View className="mb-4">
              <Text variant="label" color="mutedForeground" className="mb-1">
                Location
              </Text>
              <Text variant="body" color="foreground">
                {event.locationDetails}
              </Text>
            </View>
          )}

          {event.recordingUrl && (
            <Button
              variant="outline"
              className="mb-4"
              leftIcon={<Feather name="play" size={16} color={colors.foreground} />}
              onPress={() => Linking.openURL(event.recordingUrl!)}
              fullWidth
            >
              Watch Recording
            </Button>
          )}

          {isRegistered ? (
            <Button variant="outline" disabled fullWidth>
              Already Registered
            </Button>
          ) : (
            <Button
              variant="default"
              onPress={() => registerForEvent.mutate(event.id)}
              loading={registerForEvent.isPending}
              fullWidth
            >
              Register for Event
            </Button>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
