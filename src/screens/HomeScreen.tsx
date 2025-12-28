import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/hooks/useAuth';
import {
  useTodayMood,
  useCreateMood,
  useHabits,
  useHabitCompletions,
  useToggleHabit,
  useDashboardStats,
  useGamification,
} from '@/lib/api';
import { colors, spacing, borderRadius, layout } from '@/theme';
import {
  Text,
  H1,
  H2,
  H3,
  Card,
  PressableCard,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Checkbox,
  LoadingContainer,
} from '@/components/ui';

const MOOD_OPTIONS = [
  { value: 'amazing', label: 'Amazing', emoji: '🌟', color: colors.moodAmazing },
  { value: 'great', label: 'Great', emoji: '😊', color: colors.moodGreat },
  { value: 'good', label: 'Good', emoji: '👍', color: colors.moodGood },
  { value: 'okay', label: 'Okay', emoji: '😐', color: colors.moodOkay },
  { value: 'rough', label: 'Rough', emoji: '😔', color: colors.moodRough },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const { data: todayMood, refetch: refetchMood } = useTodayMood();
  const { data: habits, refetch: refetchHabits } = useHabits();
  const { data: completions, refetch: refetchCompletions } = useHabitCompletions(today);
  const { data: stats, refetch: refetchStats } = useDashboardStats();
  const { data: gamification } = useGamification();

  // Mutations
  const createMood = useCreateMood();
  const toggleHabit = useToggleHabit();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchMood(),
      refetchHabits(),
      refetchCompletions(),
      refetchStats(),
    ]);
    setIsRefreshing(false);
  };

  const handleMoodSelect = async (mood: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createMood.mutate({ mood });
  };

  const handleHabitToggle = async (habitId: string, completed: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleHabit.mutate({ habitId, date: today, completed });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isHabitCompleted = (habitId: string) => {
    return completions?.some(c => c.habitId === habitId && c.completed) ?? false;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="bodySmall" color="mutedForeground">
              {getGreeting()}
            </Text>
            <H1 color="birch">
              {user?.firstName || 'Warrior'}
            </H1>
          </View>
          {gamification && (
            <View style={styles.levelBadge}>
              <Ionicons name="flash" size={16} color={colors.gold} />
              <Text variant="labelSmall" color="gold">
                LVL {gamification.currentLevel}
              </Text>
            </View>
          )}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text variant="displayMedium" color="accent">
              {stats?.currentStreak || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Day Streak
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text variant="displayMedium" color="success">
              {stats?.totalHabitsCompleted || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Habits Done
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text variant="displayMedium" color="violet">
              {gamification?.totalXp || 0}
            </Text>
            <Text variant="caption" color="mutedForeground">
              Total XP
            </Text>
          </Card>
        </View>

        {/* Ground Check - Mood Tracker */}
        <Card style={styles.section}>
          <CardHeader>
            <CardTitle>Daily Ground Check</CardTitle>
            <Text variant="bodySmall" color="mutedForeground">
              {todayMood ? 'Completed today' : 'How are you feeling?'}
            </Text>
          </CardHeader>
          <CardContent>
            {todayMood ? (
              <View style={styles.moodCompleted}>
                <Text variant="displayLarge">
                  {MOOD_OPTIONS.find(m => m.value === todayMood.mood)?.emoji || '✓'}
                </Text>
                <Text variant="body" color="foreground">
                  You're feeling{' '}
                  <Text variant="body" color="accent">
                    {MOOD_OPTIONS.find(m => m.value === todayMood.mood)?.label || todayMood.mood}
                  </Text>
                </Text>
              </View>
            ) : (
              <View style={styles.moodGrid}>
                {MOOD_OPTIONS.map((mood) => (
                  <Pressable
                    key={mood.value}
                    onPress={() => handleMoodSelect(mood.value)}
                    style={({ pressed }) => [
                      styles.moodOption,
                      { borderColor: mood.color },
                      pressed && styles.moodOptionPressed,
                    ]}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text variant="caption" color="foreground">
                      {mood.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </CardContent>
        </Card>

        {/* Daily Anchors - Habits */}
        <Card style={styles.section}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <CardTitle>Daily Anchors</CardTitle>
              <Badge variant="secondary" size="sm">
                {completions?.filter(c => c.completed).length || 0}/{habits?.length || 0}
              </Badge>
            </View>
          </CardHeader>
          <CardContent>
            {habits && habits.length > 0 ? (
              <View style={styles.habitsList}>
                {habits.map((habit) => (
                  <Checkbox
                    key={habit.id}
                    checked={isHabitCompleted(habit.id)}
                    onCheckedChange={(checked) => handleHabitToggle(habit.id, checked)}
                    label={habit.label}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text variant="body" color="mutedForeground" align="center">
                  No habits yet. Add some to track!
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <H3 style={styles.sectionTitle}>Quick Actions</H3>
          <View style={styles.actionsGrid}>
            <PressableCard
              style={styles.actionCard}
              onPress={() => navigation.navigate('Main', { screen: 'Focus' })}
            >
              <Ionicons name="flower-outline" size={28} color={colors.teal} />
              <Text variant="label" color="foreground" style={styles.actionLabel}>
                Breathe
              </Text>
            </PressableCard>
            <PressableCard
              style={styles.actionCard}
              onPress={() => navigation.navigate('Main', { screen: 'Journal' })}
            >
              <Ionicons name="book-outline" size={28} color={colors.violet} />
              <Text variant="label" color="foreground" style={styles.actionLabel}>
                Journal
              </Text>
            </PressableCard>
            <PressableCard
              style={styles.actionCard}
              onPress={() => navigation.navigate('Main', { screen: 'Coach' })}
            >
              <Ionicons name="chatbubbles-outline" size={28} color={colors.ember} />
              <Text variant="label" color="foreground" style={styles.actionLabel}>
                Coach
              </Text>
            </PressableCard>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.gold + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.base,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodCompleted: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  moodOption: {
    width: '18%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deepPine,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    gap: spacing.xs,
  },
  moodOptionPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  moodEmoji: {
    fontSize: 24,
  },
  habitsList: {
    gap: spacing.md,
  },
  emptyState: {
    paddingVertical: spacing.xl,
  },
  quickActions: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  actionLabel: {
    marginTop: spacing.xs,
  },
});
