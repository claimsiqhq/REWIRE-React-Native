# REWIRE with Brian Coones - Personal Transformation Platform

## Overview
REWIRE is a modern personal transformation platform designed for men's mindset development and personal growth, catering to both individual clients (Warriors) and coaches (Guides). The platform integrates features like ground check tracking with energy/stress levels, daily habit management ("Daily Anchors"), reflective journaling with AI prompts ("Reflections"), breathing exercises ("Grounding Practice"), and an AI voice companion ("Coach Brian"). Its core purpose is to provide a comprehensive coaching experience focused on transformation, mindset rewiring, and personal growth. The application uses a clean black/white aesthetic.

## User Preferences
- **Voice & Tone**: Direct and grounded, warm without being soft, solution-oriented while honoring the process.
- **Terminology**:
    - Mood tracking → "Daily Ground Check"
    - Habits → "Daily Anchors"
    - Journaling → "Reflections"
    - Breathing exercises → "Grounding Practice"
    - Clients → "Warriors"
    - Coaches → "Guides"
- **Interaction**: The agent should focus on high-level features and architectural decisions, avoid granular implementation details unless specifically asked, and consolidate redundant information.

## System Architecture
The application follows a client-server architecture. The frontend is a React application (`client/`) and the backend is an Express.js application (`server/`). Shared code, including Drizzle ORM schema and Zod validators, resides in the `shared/` directory.

### UI/UX Decisions
- **Color Palette (REWIRE Theme)**: `Night Forest` (`#1E1E2E`), `Deep Pine` (`#272738`), `Forest Floor` (`#3A3A4A`), `Sage` (`#D0D2D2`), `Birch` (`#FBFBFB`). Clean, minimal dark theme with neutral accents.
- **Typography**: Headings use Poppins; body text uses Montserrat.
- **Components**: Utilizes Radix UI and shadcn/ui for accessible UI components.
- **App Profile System**: Enables branding customization. Each profile can define `brandName`, `logoUrl`, `contactEmail`, `themeTokens` (color/font overrides), and `featureFlags` (to enable/disable specific features like `groundCheck`, `coachBrian`, `brotherhood`). Users are assigned to profiles, and the UI dynamically adapts based on the profile's settings.

### Technical Implementations
- **Frontend**: React 18 + TypeScript, Wouter for routing, TanStack Query for server state management, Tailwind CSS for styling.
- **Backend**: Express.js, PostgreSQL with Drizzle ORM for data persistence, Passport.js for email/password authentication.
- **Core Features**:
    - **Daily Ground Check**: Mood tracking with energy level (1-5) and stress level (1-5) sliders for personalized insights.
    - **Daily Anchors**: User-defined habit tracking connected to personal goals.
    - **Reflections**: Journaling with AI-generated prompts.
    - **Grounding Practice**: Breathing exercises and meditation library.
    - **Coach Brian**: AI voice companion powered by OpenAI for regulate/reframe/reset quick actions.
    - **Goals Progress**: Tracks user goals (energy, stress management, focus, sleep, emotional regulation) with progress calculated from mood trends and habit completion.
    - **Weekly Scorecard**: Consolidated metrics dashboard showing Mood, Energy, and Stress averages with trend charts.
    - **Events Hub**: Event listings with registration, VIP early access/pricing, and recordings library.
    - **Brotherhood Dashboard**: For Guides to manage Warriors.
    - **Admin Panel**: For superadmins to manage users and roles.
    - **Metrics**: Daily check-ins with energy, focus, sleep quality, and mood tracking. Weekly scorecards and milestone tracking.
- **Database Schema**: Key tables include `users`, `moods` (with energyLevel and stressLevel), `habits`, `journal_entries`, `app_profiles`, `coach_clients`, `events`, `event_registrations`, `user_goals`, `daily_metrics`, `weekly_scorecards`, and more.
- **User Roles**: `client` (Warrior), `coach` (Guide), `superadmin`.

## Recent Changes
- **Dec 2024**: Enhanced Daily Ground Check with energy/stress level tracking (1-5 sliders)
- **Dec 2024**: Added Goals Progress section to home page showing active goals with progress calculated from mood trends
- **Dec 2024**: Built Weekly Scorecard on stats page with Mood/Energy/Stress averages and dual-line trend charts
- **Dec 2024**: Enhanced Events Hub with Recordings tab for past events and VIP early access badges
- **Dec 2024**: Simplified admin panel to user/role management only
- **Dec 2024**: Removed deprecated features: Vision Board, Release (venting), Daily Quotes, Achievements/XP system

## External Dependencies
- **Database**: PostgreSQL (managed by Drizzle ORM)
- **AI**: OpenAI API (GPT-4o-mini for Coach Brian conversations and prompts, TTS-1 for text-to-speech)
- **Email Service**: SendGrid (for transactional emails: welcome, invites, reminders, session bookings)
- **Authentication**: Passport.js (local strategy)
- **Optional Integrations**:
    - Google Calendar (for scheduling)
    - Google Mail (for email interactions)

## Remix/Setup Instructions
See `README.md` for complete setup instructions. Key steps:
1. Create PostgreSQL database (auto-configures DATABASE_URL)
2. Add secrets: `SESSION_SECRET`, `OPENAI_API_KEY`, `SENDGRID_API_KEY`
3. Add env var: `SENDGRID_FROM_EMAIL`
4. Run `npm run db:push` to create tables
5. Register account and run `npx tsx scripts/make-admin.ts your@email.com`

Reference files: `.env.example` for all required environment variables.
