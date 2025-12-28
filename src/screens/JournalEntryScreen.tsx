import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { RootStackParamList } from '@/navigation/types';
import {
  useJournalEntries,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
} from '@/lib/api';
import { colors, spacing } from '@/theme';
import {
  Text,
  Input,
  TextArea,
  Button,
  Card,
} from '@/components/ui';

type JournalEntryRouteProp = RouteProp<RootStackParamList, 'JournalEntry'>;

export default function JournalEntryScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<JournalEntryRouteProp>();
  const navigation = useNavigation();
  const entryId = route.params?.entryId;

  const { data: entries } = useJournalEntries();
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const existingEntry = entryId ? entries?.find(e => e.id === entryId) : null;

  const [title, setTitle] = useState(existingEntry?.title || '');
  const [content, setContent] = useState(existingEntry?.content || '');

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title);
      setContent(existingEntry.content);
    }
  }, [existingEntry]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    try {
      if (entryId) {
        await updateEntry.mutateAsync({ id: entryId, title, content });
      } else {
        await createEntry.mutateAsync({ title, content });
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  const handleDelete = () => {
    if (!entryId) return;

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry.mutateAsync(entryId);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.form}>
          <Input
            label="Title"
            placeholder="Entry title..."
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.input}
          />

          <TextArea
            label="Content"
            placeholder="Write your thoughts..."
            value={content}
            onChangeText={setContent}
            rows={10}
            containerStyle={styles.input}
          />

          <View style={styles.buttons}>
            <Button
              variant="default"
              onPress={handleSave}
              loading={createEntry.isPending || updateEntry.isPending}
              fullWidth
            >
              {entryId ? 'Update Entry' : 'Save Entry'}
            </Button>

            {entryId && (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.base,
  },
  form: {
    padding: spacing.lg,
  },
  input: {
    marginBottom: spacing.base,
  },
  buttons: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
