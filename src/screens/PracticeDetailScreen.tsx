import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { usePractice } from '@/lib/api';
import { colors, spacing } from '@/theme';
import { Text, H1, Card, Button, LoadingContainer } from '@/components/ui';

type PracticeDetailRouteProp = RouteProp<RootStackParamList, 'PracticeDetail'>;

export default function PracticeDetailScreen() {
  const route = useRoute<PracticeDetailRouteProp>();
  const { practiceId } = route.params;

  const { data: practice, isLoading } = usePractice(practiceId);

  if (isLoading) {
    return <LoadingContainer />;
  }

  if (!practice) {
    return (
      <View style={styles.container}>
        <Text>Practice not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <H1 color="foreground">{practice.name}</H1>
        <Text variant="body" color="mutedForeground" style={styles.description}>
          {practice.description}
        </Text>
        <Text variant="label" color="accent">
          Duration: {Math.floor(practice.durationSeconds / 60)} minutes
        </Text>
        <Button variant="default" style={styles.button}>
          Start Practice
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.base,
  },
  card: {
    padding: spacing.lg,
  },
  description: {
    marginVertical: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
});
