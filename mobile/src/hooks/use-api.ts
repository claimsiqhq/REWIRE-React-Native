import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

// ============ MOODS ============
export function useMoods() {
  return useQuery({
    queryKey: ["moods"],
    queryFn: async () => {
      const response = await apiClient.get("/api/moods");
      if (!response.ok) throw new Error("Failed to fetch moods");
      return response.json();
    },
  });
}

export function useCreateMood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      mood: string;
      energyLevel: number;
      stressLevel: number;
      notes?: string;
    }) => {
      const response = await apiClient.post("/api/moods", data);
      if (!response.ok) throw new Error("Failed to create mood");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
    },
  });
}

export function useUpdateMood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: number;
      mood?: string;
      energyLevel?: number;
      stressLevel?: number;
      notes?: string;
    }) => {
      const response = await apiClient.patch(`/api/moods/${id}`, data);
      if (!response.ok) throw new Error("Failed to update mood");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
    },
  });
}

// ============ HABITS ============
export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const response = await apiClient.get("/api/habits");
      if (!response.ok) throw new Error("Failed to fetch habits");
      return response.json();
    },
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      frequency?: string;
      color?: string;
    }) => {
      const response = await apiClient.post("/api/habits", data);
      if (!response.ok) throw new Error("Failed to create habit");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useHabitCompletions() {
  return useQuery({
    queryKey: ["habit-completions"],
    queryFn: async () => {
      const response = await apiClient.get("/api/habit-completions");
      if (!response.ok) throw new Error("Failed to fetch completions");
      return response.json();
    },
  });
}

export function useCompleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (habitId: number) => {
      const response = await apiClient.post(`/api/habits/${habitId}/complete`, {});
      if (!response.ok) throw new Error("Failed to complete habit");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-completions"] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

// ============ JOURNAL ============
export function useJournalEntries() {
  return useQuery({
    queryKey: ["journal-entries"],
    queryFn: async () => {
      const response = await apiClient.get("/api/journal");
      if (!response.ok) throw new Error("Failed to fetch journal entries");
      return response.json();
    },
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      content: string;
      entryType?: string;
      promptId?: number;
    }) => {
      const response = await apiClient.post("/api/journal", data);
      if (!response.ok) throw new Error("Failed to create entry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

// ============ PRACTICES ============
export function usePractices() {
  return useQuery({
    queryKey: ["practices"],
    queryFn: async () => {
      const response = await apiClient.get("/api/practices");
      if (!response.ok) throw new Error("Failed to fetch practices");
      return response.json();
    },
  });
}

export function usePracticeFavorites() {
  return useQuery({
    queryKey: ["practice-favorites"],
    queryFn: async () => {
      const response = await apiClient.get("/api/practice-favorites");
      if (!response.ok) throw new Error("Failed to fetch favorites");
      return response.json();
    },
  });
}

export function useTogglePracticeFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (practiceId: number) => {
      const response = await apiClient.post(`/api/practices/${practiceId}/favorite`, {});
      if (!response.ok) throw new Error("Failed to toggle favorite");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice-favorites"] });
    },
  });
}

export function useCreatePracticeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      practiceId: number;
      durationMinutes: number;
      moodBefore?: string;
      moodAfter?: string;
    }) => {
      const response = await apiClient.post("/api/practice-sessions", data);
      if (!response.ok) throw new Error("Failed to create session");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

// ============ GAMIFICATION ============
export function useGamification() {
  return useQuery({
    queryKey: ["gamification"],
    queryFn: async () => {
      const response = await apiClient.get("/api/gamification");
      if (!response.ok) throw new Error("Failed to fetch gamification");
      return response.json();
    },
  });
}

// ============ DAILY QUOTE ============
export function useDailyQuote() {
  return useQuery({
    queryKey: ["daily-quote"],
    queryFn: async () => {
      const response = await apiClient.get("/api/daily-quote");
      if (!response.ok) throw new Error("Failed to fetch quote");
      return response.json();
    },
  });
}

// ============ CHALLENGES ============
export function useChallenges() {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const response = await apiClient.get("/api/challenges");
      if (!response.ok) throw new Error("Failed to fetch challenges");
      return response.json();
    },
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (challengeId: number) => {
      const response = await apiClient.post(`/api/challenges/${challengeId}/join`, {});
      if (!response.ok) throw new Error("Failed to join challenge");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

// ============ EVENTS ============
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await apiClient.get("/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });
}

// ============ AI CONVERSATIONS ============
export function useAIConversations() {
  return useQuery({
    queryKey: ["ai-conversations"],
    queryFn: async () => {
      const response = await apiClient.get("/api/ai/conversations");
      if (!response.ok) throw new Error("Failed to fetch conversations");
      return response.json();
    },
  });
}

export function useSendAIMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { message: string; conversationId?: number }) => {
      const response = await apiClient.post("/api/ai/message", data);
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
  });
}
