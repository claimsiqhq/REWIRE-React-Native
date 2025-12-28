import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// API base URL - configure for your environment
const API_BASE = Constants.expoConfig?.extra?.apiUrl || "http://localhost:5000/api";

// Token storage keys
const AUTH_TOKEN_KEY = 'rewire_auth_token';

// Get stored auth token
async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

// Set auth token
export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

// Clear auth token
export async function clearAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

// Fetch wrapper with auth
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      await clearAuthToken();
    }
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ============================================
// Auth Types
// ============================================

export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: 'client' | 'coach' | 'superadmin';
  accountTier: string | null;
  createdAt: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// Moods
// ============================================

export interface Mood {
  id: string;
  userId: string;
  mood: string;
  energyLevel: number | null;
  stressLevel: number | null;
  createdAt: string | null;
}

export function useMoods() {
  return useQuery<Mood[]>({
    queryKey: ["moods"],
    queryFn: () => fetchJSON<Mood[]>("/moods"),
  });
}

export function useTodayMood() {
  return useQuery<Mood | null>({
    queryKey: ["mood", "today"],
    queryFn: () => fetchJSON<Mood | null>("/moods/today"),
  });
}

export function useCreateMood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { mood: string; energyLevel?: number; stressLevel?: number }) =>
      fetchJSON<Mood>("/moods", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moods"] });
      queryClient.invalidateQueries({ queryKey: ["mood", "today"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

// ============================================
// Habits
// ============================================

export interface Habit {
  id: string;
  userId: string;
  label: string;
  createdAt: string | null;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export function useHabits() {
  return useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: () => fetchJSON<Habit[]>("/habits"),
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (label: string) =>
      fetchJSON<Habit>("/habits", {
        method: "POST",
        body: JSON.stringify({ label }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJSON<{ success: boolean }>(`/habits/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

export function useToggleHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ habitId, date, completed }: { habitId: string; date: string; completed: boolean }) =>
      fetchJSON<HabitCompletion>("/habits/completions", {
        method: "POST",
        body: JSON.stringify({ habitId, date, completed }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["habit-completions", variables.date] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useHabitCompletions(date: string) {
  return useQuery<HabitCompletion[]>({
    queryKey: ["habit-completions", date],
    queryFn: () => fetchJSON<HabitCompletion[]>(`/habits/completions/${date}`),
  });
}

// ============================================
// Journal
// ============================================

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export function useJournalEntries() {
  return useQuery<JournalEntry[]>({
    queryKey: ["journal"],
    queryFn: () => fetchJSON<JournalEntry[]>("/journal"),
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entry: { title: string; content: string; mood?: string }) =>
      fetchJSON<JournalEntry>("/journal", {
        method: "POST",
        body: JSON.stringify(entry),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; title?: string; content?: string; mood?: string | null }) =>
      fetchJSON<JournalEntry>(`/journal/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: data.title, content: data.content, mood: data.mood }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJSON<{ success: boolean }>(`/journal/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

// ============================================
// Stats & Dashboard
// ============================================

export interface DashboardStats {
  totalMoodCheckins: number;
  totalJournalEntries: number;
  totalHabitsCompleted: number;
  currentStreak: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["stats", "dashboard"],
    queryFn: () => fetchJSON<DashboardStats>("/stats/dashboard"),
  });
}

// ============================================
// Daily Metrics
// ============================================

export interface DailyMetrics {
  id: string;
  userId: string;
  date: string;
  moodScore: number | null;
  energyScore: number | null;
  stressScore: number | null;
  sleepHours: number | null;
  sleepQuality: number | null;
  notes: string | null;
}

export function useTodayMetrics() {
  return useQuery<DailyMetrics | null>({
    queryKey: ["metrics", "today"],
    queryFn: () => fetchJSON<DailyMetrics | null>("/metrics/today"),
  });
}

export function useSaveMetrics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      moodScore?: number;
      energyScore?: number;
      stressScore?: number;
      sleepHours?: number;
      sleepQuality?: number;
      notes?: string;
    }) =>
      fetchJSON<DailyMetrics>("/metrics", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

// ============================================
// Practices
// ============================================

export interface Practice {
  id: string;
  type: "breathing" | "meditation" | "body_scan";
  name: string;
  subtitle: string | null;
  description: string | null;
  category: "energizing" | "grounding" | "sleep" | "focus" | "stress_relief";
  durationSeconds: number;
  durationCategory: "short" | "medium" | "long" | null;
  iconName: string | null;
  colorGradient: string | null;
  phases: any;
  audioUrl: string | null;
  cycles: number | null;
  isPremium: boolean;
  isActive: boolean;
}

export function usePractices(filters?: { type?: string; category?: string; durationCategory?: string }) {
  const params = new URLSearchParams();
  if (filters?.type) params.append("type", filters.type);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.durationCategory) params.append("durationCategory", filters.durationCategory);

  return useQuery<Practice[]>({
    queryKey: ["practices", filters],
    queryFn: () => fetchJSON<Practice[]>(`/practices?${params.toString()}`),
  });
}

export function usePractice(id: string) {
  return useQuery<Practice>({
    queryKey: ["practices", id],
    queryFn: () => fetchJSON<Practice>(`/practices/${id}`),
    enabled: !!id,
  });
}

// ============================================
// Challenges
// ============================================

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  habitTemplate: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  challengeType: "public" | "private" | "coach";
  category: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  status: "active" | "completed" | "dropped";
  challenge?: Challenge;
}

export function useChallenges(filters?: { type?: string; category?: string; active?: boolean }) {
  const params = new URLSearchParams();
  if (filters?.type) params.append("type", filters.type);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.active !== undefined) params.append("active", String(filters.active));

  return useQuery<Challenge[]>({
    queryKey: ["challenges", filters],
    queryFn: () => fetchJSON<Challenge[]>(`/challenges?${params.toString()}`),
  });
}

export function useMyChallenge() {
  return useQuery<(ChallengeParticipant & { challenge: Challenge })[]>({
    queryKey: ["challenges", "my"],
    queryFn: () => fetchJSON<(ChallengeParticipant & { challenge: Challenge })[]>("/challenges/my/list"),
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId: string) =>
      fetchJSON<ChallengeParticipant>(`/challenges/${challengeId}/join`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

// ============================================
// Events
// ============================================

export interface Event {
  id: string;
  title: string;
  description: string | null;
  eventType: "retreat" | "webinar" | "masterclass" | "workshop" | "group_session";
  startTime: string;
  endTime: string | null;
  locationType: "virtual" | "in_person" | "hybrid";
  locationDetails: string | null;
  priceCents: number;
  imageUrl: string | null;
  recordingUrl: string | null;
  isPublished: boolean;
}

export function useEvents(filters?: { type?: string; upcoming?: boolean; hasRecording?: boolean }) {
  const params = new URLSearchParams();
  if (filters?.type) params.append("type", filters.type);
  if (filters?.upcoming) params.append("upcoming", "true");
  if (filters?.hasRecording) params.append("hasRecording", "true");

  return useQuery<Event[]>({
    queryKey: ["events", filters],
    queryFn: () => fetchJSON<Event[]>(`/events?${params.toString()}`),
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) =>
      fetchJSON<any>(`/events/${eventId}/register`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// ============================================
// Gamification
// ============================================

export interface UserGamification {
  id: string;
  userId: string;
  totalXp: number;
  currentLevel: number;
  xpToNextLevel: number;
  streakMultiplier: number;
}

export function useGamification() {
  return useQuery<UserGamification>({
    queryKey: ["gamification"],
    queryFn: () => fetchJSON<UserGamification>("/gamification"),
  });
}

// ============================================
// AI Coach
// ============================================

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function useCoachChat() {
  return useMutation({
    mutationFn: (data: { message: string; conversationHistory: ChatMessage[] }) =>
      fetchJSON<{ response: string }>("/coach/chat", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

export function useQuickAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { actionType: "regulate" | "reframe" | "reset"; currentState?: string }) =>
      fetchJSON<{ conversationId: string; actionType: string; response: string }>("/coach/quick-action", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "conversations"] });
    },
  });
}

// ============================================
// User Profile
// ============================================

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string; profileImageUrl?: string }) =>
      fetchJSON<User>("/user/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// Export API base for other uses
export { API_BASE };
