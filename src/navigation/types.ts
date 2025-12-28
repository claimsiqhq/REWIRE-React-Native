import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack
export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  PracticeDetail: { practiceId: string };
  ChallengeDetail: { challengeId: string };
  EventDetail: { eventId: string };
  JournalEntry: { entryId?: string };
  Settings: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Focus: { practiceId?: string };
  Journal: undefined;
  Coach: undefined;
  Profile: undefined;
};

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Declare global types for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
