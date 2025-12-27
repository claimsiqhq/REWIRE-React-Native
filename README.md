# REWIRE with Brian Coones

A men's personal transformation coaching platform focused on mindset development and personal growth.

## Features

- **Daily Ground Check** - Track your mood, energy, and stress levels with personalized insights
- **Daily Anchors** - Build habits connected to your personal goals
- **Reflections** - AI-powered journaling with guided prompts
- **Grounding Practice** - Breathing exercises and meditation library
- **Coach Brian** - AI voice companion for regulate/reframe/reset quick actions
- **Metrics Dashboard** - Weekly scorecards and progress tracking
- **Events Hub** - Event listings with VIP access and recordings

## Quick Start (Remix Setup)

### 1. Create Database

1. In the Replit sidebar, click on "Database"
2. Select "PostgreSQL"
3. Click "Create Database"

This automatically populates the `DATABASE_URL` and PostgreSQL environment variables.

### 2. Configure Secrets

Go to the "Secrets" tab in Replit and add:

| Secret | Description | Required |
|--------|-------------|----------|
| `SESSION_SECRET` | Random 32+ character string for session encryption | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key for AI features | Yes |
| `SENDGRID_API_KEY` | SendGrid API key for emails | Yes |

### 3. Configure Environment Variables

In the "Secrets" tab, add these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `SENDGRID_FROM_EMAIL` | Verified sender email | `info@yourdomain.com` |

### 4. Push Database Schema

Run the following command in the Shell:

```bash
npm run db:push
```

This creates all required database tables.

### 5. Seed Default Data (Optional)

The application automatically seeds:
- 9 default breathing/meditation practices
- Sample events for the Events Hub

### 6. Create Admin User

1. Start the app with `npm run dev`
2. Register a new account
3. In the Shell, run:

```bash
npx tsx scripts/make-admin.ts your@email.com
```

Or use SQL directly in the Database tab:
```sql
UPDATE users SET role = 'superadmin' WHERE email = 'your@email.com';
```

## User Roles

| Role | Description |
|------|-------------|
| `client` | Warriors - Personal transformation participants |
| `coach` | Guides - Coaches who manage Warriors |
| `superadmin` | Full admin access |

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + PostgreSQL + Drizzle ORM
- **AI**: OpenAI GPT-4o-mini + TTS-1
- **Email**: SendGrid

## Development

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Night Forest | `#1E1E2E` | Primary background |
| Deep Pine | `#272738` | Card backgrounds |
| Forest Floor | `#3A3A4A` | Borders, accents |
| Sage | `#D0D2D2` | Secondary text |
| Birch | `#FBFBFB` | Primary text, highlights |

## Typography

- **Headings**: Poppins
- **Body**: Montserrat
