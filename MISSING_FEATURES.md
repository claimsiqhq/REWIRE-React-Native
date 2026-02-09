# Missing Features & Setup Requirements

## 🔴 Critical (App Won't Work Without These)

### 1. **API Configuration**
- **Status**: ❌ Not configured
- **Location**: `mobile/src/lib/api-client.ts`
- **Issue**: API_BASE_URL defaults to `"https://your-api-url.com"`
- **Fix Required**:
  ```typescript
  // Option 1: Set in app.json
  {
    "expo": {
      "extra": {
        "apiUrl": "http://localhost:3000" // or your production URL
      }
    }
  }
  
  // Option 2: Use environment variable
  // Create mobile/.env file:
  EXPO_PUBLIC_API_URL=http://localhost:3000
  ```
- **Action**: Configure the actual API server URL

### 2. **Authentication Session Handling**
- **Status**: ⚠️ Partially implemented
- **Location**: `mobile/src/lib/auth-context.tsx`
- **Issue**: Session token stored as string `"authenticated"` instead of actual token
- **Fix Required**: Update to store actual session token from server response
- **Current Code**:
  ```typescript
  await SecureStore.setItemAsync("session_token", "authenticated");
  ```
- **Should Be**: Extract token from response headers/cookies and store it

### 3. **App Icons & Splash Screens**
- **Status**: ❌ Missing assets
- **Location**: `mobile/assets/images/`
- **Required Files**:
  - `icon.png` (1024x1024) - App icon
  - `splash-icon.png` (1242x2436) - Splash screen
  - `adaptive-icon.png` (1024x1024) - Android adaptive icon
  - `favicon.png` (48x48) - Web favicon
- **Action**: Add app branding assets

---

## 🟡 Important (Features Partially Implemented)

### 4. **Missing API Hooks**
- **Status**: ⚠️ Some hooks are stubbed/missing
- **Location**: `mobile/src/hooks/use-api.ts`
- **Missing Hooks**:
  - `useUpdateUserProfile` - Update user profile
  - `useChallengeLeaderboard` - Challenge leaderboard
  - `useCoachClients` - Coach client management (currently mocked)
  - `useCoachInvites` - Coach invite management (currently mocked)
  - `useSendInvite` - Send coach invite (currently mocked)
  - `useAdminStats` - Admin statistics (currently mocked)
  - `useAdminUsers` - Admin user management
  - `useUpdateUserRole` - Update user roles

### 5. **Coach Dashboard Features**
- **Status**: ⚠️ UI exists but features are stubbed
- **Location**: `mobile/app/coach/dashboard.tsx`
- **Stubbed Features**:
  - Client detail view ("Coming Soon")
  - Assign homework ("Coming Soon")
  - Schedule session ("Coming Soon")
  - Group message ("Coming Soon")
- **Action**: Implement these features or connect to backend APIs

### 6. **Admin Panel Features**
- **Status**: ⚠️ UI exists but features are stubbed
- **Location**: `mobile/app/admin/panel.tsx`
- **Stubbed Features**:
  - User management ("Coming Soon")
  - Event management ("Coming Soon")
  - Challenge management ("Coming Soon")
  - Analytics dashboard ("Coming Soon")
  - Cache management ("Coming Soon")
  - Logs viewer ("Coming Soon")
- **Action**: Implement admin features or connect to backend APIs

### 7. **Settings Screen Features**
- **Status**: ⚠️ UI exists but features are stubbed
- **Location**: `mobile/app/(tabs)/settings.tsx`
- **Stubbed Features**: Most settings show "Coming Soon" alerts
- **Action**: Implement actual settings functionality

---

## 🟢 Nice to Have (Enhancements)

### 8. **Error Handling & Loading States**
- **Status**: ⚠️ Basic implementation
- **Issues**:
  - Some screens don't handle API errors gracefully
  - Network error messages could be more user-friendly
  - Loading states inconsistent across screens
- **Action**: Add comprehensive error boundaries and loading states

### 9. **Offline Support**
- **Status**: ❌ Not implemented
- **Action**: Add React Query offline support or cache management

