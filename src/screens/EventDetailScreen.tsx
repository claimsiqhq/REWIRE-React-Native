import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { colors, spacing } from '@/theme';
import { Text, H1, Card, Button } from '@/components/ui';

type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

export default function EventDetailScreen() {
  const route = useRoute<EventDetailRouteProp>();
  const { eventId } = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <H1 color="foreground">Event Details</H1>
        <Text variant="body" color="mutedForeground" style={styles.text}>
          Event ID: {eventId}
        </Text>
        <Text variant="body" color="mutedForeground" style={styles.text}>
          Full event details and registration coming soon.
        </Text>
        <Button variant="default" style={styles.button}>
          Register for Event
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
