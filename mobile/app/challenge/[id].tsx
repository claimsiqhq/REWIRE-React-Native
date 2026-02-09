import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useChallenges, useJoinChallenge } from "@/src/hooks/use-api";
import { colors, spacing } from "@/src/theme";
import { Text, H1, Card, Button, LoadingContainer } from "@/src/components/ui";

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenges, isLoading } = useChallenges({ active: true });
  const joinChallenge = useJoinChallenge();

  const challenge = challenges?.find((c) => c.id === id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingContainer />
      </SafeAreaView>
    );
  }

  if (!challenge) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center p-5">
          <Feather name="alert-circle" size={64} color={colors.mutedForeground} />
          <Text variant="h3" color="foreground" align="center" className="mt-4">
            Challenge Not Found
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
            <View className="w-16 h-16 bg-gold/20 rounded-full items-center justify-center">
              <Feather name="award" size={32} color={colors.gold} />
            </View>
            <View className="flex-1">
              <H1 color="foreground">{challenge.title}</H1>
              <Text variant="caption" color="mutedForeground">
                {challenge.durationDays} days • {challenge.challengeType}
              </Text>
            </View>
          </View>

          {challenge.description && (
            <Text variant="body" color="foreground" className="mb-4">
              {challenge.description}
            </Text>
          )}

          <View className="mt-5 pt-5 border-t border-border">
            <Text variant="h3" color="foreground" className="mb-3">
              Challenge Details
            </Text>
            <View className="gap-2">
              <Text variant="body" color="mutedForeground">
                Duration: {challenge.durationDays} days
              </Text>
              <Text variant="body" color="mutedForeground">
                Type: {challenge.challengeType}
              </Text>
              {challenge.category && (
                <Text variant="body" color="mutedForeground">
                  Category: {challenge.category}
                </Text>
              )}
            </View>
          </View>

          <Button
            variant="default"
            className="mt-6"
            onPress={() => {
              joinChallenge.mutate(challenge.id);
            }}
            loading={joinChallenge.isPending}
            fullWidth
          >
            Join Challenge
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