### 10. **Push Notifications**
- **Status**: ❌ Not configured
- **Action**: Set up Expo Notifications for:
  - Challenge reminders
  - Event notifications
  - Coach messages
  - Habit reminders

### 11. **Deep Linking**
- **Status**: ⚠️ Partially configured
- **Location**: `mobile/app.json` has `scheme: "rewire"`
- **Action**: Implement deep link handlers for:
  - Challenge links
  - Event links
  - Practice links
  - Share functionality

### 12. **Image Upload**
- **Status**: ⚠️ expo-image-picker installed but not used
- **Action**: Implement image upload for:
  - Profile pictures
  - Journal entries
  - Vision board

### 13. **Audio Playback**
- **Status**: ⚠️ expo-av installed but not fully implemented
- **Action**: Implement audio playback for:
  - Practice audio guides
  - Event recordings
  - Coach voice messages

### 14. **Haptic Feedback**
- **Status**: ✅ Installed and partially used
- **Action**: Add haptic feedback to more interactions

---

## 📋 Configuration Checklist

### Environment Setup
- [ ] Create `mobile/.env` file with API URL
- [ ] Configure API base URL in `app.json` or `.env`
- [ ] Set up development server URL
- [ ] Set up production server URL

### Authentication
- [ ] Fix session token storage to use actual token
- [ ] Implement token refresh logic
- [ ] Add logout on token expiration
- [ ] Test authentication flow end-to-end

### Assets
- [ ] Add app icon (`icon.png`)
- [ ] Add splash screen (`splash-icon.png`)
- [ ] Add Android adaptive icons
- [ ] Add favicon for web

### Backend Integration
- [ ] Verify all API endpoints are available
- [ ] Test API authentication flow
- [ ] Verify CORS settings for mobile app
- [ ] Test session cookie handling

### Testing
- [ ] Test login/register flow
- [ ] Test all tab screens
- [ ] Test detail screens
- [ ] Test API data loading
- [ ] Test error scenarios

---

## 🚀 Quick Start Fixes

### 1. Fix API URL (5 minutes)
```bash
# Create mobile/.env
echo "EXPO_PUBLIC_API_URL=http://localhost:3000" > mobile/.env

# Or update app.json
# Add to expo.extra.apiUrl
```

### 2. Fix Authentication (10 minutes)
Update `mobile/src/lib/auth-context.tsx`:
```typescript
// In login function, extract token from response
const response = await apiClient.post("/api/login", { username, password });
if (response.ok) {
  const data = await response.json();
  const token = data.token || response.headers.get("set-cookie");
  await SecureStore.setItemAsync("session_token", token);
  // ...
}
```

### 3. Add Basic Assets (15 minutes)
- Create placeholder icons or use Expo's default
- Update `app.json` to reference assets

---

## 📊 Feature Completeness

| Category | Status | Completion |
|----------|--------|------------|
| **Core Screens** | ✅ Complete | 100% |
| **Navigation** | ✅ Complete | 100% |
| **UI Components** | ✅ Complete | 100% |
| **API Hooks** | ⚠️ Partial | 80% |
| **Authentication** | ⚠️ Needs Fix | 70% |
| **Settings** | ⚠️ Stubbed | 30% |
| **Admin Features** | ⚠️ Stubbed | 20% |
| **Coach Features** | ⚠️ Stubbed | 40% |
| **Assets** | ❌ Missing | 0% |
| **Error Handling** | ⚠️ Basic | 60% |

---

## 🎯 Priority Order

1. **Fix API URL** - App can't connect to backend
2. **Fix Authentication** - Users can't log in properly
3. **Add Assets** - App looks unprofessional without icons
4. **Implement Missing Hooks** - Features won't work without API calls
5. **Complete Stubbed Features** - Coach/Admin features need implementation
6. **Add Error Handling** - Better user experience
7. **Add Push Notifications** - Engagement features
8. **Add Offline Support** - Better UX when offline

---

## 📝 Notes

- Most screens are **fully functional** once API is configured
- The app structure is **complete** - just needs backend connection
- All UI components are **migrated and working**
- Navigation is **fully set up** with Expo Router
- The main blockers are **API configuration** and **authentication token handling**
