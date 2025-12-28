import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCompleteHabit } from "../hooks/use-api";
import * as Haptics from "expo-haptics";

interface Habit {
  id: number;
  name: string;
  description?: string;
  frequency?: string;
  color?: string;
  currentStreak?: number;
}

interface Completion {
  id: number;
  habitId: number;
  completedAt: string;
}

interface HabitCardProps {
  habit: Habit;
  completions?: Completion[];
  onComplete: () => void;
}

export function HabitCard({ habit, completions, onComplete }: HabitCardProps) {
  const completeHabit = useCompleteHabit();

  const isCompletedToday = completions?.some((c) => {
    const completedDate = new Date(c.completedAt).toDateString();
    const today = new Date().toDateString();
    return c.habitId === habit.id && completedDate === today;
  });

  const handleComplete = async () => {
    if (isCompletedToday) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await completeHabit.mutateAsync(habit.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    } catch (error) {
      console.error("Failed to complete habit:", error);
    }
  };

  const habitColor = habit.color || "#4A7C59";

  return (
    <View className="bg-card rounded-2xl p-4 border border-border flex-row items-center">
      <TouchableOpacity
        onPress={handleComplete}
        disabled={isCompletedToday || completeHabit.isPending}
        className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          isCompletedToday ? "bg-primary" : "border-2"
        }`}
        style={
          isCompletedToday
            ? { backgroundColor: habitColor }
            : { borderColor: habitColor }
        }
      >
        {isCompletedToday ? (
          <Feather name="check" size={20} color="#FFFFFF" />
        ) : completeHabit.isPending ? (
          <Feather name="loader" size={20} color={habitColor} />
        ) : null}
      </TouchableOpacity>

      <View className="flex-1">
        <Text
          className={`font-medium ${
            isCompletedToday ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {habit.name}
        </Text>
        {habit.description && (
          <Text className="text-muted-foreground text-sm" numberOfLines={1}>
            {habit.description}
          </Text>
        )}
      </View>

      {habit.currentStreak && habit.currentStreak > 0 && (
        <View className="flex-row items-center">
          <Feather name="zap" size={14} color="#F97316" />
          <Text className="text-orange-500 text-sm font-medium ml-1">
            {habit.currentStreak}
          </Text>
        </View>
      )}
    </View>
  );
}
