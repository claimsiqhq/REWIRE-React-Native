import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme';

type SpinnerSize = 'small' | 'large';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  style?: ViewStyle;
}

export function Spinner({
  size = 'small',
  color = colors.accent,
  style,
}: SpinnerProps) {
  return (
    <ActivityIndicator
      size={size}
      color={color}
      style={style}
    />
  );
}

// Full screen loading overlay
export function LoadingOverlay() {
  return (
    <View style={styles.overlay}>
      <Spinner size="large" />
    </View>
  );
}

// Centered loading spinner for containers
export function LoadingContainer({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.container, style]}>
      <Spinner size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
