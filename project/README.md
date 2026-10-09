# Final Project

## My project repository

Public repository: https://github.com/Jasmine-Rose-Palma/3-Steps

Live app: https://jasmine-rose-palma.github.io/3-Steps/

The API runs on a free plan and goes to sleep when nobody uses it, so the first
request after a quiet period can take about 50 seconds. To check that it is awake:
https://three-steps-api-hpxj.onrender.com/health

## What it is

3 Steps suggests one small, low-effort activity that fits how much time and energy
you have right now, asks for a small proof that you did it, and keeps a list of
everything you have finished. It is for the moments when I would otherwise just
scroll through my phone.

## How to run it

You need Node 20 or newer, a PostgreSQL database, and a Supabase project with its
URL and public (anon) key. For Google sign-in, turn on the Google provider in
Supabase too.

The API:

    cd server
    npm install
    cp .env.example .env
    npm run db:setup
    npm run dev

In `.env`, fill in `DATABASE_URL` (for example
`postgresql://user:password@localhost:5432/threesteps`) and `SUPABASE_URL` (for
example `https://your-project.supabase.co`). These are examples, not real values.
`npm run db:setup` creates the tables and adds the 16 starter activities. The API
then runs on http://localhost:3000.

The client, in a second terminal:

    cd client
    npm install
    cp .env.example .env
    npm run dev

In that `.env`, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The client
runs on http://localhost:5173 and passes anything starting with `/api` to the API.

Run the tests with `npm test` inside `client` and again inside `server`.

## Presentation

- Video (public Google Drive link): https://drive.google.com/file/d/1j7ORnrtF1igjwod5-1fb2tZQvgfH5KR1/view?usp=sharing
- Slides (link or PDF): https://drive.google.com/file/d/1cBvanejQy-HYD0AZJTjAjY12cSckNgm7/view?usp=sharing
- Square image: https://drive.google.com/file/d/1JTzeoHSY9hy-sWLVjrIJZMyxdJ8dX66t/view?usp=sharing 

## AI usage

Link to the `AI-USAGE.md` in my project repository:
https://github.com/Jasmine-Rose-Palma/3-Steps/blob/main/AI-USAGE.md
