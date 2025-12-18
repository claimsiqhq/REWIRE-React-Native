# Grounded Warriors - Men's Healing Retreat Companion

## Overview
Grounded Warriors is a holistic web application designed for men's healing and personal growth, catering to both individual clients (Warriors) and coaches (Guides). The platform integrates features like ground check tracking, daily habit management ("Daily Anchors"), reflective journaling with AI prompts ("Reflections"), breathing exercises ("Grounding Practice"), and an AI voice companion ("Coach Brian"). Its core purpose is to provide a comprehensive wellness experience focused on grounding, healing, and authentic masculine growth, using nature-focused language and metaphors. The application supports a white-labeling system via "App Profiles" to allow for branding and feature customization for different retreat organizations or programs.

## User Preferences
- **Voice & Tone**: Direct and grounded, warm without being soft, nature-focused (forest, fire, water, earth, roots, descent), speaks within a brotherhood context.
- **Terminology**:
    - Mood tracking → "Daily Ground Check"
    - Habits → "Daily Anchors"
    - Journaling → "Reflections"
    - Breathing exercises → "Grounding Practice"
    - Vent/Crisis → "Release"
    - Clients → "Warriors"
    - Coaches → "Guides"
- **Interaction**: The agent should focus on high-level features and architectural decisions, avoid granular implementation details unless specifically asked, and consolidate redundant information. The agent should prioritize brand guidelines (voice, tone, terminology, color palette, typography) in all interactions.

## System Architecture
The application follows a client-server architecture. The frontend is a React application (`client/`) and the backend is an Express.js application (`server/`). Shared code, including Drizzle ORM schema and Zod validators, resides in the `shared/` directory.

### UI/UX Decisions
- **Color Palette (Dark Forest Theme)**: `Night Forest` (`#0D1F17`), `Deep Pine` (`#1A3328`), `Forest Floor` (`#3D5A4C`), `Sage` (`#87A892`), `Birch` (`#D4C5A9`). These are customizable via App Profiles.
- **Typography**: Headings use Cormorant Garamond with letter-spacing 0.1-0.2em; body text uses Inter. These are also customizable via App Profiles.
- **Components**: Utilizes Radix UI and shadcn/ui for accessible UI components.
- **App Profile System**: Enables white-labeling and customization. Each profile can define `brandName`, `logoUrl`, `contactEmail`, `themeTokens` (color/font overrides), and `featureFlags` (to enable/disable specific features like `groundCheck`, `coachBrian`, `brotherhood`). Users are assigned to profiles, and the UI dynamically adapts based on the profile's settings.

### Technical Implementations
- **Frontend**: React 18 + TypeScript, Wouter for routing, TanStack Query for server state management, Tailwind CSS for styling.
- **Backend**: Express.js, PostgreSQL with Drizzle ORM for data persistence, Passport.js for email/password authentication.
- **Core Features**:
    - **Daily Ground Check**: Mood tracking.
    - **Daily Anchors**: User-defined habit tracking.
    - **Reflections**: Journaling with AI-generated prompts.
    - **Grounding Practice**: Breathing exercises.
    - **Coach Brian**: AI voice companion powered by OpenAI.
    - **Brotherhood Dashboard**: For Guides to manage Warriors.
    - **Admin Panel**: For superadmins to manage App Profiles and users.
- **Database Schema**: Key tables include `users`, `moods`, `habits`, `journal_entries`, `app_profiles`, `coach_clients`, and more, all defined using Drizzle ORM.
- **User Roles**: `client` (Warrior), `coach` (Guide), `superadmin`.

## External Dependencies
- **Database**: PostgreSQL (managed by Drizzle ORM)
- **AI**: OpenAI API (GPT-4o-mini for Coach Brian conversations and prompts, TTS-1 for text-to-speech)
- **Email Service**: SendGrid (for transactional emails: welcome, invites, reminders, session bookings)
- **Authentication**: Passport.js (local strategy)
- **Optional Integrations**:
    - Google Calendar (for scheduling)
    - Google Mail (for email interactions)