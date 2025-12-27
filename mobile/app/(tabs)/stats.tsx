import { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useMoods, useHabits, useHabitCompletions, useGamification } from "@/src/hooks/use-api";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

const screenWidth = Dimensions.get("window").width;

export default function StatsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { data: moods, refetch: refetchMoods } = useMoods();
  const { data: habits, refetch: refetchHabits } = useHabits();
  const { data: completions, refetch: refetchCompletions } = useHabitCompletions();
  const { data: gamification, refetch: refetchGamification } = useGamification();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchMoods(),
      refetchHabits(),
      refetchCompletions(),
      refetchGamification(),
    ]);
    setRefreshing(false);
  }, [refetchMoods, refetchHabits, refetchCompletions, refetchGamification]);

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
            tintColor="#4A7C59"
          />
        }
      >
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

        {/* Bottom padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
