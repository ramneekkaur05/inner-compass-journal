# 🌟 Intelligent Journal - Premium Journaling Application

A production-ready, full-stack intelligent journaling application built with Next.js, React, TypeScript, and Supabase.

## ✨ Features

- **📝 Daily Journaling**: Mood tracking, gratitude, goals, and daily checklists with auto-save
- **🌟 Vision Board**: Visualize your dreams with images and affirmations
- **✉️ Future Letters**: Write letters to your future self with unlock dates
- **🎯 Goals & Progress**: Track your journey with real-time statistics
- **🌿 Guided Reflections**: Deep introspection with themed prompts
- **📊 Insights**: Visualize patterns with mood trends and completion charts
- **⚙️ Settings**: Personalize your experience with auto-saving preferences
- **🌻 Thought Letters**: Write and save thoughts as beautiful letter envelopes with philosophy quotes

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS with custom premium design + crumpled paper texture background
- **Backend**: Supabase (Auth, Database, Storage)
- **Charts**: Recharts
- **Animations**: Framer Motion (smooth transitions, letter folding animations, page transitions)
- **Date Handling**: date-fns
- **Typography**: Custom fonts (Playfair Display, Caveat, Merriweather)

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd "c:\Users\ramne\OneDrive\Desktop\flutter proj\journal"

# Install dependencies
npm install
```

### Step 2: Set Up Supabase

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**:
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Copy and paste the contents of `supabase-schema.sql`
   - Click **Run** to create all tables

3. **Set up Storage**:
   - Go to **Storage** in your Supabase dashboard
   - Create a new bucket called `vision-board`
   - Make it **public**
   - Add a policy to allow authenticated users to upload to their own folders

4. **Get your credentials**:
   - Go to **Settings** > **API**
   - Copy your `Project URL` and `anon/public` key

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Run the Application

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure

```
journal/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Today/Home page
│   ├── vision-board/page.tsx    # Vision Board
│   ├── identity/page.tsx        # Identity Shifting
│   ├── future-letters/page.tsx  # Future Letters
│   ├── goals/page.tsx           # Goals & Progress
│   ├── guided-reflections/      # Guided Reflections
│   ├── insights/page.tsx        # Insights & Charts
│   ├── settings/page.tsx        # Settings
│   ├── auth/                    # Authentication pages
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── journal/                 # Journal-specific components
│   ├── navigation/              # Navigation components
│   ├── ui/                      # UI components
│   └── UserNotRegisteredError.tsx
├── entities/                     # TypeScript type definitions
│   ├── JournalEntry.ts
│   ├── VisionBoardItem.ts
│   ├── IdentityStatement.ts
│   ├── FutureLetter.ts
│   ├── GuidedReflection.ts
│   └── UserProfile.ts
├── lib/                         # Utilities and helpers
│   ├── supabaseClient.ts        # Supabase client config
│   ├── auth.ts                  # Authentication functions
│   └── db.ts                    # Database operations
├── supabase-schema.sql          # Database schema
└── package.json
```

## 🎨 Key Features Explained

### Crumpled Paper Background
The app now features a realistic crumpled paper texture throughout all sections, giving it an authentic journal-like appearance. The background uses high-quality texture images for enhanced visual aesthetics.

### Thoughts & Ideas Section
- Write and store thoughts as beautiful sunflower-decorated letter envelopes 🌻
- Each thought displays with a random daily philosophy quote for inspiration
- Full-screen modal view for reading complete letters
- Smooth page-folding animation (150ms) when saving
- Letter history organized by date

### Auto-Save Functionality
All user input is automatically saved to Supabase with debouncing (800ms delay) to prevent excessive API calls. No "Save" buttons needed!

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes with automatic redirect
- Persistent sessions
- Row-Level Security (RLS) ensures users only see their own data

### Premium UI/UX
- Soft gradients and rounded corners
- Smooth animations and transitions
- Responsive design (desktop & mobile)
- Calm, journal-like aesthetic
- Loading states and error handling

### Data Persistence
- All data stored in Supabase PostgreSQL database
- Images stored in Supabase Storage
- Real-time auto-save on all forms
- Optimistic UI updates

## 📱 Pages Overview

| Page | Description |
|------|-------------|
| **Today** | Daily journal with mood, gratitude, goals, and checklist |
| **Thoughts** | Write and save thoughts as letter envelopes with daily philosophy quotes |
| **Vision Board** | Grid of vision items with images and affirmations by category |
| **Identity** | Four sections: Who I'm Becoming, Core Values, Beliefs, Habits |
| **Future Letters** | Write and lock letters to your future self |
| **Goals** | Progress tracking with stats and timeline |
| **Reflections** | Themed guided reflections (Release, Growth, etc.) |
| **Insights** | Charts showing mood trends and task completion |
| **Settings** | Profile customization and preferences |

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- User-scoped queries (users can only access their own data)
- Environment variables for sensitive credentials
- Supabase handles authentication tokens securely

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add these in your hosting platform:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 🛠️ Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 Database Schema

The app uses 6 main tables:
- `profiles` - User profiles and preferences
- `journal_entries` - Daily journal entries
- `vision_board_items` - Vision board cards
- `identity_statements` - Identity shifting statements
- `future_letters` - Letters to future self
- `guided_reflections` - Themed reflections

All tables have RLS policies and user_id foreign keys.

## 🎯 Core Philosophy

This app is designed to feel like a **premium digital journal** - calm, elegant, and focused on personal growth. Every interaction is intentional, with smooth animations and thoughtful UX that encourages daily reflection.

## 💡 Tips for Users

1. **Start with Today**: Log your mood and daily thoughts
2. **Capture Thoughts**: Write ideas and thoughts as letter envelopes - they'll inspire you with daily philosophy quotes
3. **Build Your Vision**: Add images and affirmations that inspire you
4. **Define Your Identity**: Write who you're becoming
5. **Write to Future You**: Lock letters for motivation
6. **Track Progress**: Check insights to see your patterns
7. **Reflect Deeply**: Use guided prompts weekly

## 🤝 Contributing

This is a personal journaling app template. Feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this project as a template for your own applications.

## 🙏 Credits

Built with modern web technologies:
- Next.js Team
- Supabase Team
- Tailwind CSS
- Recharts
- Framer Motion

---

**Built with ❤️ for mindful living and personal growth**
