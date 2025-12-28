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
import * as Haptics from 'expo-haptics';

import { usePractices, useToggleFavorite, useFavorites, Practice } from '@/lib/api';
import { colors, spacing, borderRadius } from '@/theme';
import {
  Text,
  H1,
  H3,
  Card,
  PressableCard,
  Button,
  Badge,
  LoadingContainer,
} from '@/components/ui';

type FilterType = 'all' | 'breathing' | 'meditation' | 'body_scan';
type FilterCategory = 'all' | 'energizing' | 'grounding' | 'sleep' | 'focus' | 'stress_relief';

const TYPE_FILTERS: { value: FilterType; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: 'apps-outline' },
  { value: 'breathing', label: 'Breathing', icon: 'flower-outline' },
  { value: 'meditation', label: 'Meditation', icon: 'leaf-outline' },
  { value: 'body_scan', label: 'Body Scan', icon: 'body-outline' },
];

const CATEGORY_FILTERS: { value: FilterCategory; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: colors.accent },
  { value: 'energizing', label: 'Energizing', color: colors.ember },
  { value: 'grounding', label: 'Grounding', color: colors.teal },
  { value: 'sleep', label: 'Sleep', color: colors.violet },
  { value: 'focus', label: 'Focus', color: colors.gold },
  { value: 'stress_relief', label: 'Stress Relief', color: colors.sage },
];

const PRACTICE_ICONS: Record<string, string> = {
  breathing: 'flower-outline',
  meditation: 'leaf-outline',
  body_scan: 'body-outline',
};

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');

  const filters = {
    type: typeFilter !== 'all' ? typeFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  };

  const { data: practices, isLoading, refetch } = usePractices(filters);
  const { data: favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handlePracticePress = (practice: Practice) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PracticeDetail', { practiceId: practice.id } as never);
  };

  const handleFavoriteToggle = async (practiceId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite.mutate(practiceId);
  };

  const isFavorited = (practiceId: string) => {
    return favorites?.some(f => f.practiceId === practiceId) ?? false;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  if (isLoading) {
    return <LoadingContainer />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <H1 color="birch">Library</H1>
        <Text variant="body" color="mutedForeground">
          Explore practices for your journey
        </Text>
      </View>

      {/* Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {TYPE_FILTERS.map((filter) => (
          <Pressable
            key={filter.value}
            onPress={() => setTypeFilter(filter.value)}
            style={[
              styles.filterChip,
              typeFilter === filter.value && styles.filterChipActive,
            ]}
          >
            <Ionicons
              name={filter.icon as any}
              size={16}
              color={typeFilter === filter.value ? colors.primaryForeground : colors.foreground}
            />
            <Text
              variant="label"
              color={typeFilter === filter.value ? 'primaryForeground' : 'foreground'}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORY_FILTERS.map((filter) => (
          <Pressable
            key={filter.value}
            onPress={() => setCategoryFilter(filter.value)}
            style={[
              styles.categoryChip,
              { borderColor: filter.color },
              categoryFilter === filter.value && { backgroundColor: filter.color + '30' },
            ]}
          >
            <Text
              variant="labelSmall"
              style={{ color: filter.color }}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Practice List */}
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
        {practices && practices.length > 0 ? (
          <View style={styles.practiceGrid}>
            {practices.map((practice) => (
              <PressableCard
                key={practice.id}
                style={styles.practiceCard}
                onPress={() => handlePracticePress(practice)}
              >
                <View style={styles.practiceHeader}>
                  <View style={[styles.practiceIcon, { backgroundColor: colors.accent + '20' }]}>
                    <Ionicons
                      name={PRACTICE_ICONS[practice.type] as any || 'flower-outline'}
                      size={24}
                      color={colors.accent}
                    />
                  </View>
                  <Pressable onPress={() => handleFavoriteToggle(practice.id)}>
                    <Ionicons
                      name={isFavorited(practice.id) ? 'heart' : 'heart-outline'}
                      size={22}
                      color={isFavorited(practice.id) ? colors.coral : colors.mutedForeground}
                    />
                  </Pressable>
                </View>
                <Text variant="labelLarge" color="foreground" numberOfLines={1}>
                  {practice.name}
                </Text>
                {practice.subtitle && (
                  <Text variant="caption" color="mutedForeground" numberOfLines={1}>
                    {practice.subtitle}
                  </Text>
                )}
                <View style={styles.practiceFooter}>
                  <Badge variant="outline" size="sm">
                    {formatDuration(practice.durationSeconds)}
                  </Badge>
                  <Badge variant="secondary" size="sm">
                    {practice.category.replace('_', ' ')}
                  </Badge>
                </View>
              </PressableCard>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="library-outline" size={64} color={colors.mutedForeground} />
            <Text variant="h3" color="foreground" align="center">
              No Practices Found
            </Text>
            <Text variant="body" color="mutedForeground" align="center">
              Try adjusting your filters
            </Text>
          </View>
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
  filterRow: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  practiceCard: {
    width: '48%',
    padding: spacing.base,
  },
  practiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  practiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceFooter: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['5xl'],
    gap: spacing.md,
  },
});
