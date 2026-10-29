# Kata • 習慣 — Anime-Inspired Personal Command Center

> **“Discipline is not a spreadsheet; it is an art form.”**  
> A clean, minimalist, game-like habit tracker and time-block command center built for high focus and personal mastery.

![Kata Banner](/icon.svg)

---

## 🌸 Design Language & Philosophy

- **Dark, Calm Aesthetic**: Deep navy and charcoal backgrounds (`#0a0d14`, `#121722`), soft frosted glass cards (`backdrop-blur-md`), and generous breathing room.
- **Anime-Inspired Touches**: Soft gradient glows (cyan, coral, amber, indigo, mint), floating sakura petal particles (toggleable), Japanese typography (*Zen Maru Gothic* + *Inter* + *JetBrains Mono*), and kanji accents (`型`, `習慣`, `継続`, `鍛錬`, `集中`, `神域`).
- **60fps Fluid Motion**: Checkmarks that pop with crystal chimes and light bursts, sweeping progress rings, surging XP bars, and confetti showers on milestones.
- **Local-First & Offline Ready**: 100% functional with zero internet connection or account required. Includes full JSON export/import and optional Supabase cloud sync.
- **PWA Ready**: Installable as a Progressive Web App on desktop, iOS, and Android.

---

## 🥋 Core Features & Modules

### 1. 司令部 • Dashboard (Command Center)
- **Hero Card**: Today’s completion %, level, rank title (`Rookie 鍛錬生` → `Wanderer 放浪者` → `Adept 熟練者` → `Sage 賢者` → `Legend 伝説`), Surge XP bar, and active streak with dynamic performance status titles (`Transcendent Flow • 神域の極み`, `Ascending Spirit`, etc.).
- **Interactive Anime Mascot (Kata-chan)**: Companion avatar whose expression and animated aura dynamically reflect your day’s adherence (from peaceful meditation to blazing transcendent fire). Click to interact!
- **Three Fluid Progress Rings**:
  1. *Monthly Progress*: Total monthly completion volume vs. combined monthly goals.
  2. *Normalized Progress*: Weighted score across today's active scheduled habits.
  3. *3-Day Momentum*: Rolling average velocity across the last 3 days.
- **Daily Completion Trajectory**: Glowing neon line and area chart tracking completion volume across the last 14 days with interactive date inspection.
- **Daily Trials & Combos**: Daily generated quests awarding bonus XP with combo multipliers (up to 2.0x).
- **Tappable Habit Cards**: Large interactive cards with category badges, monthly goal trackers, and light burst checkmarks.

### 2. 月間 • Monthly Tracker (Interactive Matrix)
- Not an Excel table — an interactive matrix (habits × days).
- Rounded interactive cells that toggle completions on click.
- Current day highlighted with neon ring; weekends subtly tinted.
- Per-habit monthly goals with fluid progress bars.
- Bottom mini bar chart visualizing day-by-day completion density across the whole month.
- Month stepper with automated calendar calculation.

### 3. 週間 • Weekly Planner with Voltron Sprint
- Mon–Sun time-block timetable preloaded with default schedule:
  - Classes & Uni Lectures
  - Lunch & Malayalam Break
  - Workout / Physical Reset
  - **⚡ 2-Hour Voltron Sprint (16:00–18:00)**
  - Dinner & Social Time
  - Uni Review & Planning
- **Voltron Sprint Chamber**:
  - Each sprint block is linked to a habit (*Code/Art/Animation*, *Guitar + FL Studio*, *Writing*, *Video Editing*, *Creative Sandbox / Minecraft Mods*).
  - Built-in 2-hour focus countdown timer with pause/resume, sound cues, and early finish option.
  - Automatically checks off the linked habit for today and grants **+150 bonus XP**!
- **Live "Current Block" Indicator**: Real-time clock detection highlights whatever block is happening *right now* with an electric neon border.
- Full schedule editor: add, edit, or remove time blocks.

### 4. 洞察 • Insights & Analytics
- **Annual Discipline Heatmap**: 52-week GitHub-style contribution grid with 5 levels of glowing anime color intensity and day tooltips.
- **Apex & Focus Habits**: Best and worst habits ranked by completion consistency.
- **Weekday Rhythm**: Bar chart showing completions grouped by day of the week to reveal your peak performance days.
- **Discipline Milestones**: Total completions, active days, current streak, and longest continuous streak.

### 5. 勲章 • Hall of Badges
- Unlockable anime badges with rarities (*Common*, *Rare*, *Epic*, *Legendary*):
  - *First Step • 一歩目*
  - *Iron Will • 鋼の七日* (7-day streak)
  - *Way of the Master • 達人の道* (30-day streak)
  - *Century Club • 百錬成鋼* (100 completions)
  - *Total Victory • 完勝の日* (100% daily completion)
  - *Conqueror of Time • 覇王の週* (7 perfect days in a row)
  - *Deep Sprint Sage • 集中極意* (5 Voltron sprints completed)
  - *Night Hunter • 宵月* (Sleep before 11:30 discipline)
  - *Golden Discipline • 蓄財* (Budget & savings master)

### 6. 日誌 • Daily Journal & Ledger
- **Mental State & Frequency**: 6 anime moods (*Zen*, *Energized*, *Focused*, *Calm*, *Inspired*, *Fatigued*).
- **One-Line Reflection**: Quick daily note recorded and displayed in the timeline.
- **Expense & Savings Forge**:
  - Daily "amount spent" tracker with monthly outflow total.
  - Monthly savings target card (e.g. "$10 to savings" target $300/mo) with fluid progress bar.

