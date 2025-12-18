# REWIRE with Brian Coones - Personal Transformation Platform

## Overview
REWIRE is a modern personal transformation platform designed for men's mindset development and personal growth, catering to both individual clients (Warriors) and coaches (Guides). The platform integrates features like ground check tracking, daily habit management ("Daily Anchors"), reflective journaling with AI prompts ("Reflections"), breathing exercises ("Grounding Practice"), and an AI voice companion ("Coach Brian"). Its core purpose is to provide a comprehensive coaching experience focused on transformation, mindset rewiring, and personal growth. The application uses a clean black/white aesthetic.

## User Preferences
- **Voice & Tone**: Direct and grounded, warm without being soft, solution-oriented while honoring the process.
- **Terminology**:
    - Mood tracking → "Daily Ground Check"
    - Habits → "Daily Anchors"
    - Journaling → "Reflections"
    - Breathing exercises → "Grounding Practice"
    - Vent/Crisis → "Release"
    - Clients → "Warriors"
    - Coaches → "Guides"
- **Interaction**: The agent should focus on high-level features and architectural decisions, avoid granular implementation details unless specifically asked, and consolidate redundant information.

## System Architecture
The application follows a client-server architecture. The frontend is a React application (`client/`) and the backend is an Express.js application (`server/`). Shared code, including Drizzle ORM schema and Zod validators, resides in the `shared/` directory.

### UI/UX Decisions
- **Color Palette (REWIRE Theme)**: `Night Forest` (`#1E1E2E`), `Deep Pine` (`#272738`), `Forest Floor` (`#3A3A4A`), `Sage` (`#D0D2D2`), `Birch` (`#FBFBFB`). Clean, minimal dark theme with neutral accents.
- **Typography**: Headings use Poppins; body text uses Montserrat.
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