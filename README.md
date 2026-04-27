# StreamVault

A cinematic Netflix-style streaming app built with React, Vite, Express, Supabase, and the TMDB API.

Live demo: https://streamvault-xi.vercel.app

```
streamvault/
├── client/      # React + Vite frontend
├── server/      # Express API
└── supabase/    # SQL schema + RLS policies
```

## Tech stack

- **Frontend** — React 18 (Vite), React Router v6, Zustand, TanStack Query v5, Tailwind CSS, Framer Motion, React Player, Lucide icons
- **Backend** — Node.js + Express, Supabase JS (server-side admin + per-user clients), axios for TMDB
- **Data** — Supabase Postgres (auth, profiles, watchlist, watch_history, ratings) + TMDB API
- **Auth** — Supabase Auth (email + password), JWT bearer token verified by server middleware

## Features

| Page | What it does |
| --- | --- |
| `/` | Public landing — hero video, feature cards, FAQ, email capture |
| `/login` & `/signup` | Supabase auth with persisted session |
| `/browse` | Hero banner + Netflix-style horizontal rows with oversized hover-preview cards |
| `/movies` & `/tv` | Filtered Movies / TV listings |
| `/search?q=` | Debounced multi-search with media-type filters |
| `/my-list` | Saved watchlist with empty state |
| `/profile` | Avatar picker, plan selector, watch history with progress bars |
| `/watch/:type/:id` | Custom React Player UI with auto-saved progress |
| Detail modal | Auto-playing trailer, cast, ratings, recommendations, add-to-list |

## Prerequisites

- **Node.js** 20+ and npm 10+
- A **Supabase** project (free tier is fine) → grab the URL, anon key, and service role key
- A **TMDB API key** (free) → https://www.themoviedb.org/settings/api

## 1. Install

```bash
npm run install:all
```

This installs root, client, and server dependencies.

## 2. Set up Supabase

1. Create a project at supabase.com.
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql).
   It creates the four tables (`profiles`, `watchlist`, `watch_history`, `ratings`),
   enables RLS with per-user policies, and installs the trigger that auto-creates
   a `profiles` row whenever a new user signs up.
3. In Authentication → Providers, make sure Email is enabled.

## 3. Configure environment variables

Create local environment files and fill in real values:

`client/.env`

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_API_BASE_URL=http://localhost:5000
```

`server/.env`

```
PORT=5000
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key>
TMDB_API_KEY=<tmdb v3 api key>
TMDB_BASE_URL=https://api.themoviedb.org/3
CLIENT_URL=http://localhost:5173
```

> Never commit `.env` files. They're gitignored.

## 4. Run

```bash
npm run dev
```

This boots both processes concurrently:

- Client → http://localhost:5173
- Server → http://localhost:5000 (health check at `/health`)

Run them individually with `npm run dev:client` or `npm run dev:server`.

## 5. Build

```bash
npm run build
```

Produces a production bundle for the client in `client/dist/`.

## Deploy on Vercel

The project includes `vercel.json` and a serverless Express entrypoint at `api/index.js`.

Set these environment variables in Vercel for Production and Preview:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
TMDB_API_KEY
CLIENT_URL=https://streamvault-xi.vercel.app
```

Then deploy:

```bash
vercel deploy --prod
```

## API surface

All routes under `/api/*`. Auth-protected routes require `Authorization: Bearer <supabase access token>`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | – | Create account, return session |
| POST | `/api/auth/login` | – | Sign in with email/password |
| POST | `/api/auth/logout` | ✓ | Sign out |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/movies/trending` | – | TMDB trending (week) |
| GET | `/api/movies/popular` | – | Popular movies |
| GET | `/api/movies/top-rated` | – | Top rated movies |
| GET | `/api/movies/genres` | – | Movie genre list |
| GET | `/api/movies/:id` | – | Movie detail (videos, credits, recs) |
| GET | `/api/tv/popular` | – | Popular TV |
| GET | `/api/tv/top-rated` | – | Top rated TV |
| GET | `/api/tv/:id` | – | TV detail |
| GET | `/api/search?q=` | – | TMDB multi-search |
| GET | `/api/watchlist` | ✓ | Get user's watchlist |
| POST | `/api/watchlist` | ✓ | Add/upsert item |
| DELETE | `/api/watchlist/:tmdb_id?media_type=` | ✓ | Remove item |
| GET | `/api/history` | ✓ | Watch history |
| POST | `/api/history` | ✓ | Upsert progress |
| GET | `/api/profiles/me` | ✓ | Get profile (auto-creates if missing) |
| PATCH | `/api/profiles/me` | ✓ | Update username / avatar / plan |

## Project conventions

- **State** — server state lives in TanStack Query, auth in Zustand (persisted to localStorage), UI ephemera (open detail modal, etc.) in a small Zustand store.
- **Auth flow** — Supabase Auth handles signup/login on the client and persists a session. The server verifies the bearer token via `supabase.auth.getUser(token)` in `requireAuth` middleware, then constructs a per-user Supabase client so all RLS policies fire correctly.
- **Trailer playback** — TMDB returns YouTube `key`s; React Player streams them. Watch progress is debounced (saves every ≥15s of progress) and persisted to `watch_history`.
- **Styling** — Tailwind v3 with a custom Netflix-inspired palette (`background`, `surface`, `card`, `primary`). Display font is Bebas Neue, body is DM Sans, both via Google Fonts.
- **Responsiveness** — Card grids collapse 6→5→3→2 columns; navbar swaps to a hamburger menu on mobile.

## Things to extend

- Real video playback (the project plays YouTube trailers as a stand-in)
- Per-profile sub-accounts (Netflix-style "who's watching")
- Server-side rendering / streaming with Next.js
- Realtime presence with Supabase channels
- Stripe / billing integration for paid plans

## License

MIT — demo / portfolio use.
