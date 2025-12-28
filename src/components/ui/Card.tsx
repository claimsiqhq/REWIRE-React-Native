import React from 'react';
import { View, ViewProps, StyleSheet, Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, shadows } from '@/theme';
import { Text } from './Text';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...props
}: CardProps) {
  const variantStyles = getCardVariantStyles(variant);
  const paddingValue = getPaddingValue(padding);

  return (
    <View
      style={[
        styles.base,
        variantStyles,
        { padding: paddingValue },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

// Pressable card variant
export interface PressableCardProps extends Omit<PressableProps, 'style'> {
  variant?: 'default' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  style?: any;
}

export function PressableCard({
  variant = 'default',
  padding = 'md',
  style,
  children,
  onPress,
  ...props
}: PressableCardProps) {
  const variantStyles = getCardVariantStyles(variant);
  const paddingValue = getPaddingValue(padding);

  const handlePress = async (event: any) => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(event);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        variantStyles,
        { padding: paddingValue },
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

// Card Header
export function CardHeader({ children, style, ...props }: ViewProps & { children: React.ReactNode }) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

// Card Title
export function CardTitle({ children, ...props }: { children: React.ReactNode }) {
  return (
    <Text variant="h3" {...props}>
      {children}
    </Text>
  );
}

// Card Description
export function CardDescription({ children, ...props }: { children: React.ReactNode }) {
  return (
    <Text variant="bodySmall" color="mutedForeground" {...props}>
      {children}
    </Text>
  );
}

// Card Content
export function CardContent({ children, style, ...props }: ViewProps & { children: React.ReactNode }) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

// Card Footer
export function CardFooter({ children, style, ...props }: ViewProps & { children: React.ReactNode }) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

function getCardVariantStyles(variant: 'default' | 'outline' | 'ghost') {
  switch (variant) {
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
      };
    default:
      return {
        backgroundColor: colors.card,
        ...shadows.sm,
      };
  }
}

function getPaddingValue(padding: 'none' | 'sm' | 'md' | 'lg') {
  switch (padding) {
    case 'none':
      return 0;
    case 'sm':
      return spacing.sm;
    case 'lg':
      return spacing.lg;
    default:
      return spacing.base;
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  header: {
    marginBottom: spacing.sm,
  },
  content: {
    marginVertical: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
