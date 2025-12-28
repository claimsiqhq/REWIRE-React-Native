import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  onPress: () => void;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: "breathe",
      label: "Breathe",
      icon: "wind",
      color: "#4A7C59",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/(tabs)/practices");
      },
    },
    {
      id: "journal",
      label: "Journal",
      icon: "edit-3",
      color: "#6B5B95",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/(tabs)/journal");
      },
    },
    {
      id: "meditate",
      label: "Meditate",
      icon: "moon",
      color: "#4682B4",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/(tabs)/practices");
      },
    },
    {
      id: "coach",
      label: "AI Coach",
      icon: "message-circle",
      color: "#DAA520",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // TODO: Navigate to AI coach screen
      },
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 20 }}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          className="items-center mr-4"
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <View
            className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
            style={{ backgroundColor: `${action.color}20` }}
          >
            <Feather name={action.icon} size={28} color={action.color} />
          </View>
          <Text className="text-foreground text-sm font-medium">{action.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
