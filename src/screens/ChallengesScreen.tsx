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
import { format, differenceInDays } from 'date-fns';
import * as Haptics from 'expo-haptics';

import {
  useChallenges,
  useMyChallenge,
  useJoinChallenge,
  Challenge,
  ChallengeParticipant,
} from '@/lib/api';
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
  Separator,
} from '@/components/ui';

type TabType = 'discover' | 'my-challenges';

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: allChallenges, isLoading: loadingAll, refetch: refetchAll } = useChallenges({ active: true });
  const { data: myChallenges, isLoading: loadingMy, refetch: refetchMy } = useMyChallenge();
  const joinChallenge = useJoinChallenge();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchAll(), refetchMy()]);
    setIsRefreshing(false);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    joinChallenge.mutate(challengeId);
  };

  const handleViewChallenge = (challengeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('ChallengeDetail', { challengeId } as never);
  };

  const isJoined = (challengeId: string) => {
    return myChallenges?.some(c => c.challengeId === challengeId) ?? false;
  };

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    return days > 0 ? `${days} days left` : 'Ended';
  };

  const getProgress = (participant: ChallengeParticipant & { challenge: Challenge }) => {
    const totalDays = participant.challenge.durationDays;
    const completed = participant.totalCompletions;
    return Math.min((completed / totalDays) * 100, 100);
  };

  const isLoading = activeTab === 'discover' ? loadingAll : loadingMy;
  const challenges = activeTab === 'discover' ? allChallenges : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <H1 color="birch">Challenges</H1>
        <Text variant="body" color="mutedForeground">
          Join the brotherhood
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'discover' && styles.tabActive]}
          onPress={() => setActiveTab('discover')}
        >
          <Text
            variant="labelLarge"
            color={activeTab === 'discover' ? 'accent' : 'mutedForeground'}
          >
            Discover
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'my-challenges' && styles.tabActive]}
          onPress={() => setActiveTab('my-challenges')}
        >
          <Text
            variant="labelLarge"
            color={activeTab === 'my-challenges' ? 'accent' : 'mutedForeground'}
          >
            My Challenges
          </Text>
          {myChallenges && myChallenges.length > 0 && (
            <Badge variant="success" size="sm">
              {myChallenges.length}
            </Badge>
          )}
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingContainer />
      ) : (
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
          {activeTab === 'discover' ? (
            // Discover Tab
            challenges && challenges.length > 0 ? (
              <View style={styles.challengeList}>
                {challenges.map((challenge) => (
                  <Card key={challenge.id} style={styles.challengeCard}>
                    <View style={styles.challengeHeader}>
                      <View style={styles.challengeIcon}>
                        <Ionicons name="trophy-outline" size={24} color={colors.gold} />
                      </View>
                      <View style={styles.challengeInfo}>
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
                        style={styles.description}
                      >
                        {challenge.description}
                      </Text>
                    )}
                    <View style={styles.challengeFooter}>
                      <View style={styles.challengeTags}>
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
              <View style={styles.emptyState}>
                <Ionicons name="trophy-outline" size={64} color={colors.mutedForeground} />
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
              <View style={styles.challengeList}>
                {myChallenges.map((participation) => (
                  <PressableCard
                    key={participation.id}
                    style={styles.myChallenge}
                    onPress={() => handleViewChallenge(participation.challengeId)}
                  >
                    <View style={styles.challengeHeader}>
                      <View style={[styles.challengeIcon, { backgroundColor: colors.success + '20' }]}>
                        <Ionicons name="flame" size={24} color={colors.ember} />
                      </View>
                      <View style={styles.challengeInfo}>
                        <Text variant="h4" color="foreground" numberOfLines={1}>
                          {participation.challenge.title}
                        </Text>
                        <Text variant="caption" color="mutedForeground">
                          {getDaysRemaining(participation.challenge.endDate)}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressSection}>
                      <View style={styles.progressLabels}>
                        <Text variant="caption" color="mutedForeground">
                          Progress
                        </Text>
                        <Text variant="caption" color="accent">
                          {participation.totalCompletions}/{participation.challenge.durationDays} days
                        </Text>
                      </View>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${getProgress(participation)}%` },
                          ]}
                        />
                      </View>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                      <View style={styles.stat}>
                        <Text variant="h3" color="ember">
                          {participation.currentStreak}
                        </Text>
                        <Text variant="caption" color="mutedForeground">
                          Current Streak
                        </Text>
                      </View>
                      <View style={styles.stat}>
                        <Text variant="h3" color="gold">
                          {participation.bestStreak}
                        </Text>
                        <Text variant="caption" color="mutedForeground">
                          Best Streak
                        </Text>
                      </View>
                      <View style={styles.stat}>
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
              <View style={styles.emptyState}>
                <Ionicons name="fitness-outline" size={64} color={colors.mutedForeground} />
                <Text variant="h3" color="foreground" align="center">
                  No Challenges Yet
                </Text>
                <Text variant="body" color="mutedForeground" align="center">
                  Join a challenge to start your journey
                </Text>
                <Button
                  variant="default"
                  onPress={() => setActiveTab('discover')}
                  style={styles.emptyButton}
                >
                  Discover Challenges
                </Button>
              </View>
            )
          )}
        </ScrollView>
      )}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    marginRight: spacing.md,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  challengeList: {
    gap: spacing.md,
  },
  challengeCard: {
    padding: spacing.base,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gold + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeInfo: {
    flex: 1,
  },
  description: {
    marginTop: spacing.sm,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  challengeTags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  myChallenge: {
    padding: spacing.base,
  },
  progressSection: {
    marginTop: spacing.md,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['5xl'],
    gap: spacing.md,
  },
  emptyButton: {
    marginTop: spacing.lg,
  },
});
