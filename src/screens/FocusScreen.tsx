import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius } from '@/theme';
import {
  Text,
  H1,
  H2,
  Card,
  Button,
  Badge,
} from '@/components/ui';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
  cycles: number;
}

const TECHNIQUES: BreathingTechnique[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal parts inhale, hold, exhale, hold',
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4,
    cycles: 4,
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Calming breath for relaxation',
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 0,
    cycles: 4,
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'Quick breaths to boost energy',
    inhale: 2,
    hold: 0,
    exhale: 2,
    rest: 0,
    cycles: 10,
  },
];

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
  rest: 'Rest',
};

const PHASE_COLORS: Record<BreathPhase, string> = {
  inhale: colors.teal,
  hold: colors.violet,
  exhale: colors.sage,
  rest: colors.mutedForeground,
};

export default function FocusScreen() {
  const insets = useSafeAreaInsets();

  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(TECHNIQUES[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = useCallback((phase: BreathPhase, duration: number) => {
    const toValue = phase === 'inhale' ? 1.5 : phase === 'exhale' ? 1 : 1.25;

    Animated.timing(scaleAnim, {
      toValue,
      duration: duration * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const getNextPhase = useCallback((current: BreathPhase): { phase: BreathPhase; duration: number } | null => {
    const t = selectedTechnique;
    switch (current) {
      case 'inhale':
        return t.hold > 0 ? { phase: 'hold', duration: t.hold } : { phase: 'exhale', duration: t.exhale };
      case 'hold':
        return { phase: 'exhale', duration: t.exhale };
      case 'exhale':
        return t.rest > 0 ? { phase: 'rest', duration: t.rest } : null;
      case 'rest':
        return null;
      default:
        return null;
    }
  }, [selectedTechnique]);

  const startBreathing = useCallback(() => {
    setIsActive(true);
    setIsComplete(false);
    setCurrentCycle(1);
    setPhase('inhale');
    setCountdown(selectedTechnique.inhale);
    startAnimation('inhale', selectedTechnique.inhale);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [selectedTechnique, startAnimation]);

  const stopBreathing = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    scaleAnim.setValue(1);
  }, [scaleAnim]);

  useEffect(() => {
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const next = getNextPhase(phase);

          if (next) {
            setPhase(next.phase);
            startAnimation(next.phase, next.duration);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            return next.duration;
          } else {
            // End of cycle
            if (currentCycle < selectedTechnique.cycles) {
              setCurrentCycle((c) => c + 1);
              setPhase('inhale');
              startAnimation('inhale', selectedTechnique.inhale);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              return selectedTechnique.inhale;
            } else {
              // Complete
              setIsActive(false);
              setIsComplete(true);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, phase, currentCycle, selectedTechnique, getNextPhase, startAnimation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <H1 color="birch">Focus</H1>
        <Text variant="body" color="mutedForeground">
          Grounding & Breathwork
        </Text>
      </View>

      {/* Technique Selector */}
      {!isActive && !isComplete && (
        <View style={styles.techniques}>
          {TECHNIQUES.map((technique) => (
            <Card
              key={technique.id}
              style={[
                styles.techniqueCard,
                selectedTechnique.id === technique.id && styles.selectedTechnique,
              ]}
              onTouchEnd={() => setSelectedTechnique(technique)}
            >
              <Text variant="labelLarge" color="foreground">
                {technique.name}
              </Text>
              <Text variant="caption" color="mutedForeground">
                {technique.description}
              </Text>
            </Card>
          ))}
        </View>
      )}

      {/* Breathing Circle */}
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: isActive ? PHASE_COLORS[phase] + '30' : colors.deepPine,
              borderColor: isActive ? PHASE_COLORS[phase] : colors.border,
            },
          ]}
        >
          {isActive ? (
            <View style={styles.circleContent}>
              <Text variant="displayLarge" color="foreground">
                {countdown}
              </Text>
              <Text variant="h3" style={{ color: PHASE_COLORS[phase] }}>
                {PHASE_LABELS[phase]}
              </Text>
              <Badge variant="outline" size="sm">
                Cycle {currentCycle}/{selectedTechnique.cycles}
              </Badge>
            </View>
          ) : isComplete ? (
            <View style={styles.circleContent}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
              <Text variant="h3" color="success">
                Complete!
              </Text>
              <Text variant="body" color="mutedForeground">
                Great job!
              </Text>
            </View>
          ) : (
            <View style={styles.circleContent}>
              <Text variant="h2" color="foreground">
                {selectedTechnique.name}
              </Text>
              <Text variant="body" color="mutedForeground">
                Tap Start to begin
              </Text>
            </View>
          )}
        </Animated.View>
      </View>

      {/* Control Button */}
      <View style={styles.controls}>
        {isActive ? (
          <Button
            variant="destructive"
            size="lg"
            onPress={stopBreathing}
            style={styles.controlButton}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="default"
            size="lg"
            onPress={startBreathing}
            style={styles.controlButton}
          >
            {isComplete ? 'Start Again' : 'Start Breathing'}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.base,
  },
  header: {
    marginBottom: spacing.lg,
  },
  techniques: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  techniqueCard: {
    padding: spacing.md,
  },
  selectedTechnique: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  circleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContent: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  controls: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  controlButton: {
    minWidth: 200,
  },
});
