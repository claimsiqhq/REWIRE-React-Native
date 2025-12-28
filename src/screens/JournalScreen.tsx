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
import { format, formatDistanceToNow } from 'date-fns';

import { useJournalEntries } from '@/lib/api';
import { colors, spacing, borderRadius } from '@/theme';
import {
  Text,
  H1,
  Card,
  PressableCard,
  Button,
  Badge,
  LoadingContainer,
} from '@/components/ui';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: entries, isLoading, refetch } = useJournalEntries();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleNewEntry = () => {
    navigation.navigate('JournalEntry' as never);
  };

  const handleEditEntry = (entryId: string) => {
    navigation.navigate('JournalEntry', { entryId } as never);
  };

  if (isLoading) {
    return <LoadingContainer />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <H1 color="birch">Journal</H1>
          <Text variant="body" color="mutedForeground">
            Reflect & grow
          </Text>
        </View>
        <Button
          variant="default"
          size="sm"
          leftIcon={<Ionicons name="add" size={18} color={colors.primaryForeground} />}
          onPress={handleNewEntry}
        >
          New Entry
        </Button>
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
        {entries && entries.length > 0 ? (
          <View style={styles.entriesList}>
            {entries.map((entry) => (
              <PressableCard
                key={entry.id}
                style={styles.entryCard}
                onPress={() => handleEditEntry(entry.id)}
              >
                <View style={styles.entryHeader}>
                  <Text variant="h4" color="foreground" numberOfLines={1}>
                    {entry.title}
                  </Text>
                  {entry.mood && (
                    <Badge variant="secondary" size="sm">
                      {entry.mood}
                    </Badge>
                  )}
                </View>
                <Text
                  variant="body"
                  color="mutedForeground"
                  numberOfLines={2}
                  style={styles.entryPreview}
                >
                  {entry.content}
                </Text>
                <Text variant="caption" color="mutedForeground">
                  {entry.createdAt
                    ? formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })
                    : 'Just now'}
                </Text>
              </PressableCard>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color={colors.mutedForeground} />
            <Text variant="h3" color="foreground" align="center">
              Start Your Journey
            </Text>
            <Text variant="body" color="mutedForeground" align="center">
              Capture your thoughts, reflect on your progress, and track your growth.
            </Text>
            <Button
              variant="default"
              onPress={handleNewEntry}
              style={styles.emptyButton}
            >
              Write Your First Entry
            </Button>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.base,
    paddingBottom: spacing.md,
  },
  scrollContent: {
    padding: spacing.base,
    paddingTop: 0,
    paddingBottom: spacing['3xl'],
  },
  entriesList: {
    gap: spacing.md,
  },
  entryCard: {
    padding: spacing.base,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  entryPreview: {
    marginBottom: spacing.sm,
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
