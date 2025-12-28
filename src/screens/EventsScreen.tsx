import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format, isPast, isFuture } from 'date-fns';
import * as Haptics from 'expo-haptics';

import {
  useEvents,
  useMyEventRegistrations,
  useRegisterForEvent,
  Event,
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
} from '@/components/ui';

type TabType = 'upcoming' | 'registered' | 'recordings';

const EVENT_TYPE_ICONS: Record<string, string> = {
  retreat: 'leaf-outline',
  webinar: 'videocam-outline',
  masterclass: 'school-outline',
  workshop: 'construct-outline',
  group_session: 'people-outline',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  retreat: colors.teal,
  webinar: colors.accent,
  masterclass: colors.gold,
  workshop: colors.ember,
  group_session: colors.violet,
};

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: upcomingEvents, isLoading: loadingUpcoming, refetch: refetchUpcoming } = useEvents({ upcoming: true });
  const { data: recordingEvents, isLoading: loadingRecordings, refetch: refetchRecordings } = useEvents({ hasRecording: true });
  const { data: myRegistrations, isLoading: loadingRegistrations, refetch: refetchRegistrations } = useMyEventRegistrations();
  const registerForEvent = useRegisterForEvent();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchUpcoming(), refetchRecordings(), refetchRegistrations()]);
    setIsRefreshing(false);
  };

  const handleRegister = async (eventId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    registerForEvent.mutate(eventId);
  };

  const handleViewRecording = (url: string) => {
    Linking.openURL(url);
  };

  const isRegistered = (eventId: string) => {
    return myRegistrations?.some(r => r.eventId === eventId) ?? false;
  };

  const formatEventDate = (startTime: string) => {
    return format(new Date(startTime), 'MMM d, yyyy • h:mm a');
  };

  const formatPrice = (cents: number) => {
    if (cents === 0) return 'Free';
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getEvents = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingEvents;
      case 'registered':
        return myRegistrations?.map(r => r.event);
      case 'recordings':
        return recordingEvents;
      default:
        return [];
    }
  };

  const isLoading =
    (activeTab === 'upcoming' && loadingUpcoming) ||
    (activeTab === 'registered' && loadingRegistrations) ||
    (activeTab === 'recordings' && loadingRecordings);

  const events = getEvents();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <H1 color="birch">Events</H1>
        <Text variant="body" color="mutedForeground">
          Connect with the community
        </Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        <Pressable
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={activeTab === 'upcoming' ? colors.accent : colors.mutedForeground}
          />
          <Text
            variant="label"
            color={activeTab === 'upcoming' ? 'accent' : 'mutedForeground'}
          >
            Upcoming
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'registered' && styles.tabActive]}
          onPress={() => setActiveTab('registered')}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={18}
            color={activeTab === 'registered' ? colors.accent : colors.mutedForeground}
          />
          <Text
            variant="label"
            color={activeTab === 'registered' ? 'accent' : 'mutedForeground'}
          >
            Registered
          </Text>
          {myRegistrations && myRegistrations.length > 0 && (
            <Badge variant="success" size="sm">
              {myRegistrations.length}
            </Badge>
          )}
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'recordings' && styles.tabActive]}
          onPress={() => setActiveTab('recordings')}
        >
          <Ionicons
            name="play-circle-outline"
            size={18}
            color={activeTab === 'recordings' ? colors.accent : colors.mutedForeground}
          />
          <Text
            variant="label"
            color={activeTab === 'recordings' ? 'accent' : 'mutedForeground'}
          >
            Recordings
          </Text>
        </Pressable>
      </ScrollView>

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
          {events && events.length > 0 ? (
            <View style={styles.eventList}>
              {events.map((event) => event && (
                <Card key={event.id} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <View
                      style={[
                        styles.eventIcon,
                        { backgroundColor: (EVENT_TYPE_COLORS[event.eventType] || colors.accent) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={EVENT_TYPE_ICONS[event.eventType] as any || 'calendar-outline'}
                        size={24}
                        color={EVENT_TYPE_COLORS[event.eventType] || colors.accent}
                      />
                    </View>
                    <View style={styles.eventInfo}>
                      <Text variant="h4" color="foreground" numberOfLines={2}>
                        {event.title}
                      </Text>
                      <Text variant="caption" color="mutedForeground">
                        {formatEventDate(event.startTime)}
                      </Text>
                    </View>
                  </View>

                  {event.description && (
                    <Text
                      variant="body"
                      color="mutedForeground"
                      numberOfLines={2}
                      style={styles.description}
                    >
                      {event.description}
                    </Text>
                  )}

                  <View style={styles.eventMeta}>
                    <View style={styles.tags}>
                      <Badge variant="outline" size="sm">
                        {event.eventType.replace('_', ' ')}
                      </Badge>
                      <Badge
                        variant={event.locationType === 'virtual' ? 'secondary' : 'success'}
                        size="sm"
                      >
                        {event.locationType}
                      </Badge>
                      <Badge variant="warning" size="sm">
                        {formatPrice(event.priceCents)}
                      </Badge>
                    </View>
                  </View>

                  <View style={styles.eventFooter}>
                    {activeTab === 'recordings' && event.recordingUrl ? (
                      <Button
                        variant="default"
                        size="sm"
                        leftIcon={<Ionicons name="play" size={16} color={colors.primaryForeground} />}
                        onPress={() => handleViewRecording(event.recordingUrl!)}
                        fullWidth
                      >
                        Watch Recording
                      </Button>
                    ) : isRegistered(event.id) ? (
                      <Button variant="outline" size="sm" fullWidth disabled>
                        Registered
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onPress={() => handleRegister(event.id)}
                        loading={registerForEvent.isPending}
                        fullWidth
                      >
                        Register
                      </Button>
                    )}
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name={activeTab === 'recordings' ? 'play-circle-outline' : 'calendar-outline'}
                size={64}
                color={colors.mutedForeground}
              />
              <Text variant="h3" color="foreground" align="center">
                {activeTab === 'upcoming' && 'No Upcoming Events'}
                {activeTab === 'registered' && 'No Registrations'}
                {activeTab === 'recordings' && 'No Recordings Available'}
              </Text>
              <Text variant="body" color="mutedForeground" align="center">
                {activeTab === 'upcoming' && 'Check back soon for new events'}
                {activeTab === 'registered' && 'Register for an event to see it here'}
                {activeTab === 'recordings' && 'Past event recordings will appear here'}
              </Text>
            </View>
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
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '15',
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  eventList: {
    gap: spacing.md,
  },
  eventCard: {
    padding: spacing.base,
  },
  eventHeader: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  description: {
    marginTop: spacing.sm,
  },
  eventMeta: {
    marginTop: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  eventFooter: {
    marginTop: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['5xl'],
    gap: spacing.md,
  },
});
