import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, layout } from '@/theme';
import {
  Text,
  H1,
  Button,
  Input,
  PasswordInput,
  Card,
  Spinner,
} from '@/components/ui';

type AuthMode = 'login' | 'register';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { login, register, error, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
        });
      }
    } catch (err) {
      // Error is handled by useAuth
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormError(null);
  };

  return (
    <LinearGradient
      colors={[colors.nightForest, colors.deepPine]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing['2xl'], paddingBottom: insets.bottom + spacing['2xl'] },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <H1 color="birch" align="center">
              REWIRE
            </H1>
            <Text variant="bodyLarge" color="sage" align="center" style={styles.subtitle}>
              Transform your mindset
            </Text>
          </View>

          {/* Auth Card */}
          <Card style={styles.card}>
            <Text variant="h2" align="center" style={styles.cardTitle}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </Text>

            {/* Error display */}
            {(error || formError) && (
              <View style={styles.errorContainer}>
                <Text variant="bodySmall" color="destructive">
                  {error || formError}
                </Text>
              </View>
            )}

            {/* Registration fields */}
            {mode === 'register' && (
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    containerStyle={styles.input}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    containerStyle={styles.input}
                  />
                </View>
              </View>
            )}

            {/* Email */}
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              containerStyle={styles.input}
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              containerStyle={styles.input}
            />

            {/* Submit button */}
            <Button
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.submitButton}
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>

            {/* Toggle mode */}
            <View style={styles.toggleContainer}>
              <Text variant="body" color="mutedForeground">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <Button
                variant="ghost"
                onPress={toggleMode}
                size="sm"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </Button>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing['3xl'],
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  card: {
    padding: spacing.xl,
    maxWidth: layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  cardTitle: {
    marginBottom: spacing.lg,
  },
  errorContainer: {
    backgroundColor: colors.destructive + '20',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.base,
  },
  input: {
    marginBottom: spacing.base,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
});
