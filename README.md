# Seasonbase HQ

A lightweight internal dashboard for:
- total waitlist signups
- recent signup trends
- top destinations
- recent signups table
- employer pipeline tracking
- meeting logging and status updates

## Stack
- Next.js App Router
- Supabase (existing waitlist + new employer tables)
- Vercel deployment

## What is included
- `/` overview dashboard
- `/employers/new` add employer form
- `/meetings/new` log meeting form
- `/login` Supabase magic-link login
- `supabase/schema.sql` for the employer CRM tables

## 1. Create the project
```bash
npm install
npm run dev
```

## 2. Add environment variables
Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_EMAIL`

For Vercel, add the same values in Project Settings -> Environment Variables.

## 3. Configure Supabase Auth
In Supabase Auth:
- enable email auth / magic links
- create your admin user with the email in `ADMIN_EMAIL`
- add these redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://YOUR-VERCEL-DOMAIN/auth/callback`

## 4. Run the SQL
Open the SQL Editor in Supabase and run `supabase/schema.sql`.
Before you run it, replace `YOUR_ADMIN_EMAIL` inside the policies with your real admin email.

## 5. Make sure the waitlist table name matches
This starter expects your existing table to be named `waitlist_signups` with at least:
- `id`
- `created_at`
- `name`
- `email`
- `answers` (json/jsonb)

If your existing table is named differently, update:
- `lib/queries.ts`

## Notes
- The top-destinations logic assumes destinations live inside the `answers` JSON field.
- It checks a few common keys: `destinations`, `destination`, `destinations_selected`, `preferred_destinations`.
- If your JSON shape differs, update `extractDestinations()` in `lib/queries.ts`.

## Recommended deploy flow
1. Push this folder to a new GitHub repo.
2. Import the repo into Vercel.
3. Add the environment variables.
4. Deploy.
5. Log in through `/login`.

## Suggested next improvements
- dedicated employers list page with edit capability
- filters by destination and date range
- monthly meeting conversion metrics
- notes timeline per employer
- CSV export for signups and pipeline
