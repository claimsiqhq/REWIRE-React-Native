import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, layout, typography } from '@/theme';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  editable = true,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  return (
    <View style={containerStyle}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          hasError && styles.error,
          !editable && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor={colors.mutedForeground}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          editable={editable}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {(error || hint) && (
        <Text
          variant="caption"
          color={hasError ? 'destructive' : 'mutedForeground'}
          style={styles.helperText}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

// Password Input variant
export interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry'> {}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      secureTextEntry={!showPassword}
      rightIcon={
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.mutedForeground}
          />
        </Pressable>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

// TextArea variant
export interface TextAreaProps extends InputProps {
  rows?: number;
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(({
  rows = 4,
  style,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      multiline
      numberOfLines={rows}
      textAlignVertical="top"
      style={[
        { height: rows * 24, paddingTop: spacing.md },
        style,
      ]}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
    color: colors.foreground,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.inputHeight,
    backgroundColor: colors.input,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  focused: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.destructive,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.base,
    ...typography.body,
    color: colors.foreground,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  leftIcon: {
    paddingLeft: spacing.md,
  },
  rightIcon: {
    paddingRight: spacing.md,
  },
  helperText: {
    marginTop: spacing.xs,
  },
});
