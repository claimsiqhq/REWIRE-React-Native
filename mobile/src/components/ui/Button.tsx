import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { colors, spacing, borderRadius, layout, shadows } from '@/theme';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  style,
  onPress,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const handlePress = async (event: any) => {
    if (!isDisabled && onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(event);
    }
  };

  const variantStyles = getVariantStyles(variant, isDisabled);
  const sizeStyles = getSizeStyles(size);

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            variant={size === 'sm' ? 'buttonSmall' : 'button'}
            style={{ color: variantStyles.textColor }}
          >
            {children}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

function getVariantStyles(variant: ButtonVariant, disabled: boolean) {
  const opacity = disabled ? 0.5 : 1;

  const variants: Record<ButtonVariant, { container: ViewStyle; textColor: string }> = {
    default: {
      container: {
        backgroundColor: colors.primary,
        opacity,
      },
      textColor: colors.primaryForeground,
    },
    secondary: {
      container: {
        backgroundColor: colors.secondary,
        opacity,
      },
      textColor: colors.secondaryForeground,
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
        opacity,
      },
      textColor: colors.foreground,
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
        opacity,
      },
      textColor: colors.foreground,
    },
    destructive: {
      container: {
        backgroundColor: colors.destructive,
        opacity,
      },
      textColor: colors.destructiveForeground,
    },
    success: {
      container: {
        backgroundColor: colors.success,
        opacity,
      },
      textColor: colors.successForeground,
    },
  };

  return variants[variant];
}

function getSizeStyles(size: ButtonSize) {
  const sizes: Record<ButtonSize, { container: ViewStyle }> = {
    sm: {
      container: {
        height: layout.buttonHeightSmall,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
      },
    },
    md: {
      container: {
        height: layout.buttonHeightMedium,
        paddingHorizontal: spacing.base,
        borderRadius: borderRadius.base,
      },
    },
    lg: {
      container: {
        height: layout.buttonHeightLarge,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
      },
    },
  };

  return sizes[size];
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
