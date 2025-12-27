import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCreateMood, useUpdateMood } from "../hooks/use-api";
import * as Haptics from "expo-haptics";

interface MoodCheckInProps {
  visible: boolean;
  onClose: () => void;
  existingMood?: {
    id: number;
    mood: string;
    energyLevel: number;
    stressLevel: number;
    notes?: string;
  };
  onComplete: () => void;
}

const MOODS = [
  { value: "great", label: "Great", emoji: "😄", color: "#4A7C59" },
  { value: "good", label: "Good", emoji: "🙂", color: "#8FBC8B" },
  { value: "okay", label: "Okay", emoji: "😐", color: "#F5DEB3" },
  { value: "low", label: "Low", emoji: "😔", color: "#DAA520" },
  { value: "rough", label: "Rough", emoji: "😢", color: "#CD5C5C" },
];

export function MoodCheckIn({ visible, onClose, existingMood, onComplete }: MoodCheckInProps) {
  const [mood, setMood] = useState(existingMood?.mood || "");
  const [energyLevel, setEnergyLevel] = useState(existingMood?.energyLevel || 5);
  const [stressLevel, setStressLevel] = useState(existingMood?.stressLevel || 5);
  const [notes, setNotes] = useState(existingMood?.notes || "");
  const [step, setStep] = useState(1);

  const createMood = useCreateMood();
  const updateMood = useUpdateMood();

  useEffect(() => {
    if (existingMood) {
      setMood(existingMood.mood);
      setEnergyLevel(existingMood.energyLevel);
      setStressLevel(existingMood.stressLevel);
      setNotes(existingMood.notes || "");
    } else {
      setMood("");
      setEnergyLevel(5);
      setStressLevel(5);
      setNotes("");
    }
    setStep(1);
  }, [existingMood, visible]);

  const handleSelectMood = (selectedMood: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMood(selectedMood);
    setStep(2);
  };

  const handleSubmit = async () => {
    try {
      if (existingMood) {
        await updateMood.mutateAsync({
          id: existingMood.id,
          mood,
          energyLevel,
          stressLevel,
          notes,
        });
      } else {
        await createMood.mutateAsync({
          mood,
          energyLevel,
          stressLevel,
          notes,
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    } catch (error) {
      console.error("Failed to save mood:", error);
    }
  };

  const isPending = createMood.isPending || updateMood.isPending;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-4 border-b border-border">
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="#A0A0A0" />
          </TouchableOpacity>
          <Text className="text-foreground text-lg font-semibold">Ground Check</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
          {step === 1 && (
            <View>
              <Text className="text-foreground text-2xl font-bold text-center mb-2">
                How are you feeling?
              </Text>
              <Text className="text-muted-foreground text-center mb-8">
                Take a moment to check in with yourself
              </Text>

              <View className="space-y-3">
                {MOODS.map((moodOption) => (
                  <TouchableOpacity
                    key={moodOption.value}
                    className={`flex-row items-center p-4 rounded-2xl border ${
                      mood === moodOption.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    }`}
                    onPress={() => handleSelectMood(moodOption.value)}
                  >
                    <Text className="text-3xl mr-4">{moodOption.emoji}</Text>
                    <View className="flex-1">
                      <Text className="text-foreground text-lg font-medium">
                        {moodOption.label}
                      </Text>
                    </View>
                    {mood === moodOption.value && (
                      <Feather name="check-circle" size={24} color="#4A7C59" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text className="text-foreground text-2xl font-bold text-center mb-8">
                Energy & Stress Levels
              </Text>

              {/* Energy Level */}
              <View className="mb-8">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-foreground font-medium">Energy Level</Text>
                  <Text className="text-primary font-bold">{energyLevel}/10</Text>
                </View>
                <View className="flex-row">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      className="flex-1 mx-0.5"
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setEnergyLevel(index + 1);
                      }}
                    >
                      <View
                        className={`h-10 rounded ${
                          index + 1 <= energyLevel ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-muted-foreground text-xs">Low</Text>
                  <Text className="text-muted-foreground text-xs">High</Text>
                </View>
              </View>

              {/* Stress Level */}
              <View className="mb-8">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-foreground font-medium">Stress Level</Text>
                  <Text className="text-orange-500 font-bold">{stressLevel}/10</Text>
                </View>
                <View className="flex-row">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      className="flex-1 mx-0.5"
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setStressLevel(index + 1);
                      }}
                    >
                      <View
                        className={`h-10 rounded ${
                          index + 1 <= stressLevel ? "bg-orange-500" : "bg-muted"
                        }`}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-muted-foreground text-xs">Low</Text>
                  <Text className="text-muted-foreground text-xs">High</Text>
                </View>
              </View>

              {/* Notes */}
              <View>
                <Text className="text-foreground font-medium mb-3">
                  Any notes? (optional)
                </Text>
                <TextInput
                  className="bg-card border border-border rounded-xl px-4 py-3 text-foreground min-h-[100px]"
                  placeholder="How are you feeling today?"
                  placeholderTextColor="#A0A0A0"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View className="px-5 pb-8 pt-4 border-t border-border">
          {step === 1 ? (
            <TouchableOpacity
              className={`bg-primary rounded-xl py-4 ${!mood ? "opacity-50" : ""}`}
              disabled={!mood}
              onPress={() => setStep(2)}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Continue
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-card border border-border rounded-xl py-4"
                onPress={() => setStep(1)}
              >
                <Text className="text-foreground text-center font-medium">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 bg-primary rounded-xl py-4 ${isPending ? "opacity-70" : ""}`}
                onPress={handleSubmit}
                disabled={isPending}
              >
                <Text className="text-white text-center font-semibold">
                  {isPending ? "Saving..." : existingMood ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
