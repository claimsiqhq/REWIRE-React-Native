import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing } from '@/theme';
import { Text } from './Text';

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  disabled = false,
}: SliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const percentage = ((value - min) / (max - min)) * 100;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,
    onPanResponderGrant: async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onPanResponderMove: (_, gestureState) => {
      if (trackWidth === 0) return;

      const newPercentage = Math.max(0, Math.min(100, (gestureState.moveX / trackWidth) * 100));
      const rawValue = (newPercentage / 100) * (max - min) + min;
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      if (clampedValue !== value) {
        onValueChange(clampedValue);
      }
    },
    onPanResponderRelease: async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      {(label || showValue) && (
        <View style={styles.header}>
          {label && (
            <Text variant="label" color="foreground">
              {label}
            </Text>
          )}
          {showValue && (
            <Text variant="body" color="accent">
              {value}
            </Text>
          )}
        </View>
      )}
      <View
        style={[styles.track, disabled && styles.disabled]}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <View style={[styles.fill, { width: `${percentage}%` }]} />
        <View
          style={[
            styles.thumb,
            { left: `${percentage}%`, marginLeft: -12 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  track: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.full,
    position: 'relative',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    position: 'absolute',
    left: 0,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
