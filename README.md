# Job Radar

A MERN app (React + Node/Express + MongoDB) that scans real, live job vacancies near a
location and role you choose, and tracks the ones you apply to.

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express — proxies job search to the Adzuna API so your API keys
  never sit in browser code
- **Database:** MongoDB — stores the jobs you save/apply to, so your pipeline persists
  between visits
- **Job data:** [Adzuna](https://developer.adzuna.com) — a real job-search API with free
  India coverage (~1,000 free calls/month)

## Before you run it, two things to set up (5 minutes total)

### 1. A free Adzuna API key
1. Go to https://developer.adzuna.com and register (no card required).
2. Your dashboard shows an **App ID** and **App Key** immediately.

### 2. MongoDB
Either works:
- **Local:** install MongoDB Community Server and run it — default connection string
  `mongodb://127.0.0.1:27017/job-radar` already works, no changes needed.
- **Free cloud (no local install):** create a free cluster at
  https://www.mongodb.com/cloud/atlas, then use the connection string it gives you.

## Running it

```bash
# Backend
cd backend
cp .env.example .env      # then paste in your Adzuna keys + Mongo URI
npm install
npm start                 # runs on http://localhost:5000

# Frontend (in a second terminal)
cd frontend
npm install
npm run dev                # runs on http://localhost:5173
```

Open http://localhost:5173 — it loads with vacancies near Pune by default. Change the
role/location in the left panel and hit "Scan for vacancies" to search anything else.

## What it actually does

- **Feed tab:** live search results from Adzuna's India job index — company, location,
  how fresh the listing is, salary if the employer listed one, and an **Apply** button
  that opens the real listing on the employer's/job board's original page.
- **Tracker tab:** hit **Track** on any listing to save it to MongoDB. From there you can
  move it through Saved → Applied → Interviewing → Offer/Rejected, and it persists across
  sessions.

## One honest limitation

Adzuna (like Indeed, LinkedIn, and every other job aggregator) gives you an **Apply link**
to the original posting — it doesn't expose a company's direct email or phone number.
Almost no job source does, for spam-prevention reasons. Once you click through, you'll
apply the same way you would on Indeed: via the employer's own form, portal, or listed
contact. This app gets you to the right listing fast and keeps track of where you stand —
the actual "email/contact them" step still happens on their site.
