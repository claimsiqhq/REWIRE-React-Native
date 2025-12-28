import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { colors, spacing } from '@/theme';
import { Text, H1, Card, Button, LoadingContainer } from '@/components/ui';

type ChallengeDetailRouteProp = RouteProp<RootStackParamList, 'ChallengeDetail'>;

export default function ChallengeDetailScreen() {
  const route = useRoute<ChallengeDetailRouteProp>();
  const { challengeId } = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <H1 color="foreground">Challenge Details</H1>
        <Text variant="body" color="mutedForeground" style={styles.text}>
          Challenge ID: {challengeId}
        </Text>
        <Text variant="body" color="mutedForeground" style={styles.text}>
          Full challenge details and leaderboard coming soon.
        </Text>
        <Button variant="default" style={styles.button}>
          Join Challenge
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
  text: {
    marginVertical: spacing.sm,
  },
  button: {
    marginTop: spacing.lg,
  },
});
