import { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
  useMoods,
  useHabits,
  useHabitCompletions,
  useGamification,
  useTodayMetrics,
  useSaveMetrics,
  useWeeklyMetrics,
  useDashboardStats,
  useMilestones,
} from "@/src/hooks/use-api";
import { format, subDays, startOfWeek } from "date-fns";
import * as Haptics from "expo-haptics";
import { colors, spacing } from "@/src/theme";
import { Card, Button, Slider, TextArea, H3 } from "@/src/components/ui";

const screenWidth = Dimensions.get("window").width;

const MOOD_LABELS = ["", "Rough", "Low", "Okay", "Good", "Great", "Amazing"];
const ENERGY_LABELS = ["", "Exhausted", "Tired", "Moderate", "Energized", "High", "Peak"];
const STRESS_LABELS = ["", "Minimal", "Low", "Moderate", "Elevated", "High", "Extreme"];

export default function StatsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [moodScore, setMoodScore] = useState(3);
  const [energyScore, setEnergyScore] = useState(3);
  const [stressScore, setStressScore] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [notes, setNotes] = useState("");

  const { data: moods, refetch: refetchMoods } = useMoods();
  const { data: habits, refetch: refetchHabits } = useHabits();
  const { data: completions, refetch: refetchCompletions } = useHabitCompletions();
  const { data: gamification, refetch: refetchGamification } = useGamification();
  const { data: todayMetrics, isLoading, refetch: refetchMetrics } = useTodayMetrics();
  const { data: weeklyAvg } = useWeeklyMetrics();
  const { data: stats } = useDashboardStats();
  const { data: milestones } = useMilestones();
  const saveMetrics = useSaveMetrics();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchMoods(),
      refetchHabits(),
      refetchCompletions(),
      refetchGamification(),
      refetchMetrics(),
    ]);
    setRefreshing(false);
  }, [refetchMoods, refetchHabits, refetchCompletions, refetchGamification, refetchMetrics]);

  const handleStartLogging = () => {
    if (todayMetrics) {
      setMoodScore(todayMetrics.moodScore || 3);
      setEnergyScore(todayMetrics.energyScore || 3);
      setStressScore(todayMetrics.stressScore || 3);
      setSleepHours(todayMetrics.sleepHours || 7);
      setNotes(todayMetrics.notes || "");
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveMetrics.mutate({
      moodScore,
      energyScore,
      stressScore,
      sleepHours,
      notes: notes.trim() || undefined,
    });
    setIsEditing(false);
  };

  const getMoodColor = (score: number) => {
    if (score >= 5) return colors.moodAmazing;
    if (score >= 4) return colors.moodGreat;
    if (score >= 3) return colors.moodGood;
    if (score >= 2) return colors.moodOkay;
    return colors.moodRough;
  };

  // Calculate stats
  const currentStreak = gamification?.currentStreak || 0;
  const totalXP = gamification?.totalXp || 0;
  const level = gamification?.level || 1;

  // Calculate habit completion rate for this week
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekCompletions = completions?.filter((c: any) => {
    const date = new Date(c.completedAt);
    return date >= thisWeekStart;
  }) || [];

  const weeklyHabitRate = habits && habits.length > 0
    ? Math.round((thisWeekCompletions.length / (habits.length * 7)) * 100)
    : 0;

  // Mood trend for past 7 days
  const last7DaysMoods = moods?.filter((m: any) => {
    const date = new Date(m.createdAt);
    const sevenDaysAgo = subDays(new Date(), 7);
    return date >= sevenDaysAgo;
  }) || [];

  const moodValues: Record<string, number> = {
    great: 5,
    good: 4,
    okay: 3,
    low: 2,
    rough: 1,
  };

  const avgMood = last7DaysMoods.length > 0
    ? (last7DaysMoods.reduce((acc: number, m: any) => acc + (moodValues[m.mood] || 3), 0) / last7DaysMoods.length).toFixed(1)
    : "N/A";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4">
        <Text className="text-foreground text-2xl font-bold">Your Stats</Text>
        <Text className="text-muted-foreground mt-1">Track your progress and growth</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {isEditing ? (
          // Editing Mode
          <View className="px-5 mb-6">
            <Card className="p-5">
              <H3 className="mb-4">Log Today's Metrics</H3>

              {/* Mood */}
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                  <Text variant="labelLarge" color="foreground">
                    Mood
                  </Text>
                  <Text variant="body" style={{ color: getMoodColor(moodScore) }}>
                    {MOOD_LABELS[moodScore]}
                  </Text>
                </View>
                <Slider
                  value={moodScore}
                  onValueChange={setMoodScore}
                  min={1}
                  max={6}
                  step={1}
                  showValue={false}
                />
              </View>

              {/* Energy */}
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                  <Text variant="labelLarge" color="foreground">
                    Energy
                  </Text>
                  <Text variant="body" color="accent">
                    {ENERGY_LABELS[energyScore]}
                  </Text>
                </View>
                <Slider
                  value={energyScore}
                  onValueChange={setEnergyScore}
                  min={1}
                  max={6}
                  step={1}
                  showValue={false}
                />
              </View>

              {/* Stress */}
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                  <Text variant="labelLarge" color="foreground">
                    Stress Level
                  </Text>
                  <Text variant="body" color="warning">
                    {STRESS_LABELS[stressScore]}
                  </Text>
                </View>
                <Slider
                  value={stressScore}
                  onValueChange={setStressScore}
                  min={1}
                  max={6}
                  step={1}
                  showValue={false}
                />
              </View>

              {/* Sleep */}
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                  <Text variant="labelLarge" color="foreground">
                    Sleep
                  </Text>
                  <Text variant="body" color="violet">
                    {sleepHours} hours
                  </Text>
                </View>
                <Slider
                  value={sleepHours}
                  onValueChange={setSleepHours}
                  min={3}
                  max={12}
                  step={0.5}
                  showValue={false}
                />
              </View>

              {/* Notes */}
              <View className="mb-4">
                <TextArea
                  label="Notes (optional)"
                  placeholder="How are you feeling today?"
                  value={notes}
                  onChangeText={setNotes}
                  rows={3}
                />
              </View>

              {/* Actions */}
              <View className="flex-row gap-3 mt-5">
                <Button variant="outline" onPress={() => setIsEditing(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onPress={handleSave}
                  loading={saveMetrics.isPending}
                  className="flex-1"
                >
                  Save
                </Button>
              </View>
            </Card>
          </View>
        ) : (
          <>
            {/* Today's Summary */}
            <View className="px-5 mb-6">
              <Card className="p-5">
                <View className="flex-row justify-between items-center mb-4">
                  <H3 color="foreground">Today's Check-in</H3>
                  <Button variant="outline" size="sm" onPress={handleStartLogging}>
                    {todayMetrics ? "Update" : "Log Now"}
                  </Button>
                </View>

                {todayMetrics ? (
                  <View className="flex-row justify-around">
                    <View className="items-center gap-2">
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${getMoodColor(todayMetrics.moodScore || 3)}30` }}
                      >
                        <Text variant="h2" style={{ color: getMoodColor(todayMetrics.moodScore || 3) }}>
                          {todayMetrics.moodScore || "-"}
                        </Text>
                      </View>
                      <Text variant="caption" color="mutedForeground">
                        Mood
                      </Text>
                    </View>
                    <View className="items-center gap-2">
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${colors.accent}30` }}
                      >
                        <Text variant="h2" color="accent">
                          {todayMetrics.energyScore || "-"}
                        </Text>
                      </View>
                      <Text variant="caption" color="mutedForeground">
                        Energy
                      </Text>
                    </View>
                    <View className="items-center gap-2">
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${colors.warning}30` }}
                      >
                        <Text variant="h2" color="warning">
                          {todayMetrics.stressScore || "-"}
                        </Text>
                      </View>
                      <Text variant="caption" color="mutedForeground">
                        Stress
                      </Text>
                    </View>
                    <View className="items-center gap-2">
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${colors.violet}30` }}
                      >
                        <Text variant="h2" color="violet">
                          {todayMetrics.sleepHours || "-"}
                        </Text>
                      </View>
                      <Text variant="caption" color="mutedForeground">
                        Sleep (hrs)
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="items-center py-6 gap-2">
                    <Feather name="bar-chart-2" size={48} color={colors.mutedForeground} />
                    <Text variant="body" color="mutedForeground" align="center">
                      No metrics logged today yet
                    </Text>
                  </View>
                )}
              </Card>
            </View>

            {/* Weekly Average */}
            {weeklyAvg && (
              <View className="px-5 mb-6">
                <Card className="p-5">
                  <H3 className="mb-4">Weekly Average</H3>
                  <View className="flex-row justify-around">
                    <View className="items-center">
                      <Text variant="h3" color="accent">
                        {weeklyAvg.avgMood?.toFixed(1) || "-"}
                      </Text>
                      <Text variant="caption" color="mutedForeground">
                        Mood
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text variant="h3" color="success">
                        {weeklyAvg.avgEnergy?.toFixed(1) || "-"}
                      </Text>
                      <Text variant="caption" color="mutedForeground">
                        Energy
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text variant="h3" color="warning">
                        {weeklyAvg.avgStress?.toFixed(1) || "-"}
                      </Text>
                      <Text variant="caption" color="mutedForeground">
                        Stress
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text variant="h3" color="violet">
                        {weeklyAvg.avgSleepHours?.toFixed(1) || "-"}
                      </Text>
                      <Text variant="caption" color="mutedForeground">
                        Sleep
                      </Text>
                    </View>
                  </View>
                </Card>
              </View>
            )}

            {/* Level & XP Card */}
        <View className="px-5 mb-6">
          <View className="bg-primary rounded-2xl p-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/80 text-sm">CURRENT LEVEL</Text>
                <Text className="text-white font-bold text-3xl mt-1">Level {level}</Text>
              </View>
              <View className="bg-white/20 w-16 h-16 rounded-full items-center justify-center">
                <Feather name="award" size={32} color="#FFFFFF" />
              </View>
            </View>
            <View className="mt-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-white/80 text-sm">Total XP</Text>
                <Text className="text-white font-medium">{totalXP.toLocaleString()} XP</Text>
              </View>
              <View className="bg-white/20 h-3 rounded-full overflow-hidden">
                <View
                  className="bg-white h-full rounded-full"
                  style={{ width: `${(totalXP % 1000) / 10}%` }}
                />
              </View>
              <Text className="text-white/60 text-xs mt-1">
                {1000 - (totalXP % 1000)} XP to next level
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-5 mb-6">
          <Text className="text-muted-foreground text-sm font-medium mb-3">THIS WEEK</Text>
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center">
                <View className="bg-orange-500/20 w-10 h-10 rounded-full items-center justify-center">
                  <Feather name="zap" size={20} color="#F97316" />
                </View>
              </View>
              <Text className="text-foreground text-2xl font-bold mt-3">{currentStreak}</Text>
              <Text className="text-muted-foreground text-sm">Day Streak</Text>
            </View>

            <View className="flex-1 bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center">
                <View className="bg-primary/20 w-10 h-10 rounded-full items-center justify-center">
                  <Feather name="target" size={20} color="#4A7C59" />
                </View>
              </View>
              <Text className="text-foreground text-2xl font-bold mt-3">{weeklyHabitRate}%</Text>
              <Text className="text-muted-foreground text-sm">Habits Done</Text>
            </View>

            <View className="flex-1 bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center">
                <View className="bg-blue-500/20 w-10 h-10 rounded-full items-center justify-center">
                  <Feather name="smile" size={20} color="#3B82F6" />
                </View>
              </View>
              <Text className="text-foreground text-2xl font-bold mt-3">{avgMood}</Text>
              <Text className="text-muted-foreground text-sm">Avg Mood</Text>
            </View>
          </View>
        </View>

        {/* Mood Trend */}
        <View className="px-5 mb-6">
          <Text className="text-muted-foreground text-sm font-medium mb-3">MOOD TREND (7 DAYS)</Text>
          <View className="bg-card rounded-2xl p-4 border border-border">
            <View className="flex-row justify-between items-end h-32">
              {Array.from({ length: 7 }).map((_, index) => {
                const date = subDays(new Date(), 6 - index);
                const dayMood = moods?.find((m: any) => {
                  const moodDate = new Date(m.createdAt).toDateString();
                  return moodDate === date.toDateString();
                });
                const moodValue = dayMood ? moodValues[dayMood.mood] || 0 : 0;
                const height = moodValue * 20;

                return (
                  <View key={index} className="flex-1 items-center">
                    <View
                      className={`w-6 rounded-t-lg ${moodValue > 0 ? "bg-primary" : "bg-muted"}`}
                      style={{ height: Math.max(height, 8) }}
                    />
                    <Text className="text-muted-foreground text-xs mt-2">
                      {format(date, "EEE").charAt(0)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Habit Streaks */}
        <View className="px-5 mb-6">
          <Text className="text-muted-foreground text-sm font-medium mb-3">HABIT STREAKS</Text>
          {habits && habits.length > 0 ? (
            <View className="space-y-3">
              {habits.slice(0, 5).map((habit: any) => {
                const habitCompletions = completions?.filter((c: any) => c.habitId === habit.id) || [];
                const streak = habit.currentStreak || 0;

                return (
                  <View
                    key={habit.id}
                    className="bg-card rounded-xl p-4 border border-border flex-row items-center"
                  >
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: habit.color ? `${habit.color}20` : "#4A7C5920" }}
                    >
                      <Feather name="check-circle" size={20} color={habit.color || "#4A7C59"} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-medium">{habit.name}</Text>
                      <Text className="text-muted-foreground text-sm">
                        {habitCompletions.length} completions
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-primary font-bold text-lg">{streak}</Text>
                      <Text className="text-muted-foreground text-xs">day streak</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="bg-card rounded-2xl p-6 border border-border items-center">
              <Feather name="bar-chart-2" size={40} color="#A0A0A0" />
              <Text className="text-muted-foreground text-center mt-3">
                Start tracking habits to see your streaks here
              </Text>
            </View>
          )}
        </View>

            {/* Milestones */}
            {milestones && milestones.length > 0 && (
              <View className="px-5 mb-6">
                <Card className="p-5">
                  <H3 className="mb-4">Recent Milestones</H3>
                  <View className="gap-3">
                    {milestones.slice(0, 5).map((milestone: any) => (
                      <View key={milestone.id} className="flex-row items-center gap-3">
                        <View
                          className="w-9 h-9 rounded-full items-center justify-center"
                          style={{ backgroundColor: `${colors.success}20` }}
                        >
                          <Feather name="check-circle" size={20} color={colors.success} />
                        </View>
                        <View className="flex-1">
                          <Text variant="labelLarge" color="foreground">
                            {milestone.milestoneType}
                          </Text>
                          {milestone.description && (
                            <Text variant="caption" color="mutedForeground">
                              {milestone.description}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </Card>
              </View>
            )}
          </>
        )}

        {/* Bottom padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
