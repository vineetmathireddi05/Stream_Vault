-- StreamVault — Supabase schema, RLS policies, and profile-creation trigger
-- Run this in the Supabase SQL editor (or via supabase CLI) for your project.

create extension if not exists "pgcrypto";

-- 1. profiles -----------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'standard', 'premium')),
  created_at timestamptz not null default now()
);

-- 2. watchlist ----------------------------------------------------------------
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  added_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

create index if not exists watchlist_user_id_idx on public.watchlist (user_id);

-- 3. watch_history ------------------------------------------------------------
create table if not exists public.watch_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text,
  poster_path text,
  progress_seconds integer not null default 0,
  duration_seconds integer,
  watched_at timestamptz not null default now()
);

create index if not exists watch_history_user_id_idx on public.watch_history (user_id);
create index if not exists watch_history_user_tmdb_idx
  on public.watch_history (user_id, tmdb_id, media_type);

-- 4. ratings ------------------------------------------------------------------
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

-- 5. RLS ----------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.watchlist enable row level security;
alter table public.watch_history enable row level security;
alter table public.ratings enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
drop policy if exists "profiles: insert own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "watchlist: read own" on public.watchlist;
drop policy if exists "watchlist: insert own" on public.watchlist;
drop policy if exists "watchlist: update own" on public.watchlist;
drop policy if exists "watchlist: delete own" on public.watchlist;

create policy "watchlist: read own" on public.watchlist
  for select using (auth.uid() = user_id);
create policy "watchlist: insert own" on public.watchlist
  for insert with check (auth.uid() = user_id);
create policy "watchlist: update own" on public.watchlist
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "watchlist: delete own" on public.watchlist
  for delete using (auth.uid() = user_id);

drop policy if exists "watch_history: read own" on public.watch_history;
drop policy if exists "watch_history: insert own" on public.watch_history;
drop policy if exists "watch_history: update own" on public.watch_history;
drop policy if exists "watch_history: delete own" on public.watch_history;

create policy "watch_history: read own" on public.watch_history
  for select using (auth.uid() = user_id);
create policy "watch_history: insert own" on public.watch_history
  for insert with check (auth.uid() = user_id);
create policy "watch_history: update own" on public.watch_history
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "watch_history: delete own" on public.watch_history
  for delete using (auth.uid() = user_id);

drop policy if exists "ratings: read own" on public.ratings;
drop policy if exists "ratings: write own" on public.ratings;

create policy "ratings: read own" on public.ratings
  for select using (auth.uid() = user_id);
create policy "ratings: write own" on public.ratings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6. Profile auto-creation trigger -------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    'free'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
