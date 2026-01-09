-- ============================================
-- VOID - Physics II Study Platform
-- Supabase Database Schema
-- ============================================

-- Enable UUID extension (if not already enabled)
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profile information and course access
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  nickname text not null,
  is_physics_unlocked boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- RLS Policies for profiles
-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Allow service role to insert profiles (for signup)
create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (true);

-- ============================================
-- INDEXES
-- ============================================
-- Index for faster lookups by user ID
create index profiles_id_idx on public.profiles (id);

-- ============================================
-- TRIGGERS
-- ============================================
-- Automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- ============================================
-- FUNCTIONS
-- ============================================
-- Function to create profile on signup (optional, can be done in app code)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, is_physics_unlocked)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', 'Anonymous'),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ============================================
-- NOTES FOR SETUP
-- ============================================
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Ensure you have enabled Email Auth in Supabase Dashboard > Authentication > Providers
-- 3. Set up your environment variables in .env.local:
--    NEXT_PUBLIC_SUPABASE_URL=your_project_url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
--    PHYSICS_PASSWORD=your_class_password
-- 4. Optional: Configure email templates in Supabase Dashboard > Authentication > Email Templates
