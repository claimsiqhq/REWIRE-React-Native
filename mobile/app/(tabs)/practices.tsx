import { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { usePractices, usePracticeFavorites } from "@/src/hooks/use-api";
import { router } from "expo-router";

const PRACTICE_CATEGORIES = [
  { id: "breathing", label: "Breathing", icon: "wind" as const, color: "#4A7C59" },
  { id: "meditation", label: "Meditation", icon: "moon" as const, color: "#6B5B95" },
  { id: "bodyscan", label: "Body Scan", icon: "activity" as const, color: "#DAA520" },
  { id: "grounding", label: "Grounding", icon: "anchor" as const, color: "#4682B4" },
];

export default function PracticesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: practices, refetch } = usePractices();
  const { data: favorites } = usePracticeFavorites();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredPractices = selectedCategory
    ? practices?.filter((p: any) => p.category === selectedCategory)
    : practices;

  const favoriteIds = new Set(favorites?.map((f: any) => f.practiceId) || []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4">
        <Text className="text-foreground text-2xl font-bold">Practices</Text>
        <Text className="text-muted-foreground mt-1">
          Breathing, meditation & grounding exercises
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A7C59"
          />
        }
      >
        {/* Quick Start */}
        <View className="px-5 mb-6">
          <TouchableOpacity className="bg-primary rounded-2xl p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white/80 text-sm">QUICK START</Text>
                <Text className="text-white font-bold text-xl mt-1">
                  Box Breathing
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  4 min • Calm & Focus
                </Text>
              </View>
              <View className="bg-white/20 w-14 h-14 rounded-full items-center justify-center">
                <Feather name="play" size={28} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="px-5 mb-4">
          <Text className="text-muted-foreground text-sm font-medium mb-3">CATEGORIES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === null ? "bg-primary" : "bg-card border border-border"
              }`}
              onPress={() => setSelectedCategory(null)}
            >
              <Text className={selectedCategory === null ? "text-white font-medium" : "text-foreground"}>
                All
              </Text>
            </TouchableOpacity>
            {PRACTICE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className={`px-4 py-2 rounded-full mr-2 flex-row items-center ${
                  selectedCategory === cat.id ? "bg-primary" : "bg-card border border-border"
                }`}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Feather
                  name={cat.icon}
                  size={16}
                  color={selectedCategory === cat.id ? "#FFFFFF" : cat.color}
                />
                <Text
                  className={`ml-2 ${
                    selectedCategory === cat.id ? "text-white font-medium" : "text-foreground"
                  }`}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Favorites */}
        {favorites && favorites.length > 0 && !selectedCategory && (
          <View className="px-5 mb-6">
            <Text className="text-muted-foreground text-sm font-medium mb-3">FAVORITES</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {favorites.slice(0, 5).map((fav: any) => {
                const practice = practices?.find((p: any) => p.id === fav.practiceId);
                if (!practice) return null;
                return (
                  <TouchableOpacity
                    key={fav.id}
                    className="bg-card border border-border rounded-xl p-4 mr-3 w-36"
                  >
                    <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mb-2">
                      <Feather name="heart" size={18} color="#4A7C59" />
                    </View>
                    <Text className="text-foreground font-medium" numberOfLines={1}>
                      {practice.name}
                    </Text>
                    <Text className="text-muted-foreground text-sm">
                      {practice.durationMinutes} min
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Practice List */}
        <View className="px-5 mb-6">
          <Text className="text-muted-foreground text-sm font-medium mb-3">
            {selectedCategory ? PRACTICE_CATEGORIES.find(c => c.id === selectedCategory)?.label.toUpperCase() : "ALL PRACTICES"}
          </Text>

          {filteredPractices && filteredPractices.length > 0 ? (
            <View className="space-y-3">
              {filteredPractices.map((practice: any) => (
                <TouchableOpacity
                  key={practice.id}
                  className="bg-card rounded-2xl p-4 border border-border flex-row items-center"
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{
                      backgroundColor:
                        PRACTICE_CATEGORIES.find((c) => c.id === practice.category)?.color + "20",
                    }}
                  >
                    <Feather
                      name={PRACTICE_CATEGORIES.find((c) => c.id === practice.category)?.icon || "circle"}
                      size={22}
                      color={PRACTICE_CATEGORIES.find((c) => c.id === practice.category)?.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-medium">{practice.name}</Text>
                    <Text className="text-muted-foreground text-sm">
                      {practice.durationMinutes} min • {practice.category}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    {favoriteIds.has(practice.id) && (
                      <Feather name="heart" size={18} color="#4A7C59" style={{ marginRight: 12 }} />
                    )}
                    <View className="bg-primary/20 w-10 h-10 rounded-full items-center justify-center">
                      <Feather name="play" size={18} color="#4A7C59" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="bg-card rounded-2xl p-6 border border-border items-center">
              <Feather name="wind" size={40} color="#A0A0A0" />
              <Text className="text-foreground font-medium mt-3">No practices found</Text>
              <Text className="text-muted-foreground text-center mt-1">
                {selectedCategory ? "Try a different category" : "Practices will appear here"}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
