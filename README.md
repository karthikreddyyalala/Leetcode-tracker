# LC Tracker

A personal spaced repetition tracker for LeetCode problems. You log what you solve each day, and it tells you exactly when to review it again — no guessing, no forgetting.

The idea is simple: solving a problem once doesn't mean you've learned it. Reviewing it after 7 days, and again 7 days after that, actually makes it stick. This app handles the scheduling so you don't have to think about it.

---

## What it does

- **Log problems** — title, URL, difficulty, and the date you solved it
- **Daily queue** — shows every problem due for review today
- **Upcoming** — a look ahead at what's coming in the next few days, grouped by day
- **History** — searchable, filterable list of everything you've logged with total review counts
- **Streak tracking** — counts consecutive days with at least one solve
- **Cross-browser sync** — data lives in localStorage but syncs to Redis so it follows you across devices
- **Daily email reminder** — GitHub Actions runs a cron at 9am every day and fires an API call to send you an email if anything is due

---

## Stack

| Layer | Tool |
|---|---|
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Icons | Phosphor Icons |
| Persistence | localStorage + Upstash Redis |
| Email | Resend |
| Hosting | Vercel |
| Cron | GitHub Actions |

---

## Running locally

```bash
npm install
npm run dev
```

For cross-device sync and email reminders, you'll need a few environment variables:

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=
REMINDER_TO_EMAIL=
CRON_SECRET=
VERCEL_APP_URL=
```

The app works fine without them — it'll just fall back to localStorage only.

---

## How the review schedule works

When you log a problem, `nextReview` is set to `dateSolved + 7 days`. Every time you mark it reviewed, `nextReview` advances another 7 days from that review date. Problems that are overdue (past their `nextReview` date) still surface in the queue until you clear them.

```ts
type Problem = {
  id: string
  title: string
  url: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  dateSolved: string       // ISO date
  reviewDates: string[]    // history of past reviews
  nextReview: string       // next scheduled review date
}
```

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `N` | Open the log problem form |
| `D` | Go to dashboard |
| `H` | Go to history |
| `ESC` | Close the form |
