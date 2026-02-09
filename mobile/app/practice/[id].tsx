import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { usePractice, useTogglePracticeFavorite, usePracticeFavorites, useCreatePracticeSession } from "@/src/hooks/use-api";
import { colors, spacing } from "@/src/theme";
import { Text, H1, Card, Button, Badge, LoadingContainer } from "@/src/components/ui";

const PRACTICE_ICONS: Record<string, string> = {
  breathing: "wind",
  meditation: "moon",
  body_scan: "activity",
};

export default function PracticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: practice, isLoading } = usePractice(id || "");
  const { data: favorites } = usePracticeFavorites();
  const toggleFavorite = useTogglePracticeFavorite();
  const createSession = useCreatePracticeSession();

  const isFavorited = favorites?.some((f) => f.practiceId === Number(id)) ?? false;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const handleStartPractice = () => {
    if (!practice) return;
    const durationMinutes = Math.floor(practice.durationSeconds / 60);
    createSession.mutate({
      practiceId: Number(practice.id),
      durationMinutes,
    });
    // Navigate to focus screen or practice player
    router.push("/(tabs)/focus");
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingContainer />
      </SafeAreaView>
    );
  }

  if (!practice) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center p-5">
          <Feather name="alert-circle" size={64} color={colors.mutedForeground} />
          <Text variant="h3" color="foreground" align="center" className="mt-4">
            Practice Not Found
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
            <View className="w-16 h-16 bg-accent/20 rounded-full items-center justify-center">
              <Feather
                name={PRACTICE_ICONS[practice.type] as any || "circle"}
                size={32}
                color={colors.accent}
              />
            </View>
            <View className="flex-1">
              <H1 color="foreground">{practice.name}</H1>
              {practice.subtitle && (
                <Text variant="caption" color="mutedForeground">
                  {practice.subtitle}
                </Text>
              )}
            </View>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => toggleFavorite.mutate(Number(practice.id))}
            >
              <Feather
                name="heart"
                size={24}
                color={isFavorited ? colors.coral : colors.mutedForeground}
                fill={isFavorited ? colors.coral : "none"}
              />
            </Button>
          </View>

          {practice.description && (
            <Text variant="body" color="foreground" className="mb-4">
              {practice.description}
            </Text>
          )}

          <View className="flex-row flex-wrap gap-2 mb-4">
            <Badge variant="outline" size="sm">
              {formatDuration(practice.durationSeconds)}
            </Badge>
            <Badge variant="secondary" size="sm">
              {practice.category.replace("_", " ")}
            </Badge>
            <Badge variant="outline" size="sm">
              {practice.type}
            </Badge>
            {practice.isPremium && (
              <Badge variant="warning" size="sm">
                Premium
              </Badge>
            )}
          </View>

          <Button
            variant="default"
            className="mt-4"
            onPress={handleStartPractice}
            loading={createSession.isPending}
            leftIcon={<Feather name="play" size={20} color={colors.primaryForeground} />}
            fullWidth
          >
            Start Practice
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
