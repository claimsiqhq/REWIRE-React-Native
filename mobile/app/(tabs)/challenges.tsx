import { useState, useCallback } from "react";
import { View, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { format, differenceInDays } from "date-fns";
import * as Haptics from "expo-haptics";
import { useChallenges, useMyChallenge, useJoinChallenge, type Challenge, type ChallengeParticipant } from "@/src/hooks/use-api";
import { colors, spacing } from "@/src/theme";
import { Text, H1, Card, PressableCard, Button, Badge, LoadingContainer } from "@/src/components/ui";

type TabType = "discover" | "my-challenges";

export default function ChallengesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("discover");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: allChallenges, isLoading: loadingAll, refetch: refetchAll } = useChallenges({ active: true });
  const { data: myChallenges, isLoading: loadingMy, refetch: refetchMy } = useMyChallenge();
  const joinChallenge = useJoinChallenge();

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchAll(), refetchMy()]);
    setIsRefreshing(false);
  }, [refetchAll, refetchMy]);

  const handleJoinChallenge = async (challengeId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    joinChallenge.mutate(challengeId);
  };

  const handleViewChallenge = (challengeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/challenge/[id]", params: { id: challengeId } });
  };

  const isJoined = (challengeId: string) => {
    return myChallenges?.some((c) => c.challengeId === challengeId) ?? false;
  };

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    return days > 0 ? `${days} days left` : "Ended";
  };

  const getProgress = (participant: ChallengeParticipant & { challenge: Challenge }) => {
    const totalDays = participant.challenge.durationDays;
    const completed = participant.totalCompletions;
    return Math.min((completed / totalDays) * 100, 100);
  };

  const isLoading = activeTab === "discover" ? loadingAll : loadingMy;
  const challenges = activeTab === "discover" ? allChallenges : null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pb-3">
        <H1 color="birch">Challenges</H1>
        <Text variant="body" color="mutedForeground">
          Join the brotherhood
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 border-b border-border mb-3">
        <TouchableOpacity
          className={`flex-row items-center gap-1 py-3 px-4 mr-3 ${
            activeTab === "discover" ? "border-b-2 border-accent" : ""
          }`}
          onPress={() => setActiveTab("discover")}
        >
          <Text
            variant="labelLarge"
            color={activeTab === "discover" ? "accent" : "mutedForeground"}
          >
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-row items-center gap-1 py-3 px-4 ${
            activeTab === "my-challenges" ? "border-b-2 border-accent" : ""
          }`}
          onPress={() => setActiveTab("my-challenges")}
        >
          <Text
            variant="labelLarge"
            color={activeTab === "my-challenges" ? "accent" : "mutedForeground"}
          >
            My Challenges
          </Text>
          {myChallenges && myChallenges.length > 0 && (
            <Badge variant="success" size="sm">
              {myChallenges.length}
            </Badge>
          )}
        </TouchableOpacity>
      </View>

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
          {activeTab === "discover" ? (
            // Discover Tab
            challenges && challenges.length > 0 ? (
              <View className="gap-3">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className="p-4">
                    <View className="flex-row items-center gap-3 mb-3">
                      <View className="w-12 h-12 rounded-full bg-gold/20 items-center justify-center">
                        <Feather name="award" size={24} color={colors.gold} />
                      </View>
                      <View className="flex-1">
                        <Text variant="h4" color="foreground" numberOfLines={1}>
                          {challenge.title}
                        </Text>
                        <Text variant="caption" color="mutedForeground">
                          {challenge.durationDays} days • {getDaysRemaining(challenge.endDate)}
                        </Text>
                      </View>
                    </View>
                    {challenge.description && (
                      <Text
                        variant="body"
                        color="mutedForeground"
                        numberOfLines={2}
                        className="mb-3"
                      >
                        {challenge.description}
                      </Text>
                    )}
                    <View className="flex-row justify-between items-center mt-3">
                      <View className="flex-row gap-1">
                        <Badge variant="outline" size="sm">
                          {challenge.challengeType}
                        </Badge>
                        {challenge.category && (
                          <Badge variant="secondary" size="sm">
                            {challenge.category}
                          </Badge>
                        )}
                      </View>
                      {isJoined(challenge.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={() => handleViewChallenge(challenge.id)}
                        >
                          View
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onPress={() => handleJoinChallenge(challenge.id)}
                          loading={joinChallenge.isPending}
                        >
                          Join
                        </Button>
                      )}
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <View className="flex-1 items-center justify-center pt-24 gap-3">
                <Feather name="award" size={64} color={colors.mutedForeground} />
                <Text variant="h3" color="foreground" align="center">
                  No Active Challenges
                </Text>
                <Text variant="body" color="mutedForeground" align="center">
                  Check back soon for new challenges
                </Text>
              </View>
            )
          ) : (
            // My Challenges Tab
            myChallenges && myChallenges.length > 0 ? (
              <View className="gap-3">
                {myChallenges.map((participation) => (
                  <PressableCard
                    key={participation.id}
                    className="p-4"
                    onPress={() => handleViewChallenge(participation.challengeId)}
                  >
                    <View className="flex-row items-center gap-3 mb-3">
                      <View className="w-12 h-12 rounded-full bg-success/20 items-center justify-center">
                        <Feather name="flame" size={24} color={colors.ember} />
                      </View>
                      <View className="flex-1">
                        <Text variant="h4" color="foreground" numberOfLines={1}>
                          {participation.challenge.title}
                        </Text>
                        <Text variant="caption" color="mutedForeground">
                          {getDaysRemaining(participation.challenge.endDate)}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mt-3">
                      <View className="flex-row justify-between mb-1">
                        <Text variant="caption" color="mutedForeground">
                          Progress
                        </Text>
                        <Text variant="caption" color="accent">
                          {participation.totalCompletions}/{participation.challenge.durationDays} days
                        </Text>
                      </View>
                      <View className="h-2 bg-muted rounded-full overflow-hidden">
                        <View
                          className="h-full bg-success rounded-full"
                          style={{ width: `${getProgress(participation)}%` }}
                        />
                      </View>
                    </View>

                    {/* Stats */}
                    <View className="flex-row justify-around mt-5 pt-3 border-t border-border">
                      <View className="items-center">
                        <Text variant="h3" color="ember">
                          {participation.currentStreak}
                        </Text>
                        <Text variant="caption" color="mutedForeground">
                          Current Streak
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text variant="h3" color="gold">
                          {participation.bestStreak}
                        </Text>
                        <Text variant="caption" color="mutedForeground">
                          Best Streak
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text variant="h3" color="success">
                          {participation.totalCompletions}
                        </Text>
                        <Text variant="caption" color="mutedForeground">
                          Total Days
                        </Text>
                      </View>
                    </View>
                  </PressableCard>
                ))}
              </View>
            ) : (
              <View className="flex-1 items-center justify-center pt-24 gap-3">
                <Feather name="target" size={64} color={colors.mutedForeground} />
                <Text variant="h3" color="foreground" align="center">
                  No Challenges Yet
                </Text>
                <Text variant="body" color="mutedForeground" align="center">
                  Join a challenge to start your journey
                </Text>
                <Button variant="default" onPress={() => setActiveTab("discover")} className="mt-5">
                  Discover Challenges
                </Button>
              </View>
            )
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
