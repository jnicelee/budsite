# Supabase setup

This project is wired for Supabase, a free hosted Postgres database with a browser API.

## 1. Create a free Supabase project

Create a project at `https://supabase.com/dashboard/projects`.

Choose:

- Project name: `budsite`
- Region: closest to Boston or your users
- Plan: Free

## 2. Deploy the schema

Open the Supabase SQL editor and run `supabase-schema.sql`, or use the CLI:

```bash
npx supabase login --token YOUR_SUPABASE_ACCESS_TOKEN
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

## 3. Add environment variables

Copy `.env.example` to `.env.local` for local development:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Add the same two variables in Vercel project settings before deploying.

## Current security note

The current BUDS login is a frontend prototype. The Supabase schema allows anonymous reads/writes so the current app can save agenda, budget, notes, and links. Before using real sensitive data, switch the login to Supabase Auth and tighten row-level security policies to authenticated users only.
