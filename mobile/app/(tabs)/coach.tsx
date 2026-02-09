import { useState, useRef } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCoachChat, useQuickAction, type ChatMessage } from "@/src/hooks/use-api";
import { colors, spacing } from "@/src/theme";
import { Text, H1, Card, Button, Input, Spinner } from "@/src/components/ui";

const QUICK_ACTIONS = [
  {
    type: "regulate" as const,
    label: "Regulate",
    description: "Calm your nervous system",
    icon: "heart",
    color: colors.teal,
  },
  {
    type: "reframe" as const,
    label: "Reframe",
    description: "Shift your perspective",
    icon: "lightbulb",
    color: colors.gold,
  },
  {
    type: "reset" as const,
    label: "Reset",
    description: "Clear mental clutter",
    icon: "refresh-cw",
    color: colors.violet,
  },
];

export default function CoachScreen() {
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatMutation = useCoachChat();
  const quickActionMutation = useQuickAction();

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: inputText.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await chatMutation.mutateAsync({
        message: inputText.trim(),
        conversationHistory: messages,
      });

      setMessages([...newMessages, { role: "assistant", content: response.response }]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleQuickAction = async (actionType: "regulate" | "reframe" | "reset") => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsTyping(true);

    try {
      const response = await quickActionMutation.mutateAsync({ actionType });
      setMessages([
        ...messages,
        { role: "user", content: `Quick action: ${actionType}` },
        { role: "assistant", content: response.response },
      ]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setMessages([
        ...messages,
        { role: "assistant", content: "I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pb-3">
        <H1 color="birch">AI Coach</H1>
        <Text variant="body" color="mutedForeground">
          Your personal transformation guide
        </Text>
      </View>

      {/* Quick Actions */}
      <View className="px-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.type}
              className="bg-card rounded-xl p-4 border border-border min-w-[120]"
              onPress={() => handleQuickAction(action.type)}
              disabled={quickActionMutation.isPending}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <Feather name={action.icon as any} size={20} color={action.color} />
              </View>
              <Text variant="labelLarge" color="foreground">
                {action.label}
              </Text>
              <Text variant="caption" color="mutedForeground" numberOfLines={1}>
                {action.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View className="flex-1 items-center justify-center pt-24">
              <View className="w-20 h-20 bg-accent/20 rounded-full items-center justify-center mb-4">
                <Feather name="message-circle" size={40} color={colors.accent} />
              </View>
              <Text variant="h3" color="foreground" align="center">
                Start a Conversation
              </Text>
              <Text variant="body" color="mutedForeground" align="center" className="mt-2">
                Ask me anything about your journey, or use a quick action above
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {messages.map((message, index) => (
                <View
                  key={index}
                  className={`flex-row ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <Card
                    className={`max-w-[80%] p-3 ${
                      message.role === "user" ? "bg-accent" : "bg-card"
                    }`}
                  >
                    <Text
                      variant="body"
                      color={message.role === "user" ? "accentForeground" : "foreground"}
                    >
                      {message.content}
                    </Text>
                  </Card>
                </View>
              ))}
              {isTyping && (
                <View className="flex-row justify-start">
                  <Card className="bg-card p-3">
                    <Spinner size="small" />
                  </Card>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="px-4 pb-4 pt-2 border-t border-border bg-background">
          <View className="flex-row items-center gap-2">
            <Input
              className="flex-1"
              placeholder="Type your message..."
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              className="bg-accent w-12 h-12 rounded-full items-center justify-center"
              onPress={handleSendMessage}
              disabled={!inputText.trim() || chatMutation.isPending}
            >
              {chatMutation.isPending ? (
                <Spinner size="small" color={colors.accentForeground} />
              ) : (
                <Feather name="send" size={20} color={colors.accentForeground} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
