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
      title?: string;
      content: string;
      entryType?: string;
      promptId?: number;
      mood?: string;
    }) => {
      const response = await apiClient.post("/api/journal", data);
      if (!response.ok) throw new Error("Failed to create entry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      title?: string;
      content?: string;
      mood?: string | null;
    }) => {
      const response = await apiClient.patch(`/api/journal/${data.id}`, {
        title: data.title,
        content: data.content,
        mood: data.mood,
      });
      if (!response.ok) throw new Error("Failed to update entry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/api/journal/${id}`);
      if (!response.ok) throw new Error("Failed to delete entry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

// ============ PRACTICES ============
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

  const queryString = params.toString();
  const url = queryString ? `/api/practices?${queryString}` : "/api/practices";

  return useQuery({
    queryKey: ["practices", filters],
    queryFn: async () => {
      const response = await apiClient.get(url);
      if (!response.ok) throw new Error("Failed to fetch practices");
      return response.json();
    },
  });
}

export function usePractice(id: string) {
  return useQuery({
    queryKey: ["practices", id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/practices/${id}`);
      if (!response.ok) throw new Error("Failed to fetch practice");
      return response.json();
    },
    enabled: !!id,
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
    mutationFn: async (practiceId: string | number) => {
      const response = await apiClient.post(`/api/practices/${practiceId}/favorite`, {});
      if (!response.ok) throw new Error("Failed to toggle favorite");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice-favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export interface Favorite {
  id: string;
  userId: string;
  practiceId: string;
  createdAt: string;
}

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await apiClient.get("/api/favorites");
      if (!response.ok) throw new Error("Failed to fetch favorites");
      return response.json();
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (practiceId: string) => {
      const response = await apiClient.post(`/api/favorites/${practiceId}`, {});
      if (!response.ok) throw new Error("Failed to toggle favorite");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
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
export interface UserGamification {
  id: string;
  userId: string;
  totalXp: number;
  currentLevel: number;
  level?: number;
  xpToNextLevel: number;
  streakMultiplier: number;
  currentStreak?: number;
}

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

// ============ DASHBOARD STATS ============
export interface DashboardStats {
  totalMoodCheckins: number;
  totalJournalEntries: number;
  totalHabitsCompleted: number;
  currentStreak: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/api/stats/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      return response.json();
    },
  });
}

// ============ DAILY METRICS ============
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
  return useQuery({
    queryKey: ["metrics", "today"],
    queryFn: async () => {
      const response = await apiClient.get("/api/metrics/today");
      if (!response.ok) throw new Error("Failed to fetch today's metrics");
      return response.json();
    },
  });
}

export function useSaveMetrics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      moodScore?: number;
      energyScore?: number;
      stressScore?: number;
      sleepHours?: number;
      sleepQuality?: number;
      notes?: string;
    }) => {
      const response = await apiClient.post("/api/metrics", data);
      if (!response.ok) throw new Error("Failed to save metrics");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

export interface WeeklyMetrics {
  avgMood: number | null;
  avgEnergy: number | null;
  avgStress: number | null;
  avgSleepHours: number | null;
  totalEntries: number;
}

export function useWeeklyMetrics() {
  return useQuery({
    queryKey: ["metrics", "weekly"],
    queryFn: async () => {
      const response = await apiClient.get("/api/metrics/weekly");
      if (!response.ok) throw new Error("Failed to fetch weekly metrics");
      return response.json();
    },
  });
}

export interface Milestone {
  id: string;
  userId: string;
  milestoneType: string;
  achievedAt: string;
  description: string | null;
}

export function useMilestones() {
  return useQuery({
    queryKey: ["milestones"],
    queryFn: async () => {
      const response = await apiClient.get("/api/milestones");
      if (!response.ok) throw new Error("Failed to fetch milestones");
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

  const queryString = params.toString();
  const url = queryString ? `/api/challenges?${queryString}` : "/api/challenges";

  return useQuery({
    queryKey: ["challenges", filters],
    queryFn: async () => {
      const response = await apiClient.get(url);
      if (!response.ok) throw new Error("Failed to fetch challenges");
      return response.json();
    },
  });
}

export function useMyChallenge() {
  return useQuery({
    queryKey: ["challenges", "my"],
    queryFn: async () => {
      const response = await apiClient.get("/api/challenges/my/list");
      if (!response.ok) throw new Error("Failed to fetch my challenges");
      return response.json();
    },
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (challengeId: string) => {
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

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  event?: Event;
}

export function useEvents(filters?: { type?: string; upcoming?: boolean; hasRecording?: boolean }) {
  const params = new URLSearchParams();
  if (filters?.type) params.append("type", filters.type);
  if (filters?.upcoming) params.append("upcoming", "true");
  if (filters?.hasRecording) params.append("hasRecording", "true");

  const queryString = params.toString();
  const url = queryString ? `/api/events?${queryString}` : "/api/events";

  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const response = await apiClient.get(url);
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });
}

export function useMyEventRegistrations() {
  return useQuery({
    queryKey: ["events", "registrations"],
    queryFn: async () => {
      const response = await apiClient.get("/api/events/registrations");
      if (!response.ok) throw new Error("Failed to fetch registrations");
      return response.json();
    },
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await apiClient.post(`/api/events/${eventId}/register`, {});
      if (!response.ok) throw new Error("Failed to register for event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", "registrations"] });
    },
  });
}

// ============ AI CONVERSATIONS ============
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

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

export function useCoachChat() {
  return useMutation({
    mutationFn: async (data: { message: string; conversationHistory: ChatMessage[] }) => {
      const response = await apiClient.post("/api/coach/chat", data);
      if (!response.ok) throw new Error("Failed to send chat message");
      return response.json();
    },
  });
}

export function useQuickAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { actionType: "regulate" | "reframe" | "reset"; currentState?: string }) => {
      const response = await apiClient.post("/api/coach/quick-action", data);
      if (!response.ok) throw new Error("Failed to perform quick action");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "conversations"] });
    },
  });
}

// ============ USER PROFILE ============

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
      email?: string;
    }) => {
      const response = await apiClient.patch("/api/user/profile", data);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to update profile" }));
        throw new Error(error.error || "Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["api", "user"] });
    },
  });
}

// ============ COACH ============

export interface CoachClient {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
}

export function useCoachClients() {
  return useQuery({
    queryKey: ["coach", "clients"],
    queryFn: async () => {
      const response = await apiClient.get("/api/coach/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      return response.json() as Promise<CoachClient[]>;
    },
  });
}

export interface CoachInvite {
  id: string;
  coachId: string;
  code: string;
  inviteeEmail?: string;
  inviteeName?: string;
  status: "pending" | "accepted" | "expired";
  expiresAt?: string;
  createdAt: string;
}

export function useCoachInvites() {
  return useQuery({
    queryKey: ["coach", "invites"],
    queryFn: async () => {
      const response = await apiClient.get("/api/coach/invites");
      if (!response.ok) throw new Error("Failed to fetch invites");
      return response.json() as Promise<CoachInvite[]>;
    },
  });
}

export function useCreateCoachInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email?: string; name?: string }) => {
      const response = await apiClient.post("/api/coach/invite", data);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to create invite" }));
        throw new Error(error.error || "Failed to create invite");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coach", "invites"] });
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["coach", "notifications", "unread-count"],
    queryFn: async () => {
      const response = await apiClient.get("/api/coach/notifications/unread-count");
      if (!response.ok) throw new Error("Failed to fetch notification count");
      return response.json() as Promise<{ count: number }>;
    },
  });
}

export function useChallengeLeaderboard(challengeId: string) {
  return useQuery({
    queryKey: ["challenges", challengeId, "leaderboard"],
    queryFn: async () => {
      const response = await apiClient.get(`/api/challenges/${challengeId}/leaderboard`);
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
    enabled: !!challengeId,
  });
}

// ============ ADMIN ============

export interface AdminStats {
  totalUsers: number;
  totalCoaches: number;
  totalClients: number;
  activeToday: number;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      // Note: This endpoint may need to be created on the backend
      // For now, we'll calculate from users endpoint
      const response = await apiClient.get("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch admin stats");
      const users = await response.json();
      
      // Calculate stats from users array
      const stats: AdminStats = {
        totalUsers: users.length || 0,
        totalCoaches: users.filter((u: any) => u.role === "coach" || u.role === "admin").length || 0,
        totalClients: users.filter((u: any) => u.role === "client").length || 0,
        activeToday: 0, // Would need separate endpoint for this
      };
      
      return stats;
    },
  });
}

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: "client" | "coach" | "admin" | "superadmin";
  createdAt: string;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const response = await apiClient.get("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json() as Promise<AdminUser[]>;
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "client" | "coach" | "admin" | "superadmin" }) => {
      const response = await apiClient.patch(`/api/admin/users/${userId}/role`, { role });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to update role" }));
        throw new Error(error.error || "Failed to update role");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
