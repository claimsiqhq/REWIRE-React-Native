import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useCoachChat, useQuickAction, ChatMessage } from '@/lib/api';
import { colors, spacing, borderRadius } from '@/theme';
import {
  Text,
  H1,
  H3,
  Card,
  PressableCard,
  Button,
  Input,
  Spinner,
} from '@/components/ui';

const QUICK_ACTIONS = [
  {
    type: 'regulate' as const,
    label: 'Regulate',
    description: 'Calm your nervous system',
    icon: 'heart-outline',
    color: colors.teal,
  },
  {
    type: 'reframe' as const,
    label: 'Reframe',
    description: 'Shift your perspective',
    icon: 'bulb-outline',
    color: colors.gold,
  },
  {
    type: 'reset' as const,
    label: 'Reset',
    description: 'Clear mental clutter',
    icon: 'refresh-outline',
    color: colors.violet,
  },
];

export default function CoachScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatMutation = useCoachChat();
  const quickActionMutation = useQuickAction();

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: inputText.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await chatMutation.mutateAsync({
        message: inputText.trim(),
        conversationHistory: messages,
      });

      setMessages([...newMessages, { role: 'assistant', content: response.response }]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: "I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleQuickAction = async (actionType: 'regulate' | 'reframe' | 'reset') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsTyping(true);

    try {
      const response = await quickActionMutation.mutateAsync({ actionType });
      setMessages([
        ...messages,
        { role: 'user', content: `Quick action: ${actionType}` },
        { role: 'assistant', content: response.response },
      ]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setMessages([
        ...messages,
        { role: 'assistant', content: "I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <H1 color="birch">Coach Brian</H1>
        <Text variant="body" color="mutedForeground">
          Your AI mindset coach
        </Text>
      </View>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <View style={styles.quickActions}>
          <H3 style={styles.sectionTitle}>Quick Actions</H3>
          <View style={styles.actionsRow}>
            {QUICK_ACTIONS.map((action) => (
              <PressableCard
                key={action.type}
                style={[styles.actionCard, { borderColor: action.color }]}
                onPress={() => handleQuickAction(action.type)}
              >
                <Ionicons
                  name={action.icon as any}
                  size={28}
                  color={action.color}
                />
                <Text variant="labelLarge" color="foreground">
                  {action.label}
                </Text>
                <Text variant="caption" color="mutedForeground" align="center">
                  {action.description}
                </Text>
              </PressableCard>
            ))}
          </View>
        </View>
      )}

      {/* Chat Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text
              variant="body"
              color={message.role === 'user' ? 'primaryForeground' : 'foreground'}
            >
              {message.content}
            </Text>
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageBubble, styles.assistantMessage]}>
            <Spinner size="small" />
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Input
          placeholder="Ask Coach Brian anything..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
          containerStyle={styles.input}
        />
        <Button
          variant="default"
          size="md"
          onPress={handleSendMessage}
          disabled={!inputText.trim() || chatMutation.isPending}
        >
          <Ionicons name="send" size={20} color={colors.primaryForeground} />
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.base,
    paddingBottom: spacing.md,
  },
  quickActions: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.sm,
    borderWidth: 2,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: spacing.base,
    gap: spacing.md,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.accent,
    borderBottomRightRadius: spacing.xs,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
});
