import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDailyQuote } from "../hooks/use-api";

export function DailyQuote() {
  const { data: quote, isLoading } = useDailyQuote();

  if (isLoading) {
    return (
      <View className="bg-card rounded-2xl p-5 border border-border">
        <View className="h-4 bg-muted rounded w-3/4 mb-2" />
        <View className="h-4 bg-muted rounded w-1/2" />
      </View>
    );
  }

  if (!quote) {
    return (
      <View className="bg-card rounded-2xl p-5 border border-border">
        <View className="flex-row items-start">
          <Feather name="sun" size={20} color="#4A7C59" style={{ marginTop: 2 }} />
          <View className="flex-1 ml-3">
            <Text className="text-foreground italic">
              "Every day is a new opportunity to grow and become a better version of yourself."
            </Text>
            <Text className="text-muted-foreground text-sm mt-2">— Daily Wisdom</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-card rounded-2xl p-5 border border-border">
      <View className="flex-row items-start">
        <Feather name="sun" size={20} color="#4A7C59" style={{ marginTop: 2 }} />
        <View className="flex-1 ml-3">
          <Text className="text-foreground italic">"{quote.content}"</Text>
          {quote.author && (
            <Text className="text-muted-foreground text-sm mt-2">— {quote.author}</Text>
          )}
        </View>
      </View>
    </View>
  );
}
