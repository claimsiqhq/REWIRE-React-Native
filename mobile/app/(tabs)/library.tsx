import { useState, useCallback } from "react";
import { View, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { usePractices, usePracticeFavorites, useTogglePracticeFavorite, type Practice } from "@/src/hooks/use-api";
import { colors, spacing } from "@/src/theme";
import { Text, H1, PressableCard, Badge, LoadingContainer } from "@/src/components/ui";

type FilterType = "all" | "breathing" | "meditation" | "body_scan";
type FilterCategory = "all" | "energizing" | "grounding" | "sleep" | "focus" | "stress_relief";

const TYPE_FILTERS: { value: FilterType; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "grid" },
  { value: "breathing", label: "Breathing", icon: "wind" },
  { value: "meditation", label: "Meditation", icon: "moon" },
  { value: "body_scan", label: "Body Scan", icon: "activity" },
];

const CATEGORY_FILTERS: { value: FilterCategory; label: string; color: string }[] = [
  { value: "all", label: "All", color: colors.accent },
  { value: "energizing", label: "Energizing", color: colors.ember },
  { value: "grounding", label: "Grounding", color: colors.teal },
  { value: "sleep", label: "Sleep", color: colors.violet },
  { value: "focus", label: "Focus", color: colors.gold },
  { value: "stress_relief", label: "Stress Relief", color: colors.sage },
];

const PRACTICE_ICONS: Record<string, string> = {
  breathing: "wind",
  meditation: "moon",
  body_scan: "activity",
};

export default function LibraryScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");

  const filters = {
    type: typeFilter !== "all" ? typeFilter : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  };

  const { data: practices, isLoading, refetch } = usePractices(filters);
  const { data: favorites } = usePracticeFavorites();
  const toggleFavorite = useTogglePracticeFavorite();

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handlePracticePress = (practice: Practice) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/practice/[id]", params: { id: practice.id } });
  };

  const handleFavoriteToggle = async (practiceId: string, e: any) => {
    e.stopPropagation();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite.mutate(Number(practiceId));
  };

  const isFavorited = (practiceId: string) => {
    return favorites?.some((f) => f.practiceId === Number(practiceId)) ?? false;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <LoadingContainer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pb-3">
        <H1 color="birch">Library</H1>
        <Text variant="body" color="mutedForeground">
          Explore practices for your journey
        </Text>
      </View>

      {/* Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.md }}
        className="gap-2"
      >
        {TYPE_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            onPress={() => setTypeFilter(filter.value)}
            className={`flex-row items-center gap-1 px-3 py-2 rounded-full ${
              typeFilter === filter.value ? "bg-accent" : "bg-card border border-border"
            }`}
          >
            <Feather
              name={filter.icon as any}
              size={16}
              color={typeFilter === filter.value ? colors.primaryForeground : colors.foreground}
            />
            <Text
              variant="label"
              color={typeFilter === filter.value ? "primaryForeground" : "foreground"}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: spacing.md }}
        className="gap-2"
      >
        {CATEGORY_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            onPress={() => setCategoryFilter(filter.value)}
            className={`px-3 py-1 rounded-full border ${
              categoryFilter === filter.value ? `bg-[${filter.color}]30` : ""
            }`}
            style={{
              borderColor: filter.color,
            }}
          >
            <Text variant="labelSmall" style={{ color: filter.color }}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Practice List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: spacing.base, paddingBottom: spacing["3xl"] }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        {practices && practices.length > 0 ? (
          <View className="flex-row flex-wrap gap-3">
            {practices.map((practice) => (
              <PressableCard
                key={practice.id}
                className="w-[48%] p-4"
                onPress={() => handlePracticePress(practice)}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="w-11 h-11 bg-accent/20 rounded-full items-center justify-center">
                    <Feather
                      name={PRACTICE_ICONS[practice.type] as any || "circle"}
                      size={24}
                      color={colors.accent}
                    />
                  </View>
                  <TouchableOpacity onPress={(e) => handleFavoriteToggle(practice.id, e)}>
                    <Feather
                      name="heart"
                      size={22}
                      color={isFavorited(practice.id) ? colors.coral : colors.mutedForeground}
                      fill={isFavorited(practice.id) ? colors.coral : "none"}
                    />
                  </TouchableOpacity>
                </View>
                <Text variant="labelLarge" color="foreground" numberOfLines={1} className="mb-1">
                  {practice.name}
                </Text>
                {practice.subtitle && (
                  <Text variant="caption" color="mutedForeground" numberOfLines={1} className="mb-2">
                    {practice.subtitle}
                  </Text>
                )}
                <View className="flex-row gap-1 mt-2">
                  <Badge variant="outline" size="sm">
                    {formatDuration(practice.durationSeconds)}
                  </Badge>
                  <Badge variant="secondary" size="sm">
                    {practice.category.replace("_", " ")}
                  </Badge>
                </View>
              </PressableCard>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center pt-24 gap-3">
            <Feather name="book-open" size={64} color={colors.mutedForeground} />
            <Text variant="h3" color="foreground" align="center">
              No Practices Found
            </Text>
            <Text variant="body" color="mutedForeground" align="center">
              Try adjusting your filters
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
