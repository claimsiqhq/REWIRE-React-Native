import { useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  useJournalEntries,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
} from "@/src/hooks/use-api";
import { spacing } from "@/src/theme";
import { Text, Input, TextArea, Button, Card } from "@/src/components/ui";

export default function JournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: entries } = useJournalEntries();
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const existingEntry = id ? entries?.find((e) => e.id === id) : null;

  const [title, setTitle] = useState(existingEntry?.title || "");
  const [content, setContent] = useState(existingEntry?.content || "");

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title || "");
      setContent(existingEntry.content || "");
    }
  }, [existingEntry]);

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please write something in your journal entry");
      return;
    }

    try {
      if (id) {
        await updateEntry.mutateAsync({ id, title: title.trim() || undefined, content: content.trim() });
      } else {
        await createEntry.mutateAsync({ title: title.trim() || undefined, content: content.trim() });
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save entry");
    }
  };

  const handleDelete = () => {
    if (!id) return;

    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEntry.mutateAsync(id);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete entry");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: spacing.base, paddingBottom: spacing.xl * 2 }}
          showsVerticalScrollIndicator={false}
        >
          <Card className="p-5">
            <Input
              label="Title (Optional)"
              placeholder="Entry title..."
              value={title}
              onChangeText={setTitle}
              className="mb-4"
            />

            <TextArea
              label="Content"
              placeholder="Write your thoughts..."
              value={content}
              onChangeText={setContent}
              rows={12}
              className="mb-4"
            />

            <View className="gap-3 mt-5">
              <Button
                variant="default"
                onPress={handleSave}
                loading={createEntry.isPending || updateEntry.isPending}
                fullWidth
              >
                {id ? "Update Entry" : "Save Entry"}
              </Button>

              {id && (
                <Button
                  variant="destructive"
                  onPress={handleDelete}
                  loading={deleteEntry.isPending}
                  fullWidth
                >
                  Delete Entry
                </Button>
              )}
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
