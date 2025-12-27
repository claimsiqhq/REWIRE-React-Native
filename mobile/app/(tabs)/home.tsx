import { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/src/lib/auth-context";
import { useMoods, useHabits, useHabitCompletions } from "@/src/hooks/use-api";
import { MoodCheckIn } from "@/src/components/mood-check-in";
import { HabitCard } from "@/src/components/habit-card";
import { QuickActions } from "@/src/components/quick-actions";
import { DailyQuote } from "@/src/components/daily-quote";
import { format } from "date-fns";

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);

  const { data: moods, refetch: refetchMoods } = useMoods();
  const { data: habits, refetch: refetchHabits } = useHabits();
  const { data: completions, refetch: refetchCompletions } = useHabitCompletions();

  const todaysMood = moods?.find((mood: any) => {
    const moodDate = new Date(mood.createdAt).toDateString();
    const today = new Date().toDateString();
    return moodDate === today;
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchMoods(), refetchHabits(), refetchCompletions()]);
    setRefreshing(false);
  }, [refetchMoods, refetchHabits, refetchCompletions]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
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
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-muted-foreground text-sm">
            {format(new Date(), "EEEE, MMMM d")}
          </Text>
          <Text className="text-foreground text-2xl font-bold mt-1">
            {getGreeting()}, {user?.firstName || user?.username || "Warrior"}
          </Text>
        </View>

        {/* Daily Quote */}
        <View className="px-5 mb-6">
          <DailyQuote />
        </View>

        {/* Mood Check-in */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-lg font-semibold">Ground Check</Text>
            {todaysMood && (
              <View className="bg-primary/20 px-3 py-1 rounded-full">
                <Text className="text-primary text-sm">Completed</Text>
              </View>
            )}
          </View>

          {todaysMood ? (
            <TouchableOpacity
              className="bg-card rounded-2xl p-4 border border-border"
              onPress={() => setShowMoodCheckIn(true)}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-foreground font-medium">
                    Feeling {todaysMood.mood}
                  </Text>
                  <Text className="text-muted-foreground text-sm mt-1">
                    Energy: {todaysMood.energyLevel}/10 • Stress: {todaysMood.stressLevel}/10
                  </Text>
                </View>
                <Feather name="edit-2" size={20} color="#A0A0A0" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-primary rounded-2xl p-5"
              onPress={() => setShowMoodCheckIn(true)}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white font-semibold text-lg">
                    How are you feeling?
                  </Text>
                  <Text className="text-white/80 text-sm mt-1">
                    Tap to check in with yourself
                  </Text>
                </View>
                <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center">
                  <Feather name="plus" size={24} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-6">
          <Text className="text-foreground text-lg font-semibold mb-3">Quick Actions</Text>
          <QuickActions />
        </View>

        {/* Today's Habits */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-lg font-semibold">Today's Habits</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm">See All</Text>
            </TouchableOpacity>
          </View>

          {habits && habits.length > 0 ? (
            <View className="space-y-3">
              {habits.slice(0, 5).map((habit: any) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  completions={completions}
                  onComplete={refetchCompletions}
                />
              ))}
            </View>
          ) : (
            <View className="bg-card rounded-2xl p-5 border border-border items-center">
              <Feather name="target" size={32} color="#A0A0A0" />
              <Text className="text-muted-foreground text-center mt-3">
                No habits yet. Start building positive routines!
              </Text>
              <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg mt-4">
                <Text className="text-white font-medium">Add Habit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom padding for tab bar */}
        <View className="h-8" />
      </ScrollView>

      {/* Mood Check-in Modal */}
      <MoodCheckIn
        visible={showMoodCheckIn}
        onClose={() => setShowMoodCheckIn(false)}
        existingMood={todaysMood}
        onComplete={() => {
          refetchMoods();
          setShowMoodCheckIn(false);
        }}
      />
    </SafeAreaView>
  );
}
