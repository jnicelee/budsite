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

## 3. Migrate existing passwords

Before applying `20260524143000_move_passwords_to_supabase_auth.sql` to an existing database, migrate the current plaintext member passwords into Supabase Auth:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co SUPABASE_SERVICE_ROLE_KEY=your-service-role-key npm run migrate:auth-passwords
```

After the script reports completion, apply the SQL migration. New membership requests store passwords directly in Supabase Auth and keep only profile, approval, role, and status data in app tables.

## 4. Add environment variables

Copy `.env.example` to `.env.local` for local development:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Add the same two variables in Vercel project settings before deploying.

## Current security note

Member passwords are handled by Supabase Auth. The Supabase schema still allows broad anonymous reads/writes so the current app can save agenda, budget, notes, and links. Before using more sensitive private data, tighten row-level security policies to authenticated users only.
