# 🧠 StudyAI — AI-Powered Study Planner

A production-ready full-stack study planner built with **React**, **Supabase**, and the **Anthropic Claude API**.

---

## 📁 Project Structure

```
ai-study-planner/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthPage.jsx          # Login + Register page
│   │   │   ├── AuthPage.css
│   │   │   └── ProtectedRoute.jsx    # Route guard
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx         # Shell with sidebar + topbar
│   │   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   │   ├── Sidebar.css
│   │   │   ├── Topbar.jsx            # Top header bar
│   │   │   └── Topbar.css
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx         # Overview stats + today's tasks
│   │   │   └── Dashboard.css
│   │   ├── subjects/
│   │   │   ├── Subjects.jsx          # Add subjects + AI plan generation
│   │   │   └── Subjects.css
│   │   ├── tasks/
│   │   │   ├── Tasks.jsx             # Daily task list with date nav
│   │   │   └── Tasks.css
│   │   ├── calendar/
│   │   │   ├── CalendarPage.jsx      # Monthly calendar view
│   │   │   └── Calendar.css
│   │   └── progress/
│   │       ├── Progress.jsx          # Charts + per-subject progress
│   │       └── Progress.css
│   ├── hooks/
│   │   ├── useAuth.js                # Auth context + hook
│   │   └── useData.js                # Data fetching hooks
│   ├── lib/
│   │   ├── supabase.js               # Supabase client init
│   │   ├── api.js                    # All Supabase API calls
│   │   └── aiScheduler.js            # Claude AI schedule generator
│   ├── styles/
│   │   └── globals.css               # Design system + global styles
│   ├── App.js                        # Routes
│   └── index.js                      # Entry point
├── supabase/
│   └── schema.sql                    # Full DB schema + RLS policies
├── .env.example                      # Environment variable template
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

| Table        | Key Columns                                                          |
|--------------|----------------------------------------------------------------------|
| `subjects`   | id, user_id, name, color, exam_date, priority, total_hours_required  |
| `study_plans`| id, user_id, subject_id, start_date, end_date, daily_hours, ai_generated |
| `tasks`      | id, user_id, study_plan_id, subject_id, title, scheduled_date, status |
| `progress`   | id, user_id, subject_id, date, minutes_studied, tasks_completed      |

All tables use **Row Level Security (RLS)** — users only access their own data.

---

## ⚙️ Step-by-Step Setup in VS Code

### Step 1 — Clone / Create the project

```bash
# If you received this as a zip, extract it. Then:
cd ai-study-planner
```

### Step 2 — Install dependencies

```bash
npm install

### Step 3 — Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **New project**, give it a name (e.g. `study-planner`)
3. Choose a region close to you, set a database password= Krish9989#123 , click **Create project**
4. Wait ~1 minute for it to spin up

### Step 4 — Run the database schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **+ New query**
3. Open `supabase/schema.sql` from this project and **paste the entire contents**
4. Click **Run** (green button)
5. You should see "Success. No rows returned" for each statement

### Step 5 — Get your Supabase API keys

1. In Supabase dashboard → **Project Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** → looks like `https://xyzabcdef.supabase.co`
   - **anon / public key** → long JWT string

### Step 6 — Get your Anthropic API key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign in → **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`)

> ⚠️ **Note**: The AI schedule generation calls the Anthropic API directly from the browser.
> For production, wrap it in a backend/Edge Function to keep the key secret.

### Step 7 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Step 8 — Enable email auth in Supabase

1. Supabase dashboard → **Authentication** → **Providers**
2. **Email** should already be enabled
3. For development, go to **Authentication** → **Settings** and disable **"Confirm email"** (so you can sign up instantly without email verification)

### Step 9 — Start the development server

```bash
npm start
```

Your app will open at **http://localhost:3000**

---

## 🚀 Using the App

1. **Register** with your email and name
2. **Add a subject** (e.g., "Data Structures") with an exam date and priority
3. Click **Generate AI Schedule** — Claude will create a full daily study plan
4. Visit **Tasks** to see today's tasks, mark them complete
5. Use the **Calendar** to browse your entire schedule
6. Check **Progress** for charts and per-subject stats

---

## 🔒 Security Notes

| Concern | Status |
|---------|--------|
| Database RLS | ✅ Enabled — users only see their own data |
| Auth | ✅ Supabase JWT-based authentication |
| API key (Anthropic) | ⚠️ Exposed in browser for demo — use a proxy/Edge Function for production |

### Production-ready AI proxy (Supabase Edge Function)

```typescript
// supabase/functions/generate-schedule/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  const body = await req.json()
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY'),
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

Deploy with: `supabase functions deploy generate-schedule`

---

## 🛠️ VS Code Recommended Extensions

- **ESLint** — Code linting
- **Prettier** — Code formatting
- **ES7+ React/Redux/React-Native snippets** — React shortcuts
- **Supabase** — Supabase integration (optional)
- **GitLens** — Git history

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Supabase client |
| `react-router-dom` | Client-side routing |
| `recharts` | Progress charts |
| `date-fns` | Date utilities |
| `lucide-react` | Icons |

---

## 🎨 Design System

The app uses a custom dark theme with CSS variables defined in `src/styles/globals.css`:

- **Font**: Syne (headings) + DM Sans (body)
- **Primary**: `#4f8ef7` (blue)
- **Success**: `#22d3a0` (green)
- **Background**: `#0a0e1a` (deep navy)
- **Cards**: `#111827`

---

## 📝 License

MIT — free to use and modify.