### 7. 習慣管理 • Habit Manager
- Add, edit, reorder (move up/down), archive, and recolor habits.
- Customizable fields: Name, category (*Mind*, *Body*, *Craft*, *Lifestyle*, *Finance*), Lucide icon picker, neon color palette, monthly target days, active days of week, and optional link to a Voltron sprint slot.

### 8. 設定 • Settings & Separable Cloud Sync
- Interface theme toggle (Dark / Light).
- Web Audio API synthesizer toggle (zero latency crystal chimes & level-up fanfares).
- Floating sakura petal atmosphere toggle.
- PWA / Browser notification prompt & reminders.
- **JSON Backup Export & Import**: Save or restore complete state anytime.
- **Reset Seed Data**: Instant restore of the default Kata sample habits & timetable.
- **Optional Supabase Sync**: Enter your own Supabase project URL and anon key to enable Google / Email login and multi-device sync, cleanly decoupled from local-first storage.

---

## ⚡ Quick Start & Setup

Kata comes complete with a self-contained portable Node.js toolchain, requiring **zero global installs**.

### 1. Launch with One Click
- **Windows**: Double-click `run.bat` or execute `./run.ps1` in PowerShell.
- The local Vite development server will start automatically at **http://localhost:5173**.

### 2. Manual Commands
If running manually with npm:
```powershell
# Set portable node in PATH (or use your own Node 18+)
$env:PATH = "$PWD\.tools\node-v20.18.0-win-x64;" + $env:PATH

# Start dev server
npm run dev

# Or build for production
npm run build
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `1` – `9` | Toggle habits #1 through #9 for the selected day |
| `Space` | Pause / Resume active Voltron Sprint timer (in Weekly Planner) |
| `Esc` | Close any open modal dialog |

---

## ⛩️ Preloaded Seed Habits & Schedule

1. **Animation** (*Craft, Coral #ff6b8b, goal: 20*) — Linked to Mon Voltron Sprint
2. **Japanese** (*Mind, Indigo #6366f1, goal: 25*)
3. **Read a book chapter** (*Mind, Amber #ffb300, goal: 22*) — Linked to Wed Voltron Sprint
4. **Declutter a space** (*Lifestyle, Mint #00e5a3, goal: 18*)
5. **Learn HTML** (*Craft, Cyan #00f2fe, goal: 16*)
6. **Learn Java** (*Craft, Light Indigo #818cf8, goal: 20*) — Linked to Sat Voltron Sprint
7. **Workout/Yoga** (*Body, Coral #f43f5e, goal: 20*)
8. **Journal** (*Mind, Purple #a855f7, goal: 26*)
9. **Bible** (*Mind, Gold #f59e0b, goal: 28*)
10. **Minecraft Mods** (*Craft, Emerald #10b981, goal: 14*) — Linked to Fri Voltron Sprint
11. **Sleep before 11:30** (*Body, Cyan #06b6d4, goal: 25*)
12. **Don’t spend more than daily budget** (*Finance, Amber #eab308, goal: 26*)
13. **Put $10 to savings** (*Finance, Mint #14b8a6, goal: 24*)

---

## 📂 Project Structure

```
Kata/
├── .tools/                     # Portable Node.js toolchain
├── public/
│   ├── icon.svg                # Neon Katana slash / Kata crest
│   ├── manifest.json           # PWA web manifest
│   └── sw.js                   # Service Worker for offline support
├── src/
│   ├── components/
│   │   ├── badges/             # Hall of Badges & rank display
│   │   ├── common/             # IconRenderer (Lucide wrapper)
│   │   ├── dashboard/          # HeroCard, Mascot, Rings, Charts, Quests, HabitCards
│   │   ├── insights/           # YearHeatmap, Apex/Focus habits, Weekday rhythm
│   │   ├── journal/            # Daily mood, reflection note, expenses & savings
│   │   ├── layout/             # Header, Navigation, Sakura, Toast, LevelUpModal
│   │   ├── manager/            # HabitManagerModal, HabitFormModal
│   │   ├── planner/            # WeeklyTimetable, VoltronSprintModal, BlockEditModal
│   │   ├── settings/           # SettingsModal & Supabase config
│   │   └── tracker/            # MonthlyGrid & day density chart
│   ├── store/
│   │   └── useKataStore.ts     # Centralized Zustand store with LocalStorage persistence
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── confetti.ts         # Anime particle & level-up burst engine
│   │   ├── dates.ts            # Date formatting, calendar math & streak calculators
│   │   ├── gamification.ts     # XP formulas, rank titles, daily trials, badge rules
│   │   ├── seeds.ts            # Preloaded habits, timetable & 28-day history logs
│   │   ├── sound.ts            # Web Audio API crystal chimes & fanfare synthesizer
│   │   ├── storage.ts          # JSON backup export and restore
│   │   └── supabase.ts         # Optional decoupled Supabase authentication & sync
│   ├── App.tsx                 # Root application container & keyboard listeners
│   ├── index.css               # Tailwind directives, frosted glass & particle styles
│   ├── main.tsx                # Application bootstrap
│   └── vite-env.d.ts           # Vite client environment types
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── run.bat                     # Quick Windows runner batch script
└── run.ps1                     # Quick PowerShell runner script
```
