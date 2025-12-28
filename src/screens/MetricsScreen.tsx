import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, subDays, startOfWeek } from 'date-fns';
import * as Haptics from 'expo-haptics';

import {
  useTodayMetrics,
  useSaveMetrics,
  useWeeklyMetrics,
  useDashboardStats,
  useGamification,
  useMilestones,
} from '@/lib/api';
import { colors, spacing, borderRadius } from '@/theme';
import {
  Text,
  H1,
  H2,
  H3,
  Card,
  PressableCard,
  Button,
  Badge,
  Slider,
  TextArea,
  LoadingContainer,
  Separator,
} from '@/components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MOOD_LABELS = ['', 'Rough', 'Low', 'Okay', 'Good', 'Great', 'Amazing'];
const ENERGY_LABELS = ['', 'Exhausted', 'Tired', 'Moderate', 'Energized', 'High', 'Peak'];
const STRESS_LABELS = ['', 'Minimal', 'Low', 'Moderate', 'Elevated', 'High', 'Extreme'];

export default function MetricsScreen() {
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [moodScore, setMoodScore] = useState(3);
  const [energyScore, setEnergyScore] = useState(3);
  const [stressScore, setStressScore] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [notes, setNotes] = useState('');

  const { data: todayMetrics, isLoading, refetch } = useTodayMetrics();
  const { data: weeklyAvg } = useWeeklyMetrics();
  const { data: stats } = useDashboardStats();
  const { data: gamification } = useGamification();
  const { data: milestones } = useMilestones();
  const saveMetrics = useSaveMetrics();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleStartLogging = () => {
    // Pre-fill with existing values if available
    if (todayMetrics) {
      setMoodScore(todayMetrics.moodScore || 3);
      setEnergyScore(todayMetrics.energyScore || 3);
      setStressScore(todayMetrics.stressScore || 3);
      setSleepHours(todayMetrics.sleepHours || 7);
      setNotes(todayMetrics.notes || '');
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

  if (isLoading) {
    return <LoadingContainer />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <H1 color="birch">Metrics</H1>
        <Text variant="body" color="mutedForeground">
          {format(new Date(), 'EEEE, MMMM d')}
        </Text>
      </View>

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
        {isEditing ? (
          // Editing Mode
          <Card style={styles.editCard}>
            <H3 style={styles.sectionTitle}>Log Today's Metrics</H3>

            {/* Mood */}
            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
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
            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
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
            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
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
            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
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
            <TextArea
              label="Notes (optional)"
              placeholder="How are you feeling today?"
              value={notes}
              onChangeText={setNotes}
              rows={3}
              containerStyle={styles.notes}
            />

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                variant="outline"
                onPress={() => setIsEditing(false)}
                style={styles.actionButton}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onPress={handleSave}
                loading={saveMetrics.isPending}
                style={styles.actionButton}
              >
                Save
              </Button>
            </View>
          </Card>
        ) : (
          <>
            {/* Today's Summary */}
            <Card style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <H3 color="foreground">Today's Check-in</H3>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={handleStartLogging}
                >
                  {todayMetrics ? 'Update' : 'Log Now'}
                </Button>
              </View>

              {todayMetrics ? (
                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <View style={[styles.metricCircle, { backgroundColor: getMoodColor(todayMetrics.moodScore || 3) + '30' }]}>
                      <Text variant="h2" style={{ color: getMoodColor(todayMetrics.moodScore || 3) }}>
                        {todayMetrics.moodScore || '-'}
                      </Text>
                    </View>
                    <Text variant="caption" color="mutedForeground">
                      Mood
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <View style={[styles.metricCircle, { backgroundColor: colors.accent + '30' }]}>
                      <Text variant="h2" color="accent">
                        {todayMetrics.energyScore || '-'}
                      </Text>
                    </View>
                    <Text variant="caption" color="mutedForeground">
                      Energy
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <View style={[styles.metricCircle, { backgroundColor: colors.warning + '30' }]}>
                      <Text variant="h2" color="warning">
                        {todayMetrics.stressScore || '-'}
                      </Text>
                    </View>
                    <Text variant="caption" color="mutedForeground">
                      Stress
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <View style={[styles.metricCircle, { backgroundColor: colors.violet + '30' }]}>
                      <Text variant="h2" color="violet">
                        {todayMetrics.sleepHours || '-'}
                      </Text>
                    </View>
                    <Text variant="caption" color="mutedForeground">
                      Sleep (hrs)
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyMetrics}>
                  <Ionicons name="analytics-outline" size={48} color={colors.mutedForeground} />
                  <Text variant="body" color="mutedForeground" align="center">
                    No metrics logged today yet
                  </Text>
                </View>
              )}
            </Card>

            {/* Weekly Average */}
            {weeklyAvg && (
              <Card style={styles.weeklyCard}>
                <H3 style={styles.sectionTitle}>Weekly Average</H3>
                <View style={styles.weeklyStats}>
                  <View style={styles.weeklyStat}>
                    <Text variant="h3" color="accent">
                      {weeklyAvg.avgMood?.toFixed(1) || '-'}
                    </Text>
                    <Text variant="caption" color="mutedForeground">
                      Mood
                    </Text>
                  </View>
                  <View style={styles.weeklyStat}>
                    <Text variant="h3" color="success">
                      {weeklyAvg.avgEnergy?.toFixed(1) || '-'}
                    </Text>
                    <Text variant="caption" color="mutedForeground">
                      Energy
                    </Text>
                  </View>
                  <View style={styles.weeklyStat}>
                    <Text variant="h3" color="warning">
                      {weeklyAvg.avgStress?.toFixed(1) || '-'}
                    </Text>
                    <Text variant="caption" color="mutedForeground">
                      Stress
                    </Text>
                  </View>
                  <View style={styles.weeklyStat}>
                    <Text variant="h3" color="violet">
                      {weeklyAvg.avgSleepHours?.toFixed(1) || '-'}
                    </Text>
                    <Text variant="caption" color="mutedForeground">
                      Sleep
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Streaks & Progress */}
            <Card style={styles.streaksCard}>
              <H3 style={styles.sectionTitle}>Progress</H3>
              <View style={styles.streaksList}>
                <View style={styles.streakItem}>
                  <View style={[styles.streakIcon, { backgroundColor: colors.ember + '20' }]}>
                    <Ionicons name="flame" size={24} color={colors.ember} />
                  </View>
                  <View style={styles.streakInfo}>
                    <Text variant="h3" color="ember">
                      {stats?.currentStreak || 0}
                    </Text>
                    <Text variant="caption" color="mutedForeground">
                      Day Streak
                    </Text>
                  </View>
                </View>
                <View style={styles.streakItem}>
                  <View style={[styles.streakIcon, { backgroundColor: colors.gold + '20' }]}>
                    <Ionicons name="flash" size={24} color={colors.gold} />
                  </View>
                  <View style={styles.streakInfo}>
                    <Text variant="h3" color="gold">
                      {gamification?.totalXp || 0}
                    </Text>
                    <Text variant="caption" color="mutedForeground">
                      Total XP
                    </Text>
                  </View>
                </View>
                <View style={styles.streakItem}>
                  <View style={[styles.streakIcon, { backgroundColor: colors.violet + '20' }]}>
                    <Ionicons name="trophy" size={24} color={colors.violet} />
                  </View>
                  <View style={styles.streakInfo}>
                    <Text variant="h3" color="violet">
                      {gamification?.currentLevel || 1}
                    </Text>
                    <Text variant="caption" color="mutedForeground">
                      Level
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Milestones */}
            {milestones && milestones.length > 0 && (
              <Card style={styles.milestonesCard}>
                <H3 style={styles.sectionTitle}>Recent Milestones</H3>
                <View style={styles.milestonesList}>
                  {milestones.slice(0, 5).map((milestone) => (
                    <View key={milestone.id} style={styles.milestoneItem}>
                      <View style={[styles.milestoneIcon, { backgroundColor: colors.success + '20' }]}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                      </View>
                      <View style={styles.milestoneInfo}>
                        <Text variant="labelLarge" color="foreground">
                          {milestone.title}
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
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  editCard: {
    padding: spacing.lg,
  },
  sliderSection: {
    marginBottom: spacing.xl,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  notes: {
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  summaryCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  metricCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMetrics: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  weeklyCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyStat: {
    alignItems: 'center',
  },
  streaksCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  streaksList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakItem: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  streakIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakInfo: {
    alignItems: 'center',
  },
  milestonesCard: {
    padding: spacing.lg,
  },
  milestonesList: {
    gap: spacing.md,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  milestoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneInfo: {
    flex: 1,
  },
});
