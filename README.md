# StreamVault

A full-stack Netflix-style streaming platform with cinematic browsing, hover previews, Supabase authentication, watchlists, profiles, search, watch history, and a custom video player experience.

[Live Demo](https://streamvault-xi.vercel.app)

## Overview

StreamVault is a polished streaming interface built as a complete full-stack web app. It combines a React/Vite frontend with an Express API, Supabase Auth and Postgres, and live catalog data from TMDB.

The app includes the core flows users expect from a modern streaming service: signing in, browsing rich media rows, opening title details, playing trailers, saving titles, searching the catalog, managing a profile, and tracking watch progress.

## Highlights

- Netflix-inspired home, movie, TV, search, watchlist, and profile screens
- Large cinematic title cards with hover expansion and trailer previews
- Supabase email/password authentication with persisted sessions
- Protected routes for authenticated browsing and profile features
- TMDB-powered trending, popular, top-rated, search, detail, cast, trailer, and recommendation data
- Watchlist and watch-history persistence with Supabase Row Level Security
- Custom video player route using React Player
- Detail modal with trailers, metadata, cast, ratings, and recommendations
- Vercel-ready deployment with a serverless Express API entrypoint
- Responsive Tailwind UI for desktop, tablet, and mobile

## Live App

Production URL:

```txt
https://streamvault-xi.vercel.app
```

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, Vite, React Router, Tailwind CSS, Framer Motion |
| State/Data | Zustand, TanStack Query, Axios |
| Media | React Player, TMDB image/video metadata |
| Backend | Node.js, Express, Helmet, CORS, Morgan |
| Database/Auth | Supabase Auth, Supabase Postgres, Row Level Security |
| Deployment | Vercel, serverless Express function |

## Project Structure

```txt
streamvault/
├── api/
│   └── index.js              # Vercel serverless entrypoint for Express
├── client/
│   ├── public/
│   └── src/
│       ├── api/              # Axios and Supabase clients
│       ├── components/       # Cards, rows, layout, player, UI primitives
│       ├── hooks/            # Query and auth hooks
│       ├── pages/            # Route-level screens
│       ├── store/            # Zustand stores
│       └── utils/            # Constants and formatters
├── server/
│   ├── index.js
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── services/
├── supabase/
│   └── schema.sql            # Tables, triggers, and RLS policies
├── vercel.json
└── package.json
```

## Core Routes

| Route | Description |
| --- | --- |
| `/` | Landing page with hero, features, FAQ, and signup entry |
| `/login` | Supabase login |
| `/signup` | Supabase signup |
| `/browse` | Main streaming dashboard with hero and horizontal content rows |
| `/movies` | Movie-focused catalog view |
| `/tv` | TV-focused catalog view |
| `/search` | Debounced search with media-type filters |
| `/my-list` | Saved titles |
| `/profile` | Avatar, plan, account, and watch history |
| `/watch/:type/:id` | Trailer playback and progress tracking |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase project
- TMDB API key

### Install Dependencies

```bash
npm run install:all
```

This installs dependencies for the root workspace, frontend, and backend.

### Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the schema in [`supabase/schema.sql`](supabase/schema.sql).
4. Confirm that Email authentication is enabled in Authentication settings.

The schema creates:

- `profiles`
- `watchlist`
- `watch_history`
- `ratings`
- Row Level Security policies
- A trigger that creates a profile row when a user signs up

### Environment Variables

Create local env files. These files are ignored by Git.

`client/.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:5000
```

`server/.env`

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TMDB_API_KEY=your-tmdb-api-key
TMDB_BASE_URL=https://api.themoviedb.org/3
CLIENT_URL=http://localhost:5173
```

Do not commit real `.env` files.

## Run Locally

Start the frontend and backend together:

```bash
npm run dev
```

Local URLs:

```txt
Client: http://localhost:5173
Server: http://localhost:5000
Health: http://localhost:5000/health
```

Run either side independently:

```bash
npm run dev:client
npm run dev:server
```

## Build

```bash
npm run build
```

The production frontend build is created in:

```txt
client/dist
```

## Deploy

This repository is ready for Vercel deployment. The included [`vercel.json`](vercel.json) builds the Vite app and routes `/api/*` requests to the Express serverless entrypoint in [`api/index.js`](api/index.js).

Set these variables in Vercel for Production and Preview:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
TMDB_API_KEY
CLIENT_URL=https://streamvault-xi.vercel.app
```

Deploy:

```bash
vercel deploy --prod
```

Important: Vite reads `VITE_*` variables at build time. If those values change in Vercel, redeploy the project so the browser bundle receives the new values.

## API Reference

All API routes are served under `/api`.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | No | Create an account and return a session |
| `POST` | `/api/auth/login` | No | Sign in with email and password |
| `POST` | `/api/auth/logout` | Yes | Sign out |
| `GET` | `/api/auth/me` | Yes | Get the current user |
| `GET` | `/api/movies/trending` | No | Weekly trending titles |
| `GET` | `/api/movies/popular` | No | Popular movies |
| `GET` | `/api/movies/top-rated` | No | Top-rated movies |
| `GET` | `/api/movies/genres` | No | Movie genres |
| `GET` | `/api/movies/:id` | No | Movie details, videos, credits, recommendations |
| `GET` | `/api/tv/popular` | No | Popular TV shows |
| `GET` | `/api/tv/top-rated` | No | Top-rated TV shows |
| `GET` | `/api/tv/:id` | No | TV details, videos, credits, recommendations |
| `GET` | `/api/search?q=` | No | TMDB multi-search |
| `GET` | `/api/watchlist` | Yes | Get saved titles |
| `POST` | `/api/watchlist` | Yes | Add or update a saved title |
| `DELETE` | `/api/watchlist/:tmdb_id?media_type=` | Yes | Remove a saved title |
| `GET` | `/api/history` | Yes | Get watch history |
| `POST` | `/api/history` | Yes | Save playback progress |
| `GET` | `/api/profiles/me` | Yes | Get or create the current profile |
| `PATCH` | `/api/profiles/me` | Yes | Update profile details |

Protected endpoints require:

```txt
Authorization: Bearer <supabase-access-token>
```

## Design Notes

- The browse rows use oversized landscape cards for a streaming-service feel.
- Cards expand on hover and reveal playback, watchlist, metadata, and info controls.
- Trailer previews are loaded lazily from title detail data.
- The UI keeps a dark cinematic palette with red action accents.
- The layout is responsive and keeps horizontal rails usable across screen sizes.

## Security Notes

- Local `.env` files are ignored.
- Vercel environment values are not committed.
- Supabase service-role access is used only on the server.
- User-specific data is protected with Supabase Row Level Security.

## License

MIT
