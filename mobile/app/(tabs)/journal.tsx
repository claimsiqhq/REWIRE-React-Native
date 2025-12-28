import { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useJournalEntries, useCreateJournalEntry } from "@/src/hooks/use-api";
import { format, parseISO } from "date-fns";

export default function JournalScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntryContent, setNewEntryContent] = useState("");

  const { data: entries, refetch } = useJournalEntries();
  const createEntry = useCreateJournalEntry();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleCreateEntry = async () => {
    if (!newEntryContent.trim()) return;

    try {
      await createEntry.mutateAsync({
        content: newEntryContent,
        entryType: "free",
      });
      setNewEntryContent("");
      setShowNewEntry(false);
      refetch();
    } catch (error) {
      console.error("Failed to create entry:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4 flex-row items-center justify-between">
        <Text className="text-foreground text-2xl font-bold">Journal</Text>
        <TouchableOpacity
          className="bg-primary w-10 h-10 rounded-full items-center justify-center"
          onPress={() => setShowNewEntry(true)}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* New Entry Card */}
      {showNewEntry && (
        <View className="mx-5 mb-4 bg-card rounded-2xl p-4 border border-border">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground font-semibold">New Entry</Text>
            <TouchableOpacity onPress={() => setShowNewEntry(false)}>
              <Feather name="x" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          </View>
          <TextInput
            className="bg-background border border-border rounded-xl px-4 py-3 text-foreground min-h-[120px]"
            placeholder="What's on your mind?"
            placeholderTextColor="#A0A0A0"
            value={newEntryContent}
            onChangeText={setNewEntryContent}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity
            className={`bg-primary rounded-xl py-3 mt-4 ${createEntry.isPending ? "opacity-70" : ""}`}
            onPress={handleCreateEntry}
            disabled={createEntry.isPending}
          >
            <Text className="text-white text-center font-semibold">Save Entry</Text>
          </TouchableOpacity>
        </View>
      )}

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
        {/* Prompt Cards */}
        <View className="px-5 mb-6">
          <Text className="text-muted-foreground text-sm font-medium mb-3">PROMPTS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity className="bg-secondary rounded-xl p-4 mr-3 w-40">
              <Feather name="sun" size={24} color="#8FBC8B" />
              <Text className="text-foreground font-medium mt-2">Morning Reflection</Text>
              <Text className="text-muted-foreground text-sm mt-1">
                Set intentions for today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-secondary rounded-xl p-4 mr-3 w-40">
              <Feather name="heart" size={24} color="#8FBC8B" />
              <Text className="text-foreground font-medium mt-2">Gratitude</Text>
              <Text className="text-muted-foreground text-sm mt-1">
                What are you thankful for?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-secondary rounded-xl p-4 mr-3 w-40">
              <Feather name="moon" size={24} color="#8FBC8B" />
              <Text className="text-foreground font-medium mt-2">Evening Review</Text>
              <Text className="text-muted-foreground text-sm mt-1">
                Reflect on your day
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Journal Entries */}
        <View className="px-5 mb-6">
          <Text className="text-muted-foreground text-sm font-medium mb-3">RECENT ENTRIES</Text>

          {entries && entries.length > 0 ? (
            <View className="space-y-3">
              {entries.map((entry: any) => (
                <TouchableOpacity
                  key={entry.id}
                  className="bg-card rounded-2xl p-4 border border-border"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-muted-foreground text-sm">
                      {format(parseISO(entry.createdAt), "MMM d, yyyy • h:mm a")}
                    </Text>
                    {entry.entryType === "prompted" && (
                      <View className="bg-accent/20 px-2 py-1 rounded">
                        <Text className="text-accent text-xs">Prompted</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-foreground" numberOfLines={3}>
                    {entry.content}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="bg-card rounded-2xl p-6 border border-border items-center">
              <Feather name="book-open" size={40} color="#A0A0A0" />
              <Text className="text-foreground font-medium mt-3">No entries yet</Text>
              <Text className="text-muted-foreground text-center mt-1">
                Start journaling to track your thoughts and growth
              </Text>
              <TouchableOpacity
                className="bg-primary px-5 py-2.5 rounded-lg mt-4"
                onPress={() => setShowNewEntry(true)}
              >
                <Text className="text-white font-medium">Write First Entry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
