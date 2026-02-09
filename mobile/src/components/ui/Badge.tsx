import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { Text } from './Text';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  style,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <View
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        style,
      ]}
      {...props}
    >
      <Text
        variant={size === 'sm' ? 'labelSmall' : 'label'}
        style={{ color: variantStyles.textColor }}
      >
        {children}
      </Text>
    </View>
  );
}

function getVariantStyles(variant: BadgeVariant) {
  const variants: Record<BadgeVariant, { container: object; textColor: string }> = {
    default: {
      container: {
        backgroundColor: colors.primary,
      },
      textColor: colors.primaryForeground,
    },
    secondary: {
      container: {
        backgroundColor: colors.secondary,
      },
      textColor: colors.secondaryForeground,
    },
    success: {
      container: {
        backgroundColor: colors.success,
      },
      textColor: colors.successForeground,
    },
    warning: {
      container: {
        backgroundColor: colors.warning,
      },
      textColor: colors.warningForeground,
    },
    destructive: {
      container: {
        backgroundColor: colors.destructive,
      },
      textColor: colors.destructiveForeground,
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
      },
      textColor: colors.foreground,
    },
  };

  return variants[variant];
}

function getSizeStyles(size: BadgeSize) {
  const sizes: Record<BadgeSize, { container: object }> = {
    sm: {
      container: {
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
      },
    },
    md: {
      container: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
      },
    },
  };

  return sizes[size];
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
