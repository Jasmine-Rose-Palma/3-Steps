# 3 Steps: What to Do When You Have Nothing to Do?

3 Steps suggests one small, low-effort activity that fits how much time and energy you have right now, so a boring moment ends with something done instead of another scroll.

**Live site:** https://jasmine-rose-palma.github.io/3-Steps/
**API:** https://three-steps-api-hpxj.onrender.com/health
**Demo video:** https://drive.google.com/file/d/1j7ORnrtF1igjwod5-1fb2tZQvgfH5KR1/view?usp=sharing

> The API runs on a free plan, so it goes to sleep when nobody uses it. The first request after a quiet period can take about 50 seconds. If the site seems stuck on loading, give it a minute.

![The 3 Steps login screen](docs/assets/screenshot.png)

## What it does

- You sign in with an email and password, with Google, or create a new account. This is so that your progress belongs to your account, and it is still there even on another device.
- You pick how much time you currently have (under 5 minutes, or 5 to 10) and how much energy you have (low-effort, or a bit of effort).
- You get one activity that matches and you can ask for another one.
- You do it, then give a small proof: a typed line or a photo, depending on the activity. The button to finish only works once you have given it.
- A Progress screen lists everything you have finished.

The proof is only there so that finishing an activity is not on the honor system. The typed line and the photo are checked on screen and are not stored. Only the activity and the date are saved.

## Built with

React 19 and Vite on the front end, in plain JavaScript with CSS Modules and React Router. The back end is Express 5 and PostgreSQL, with routes and SQL queries that I wrote by hand. Every query is parameterized.

Supabase Auth only does the login. It answers who the user is, and nothing else. All of the app's own data, which is the activities and the completed activities, lives in my own database behind my own API.

The client is hosted on GitHub Pages, the API on Render, and the database on Neon. Tests are written with Vitest, with Testing Library on the client and Supertest and pg-mem on the server.

## How the pieces talk to each other

When you sign in, Supabase gives the client a token. The client sends that token to my API in an `Authorization: Bearer` header. The API checks the token against Supabase's public keys using the `jose` library, takes the user id from it, and reads or writes only that user's rows in PostgreSQL. Routes that touch personal data refuse any request without a valid token.

## The API

| Route | What it does |
| --- | --- |
| `GET /health` | Answers `{"status":"ok"}`, so a host can see the API is alive |
| `GET /activities` | Lists the activities. Accepts `time` (`under5` or `5to10`) and `energy` (`low` or `someEffort`), and answers 400 for any other value |
| `GET /activities/:id` | One activity, 400 for a bad id, 404 if it does not exist |
| `GET /completions` | The signed-in user's completed activities, newest first |
| `POST /completions` | Saves a completed activity for the signed-in user. Body: `{ "activityId": 3 }` |

The two `/completions` routes answer 401 without a valid login.

## Running it yourself

You need Node 20 or newer, a PostgreSQL database (local or hosted), and a Supabase project with its URL and public (anon) key. For Google sign-in, turn on the Google provider in Supabase too.

**The API**

    cd server
    npm install
    cp .env.example .env        # fill in DATABASE_URL and SUPABASE_URL
    npm run db:setup            # creates the tables and adds the 16 activities
    npm run dev                 # http://localhost:3000

**The client**, in another terminal

    cd client
    npm install
    cp .env.example .env        # add the Supabase URL and anon key
    npm run dev                 # http://localhost:5173

While developing, Vite passes anything starting with `/api` on to `http://localhost:3000`, so the client needs no API address.

Check the API on its own before blaming the client:

    curl http://localhost:3000/health
    curl http://localhost:3000/activities

Run the tests with `npm test` inside `client` and again inside `server`.

## Environment variables

None of these are committed. Each folder has a `.env.example` with placeholder values.

| Name | Where | What it is |
| --- | --- | --- |
| `DATABASE_URL` | server | PostgreSQL connection string. It contains a password |
| `SUPABASE_URL` | server | Your Supabase project address, with nothing after `.co` |
| `CORS_ORIGINS` | server | Websites allowed to call the API, separated by commas. No trailing slash and no path. It can stay empty locally |
| `NODE_ENV` | server | `production` on the host |
| `PORT` | server | Set by the host. Do not set it there |
| `VITE_SUPABASE_URL` | client | Your Supabase project address |
| `VITE_SUPABASE_ANON_KEY` | client | Supabase's public key. It is meant to be public, but never use the `service_role` key here |
| `VITE_API_URL` | client, at build time | The API's address for a deployed build. Leave it unset locally |

Every `VITE_` value ends up inside the built JavaScript, so it is public. Nothing secret goes in one.

## Deploying

**Client, to GitHub Pages.** The workflow in `.github/workflows/deploy-pages.yml` builds the client whenever a push to `main` changes something in `client/`. Two settings were needed once: Settings > Pages > Source set to GitHub Actions, and the repository set to public. The three client values (`VITE_API_URL`, `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) are repository variables under Settings > Secrets and variables > Actions > Variables. They are compiled in at build time, so the workflow has to run again after changing one.

**API, to Render.** A web service on the free plan, with the root directory set to `server`, the build command `npm install` and the start command `npm start`. The health check path is `/health`. The environment variables are set in Render's dashboard, since there is no `.env` file on the host.

**Database, on Neon.** I ran `npm run db:setup` once from my own computer against the Neon connection string, which I kept in a git-ignored file. That created the tables and added the activities.

**Supabase.** Under Authentication > URL Configuration, the site URL and redirect URL are set to the live site's address, so email confirmation and Google sign-in come back to the right place. The local address is kept in the list for development.

## Project structure

    client/              React front end, built by Vite
      src/components/    atoms, molecules, organisms and the page layout
      src/pages/         Login, Home, Suggestion, Proof, Progress
      src/lib/           the API client, the login wrapper, labels, random pick
    server/              Express API
      src/               routes, database queries, the login check, database setup
      src/data/          the 16 starter activities
    docs/                planning documents, weekly reports, security checklist
    .github/workflows/   the GitHub Pages deploy

## What I would do next

- **Store the proof.** Today the photo is only previewed on screen and the typed line is not kept. Saving both would let the Progress screen show what I actually did, and not only that I did it.
- **Wake the API up politely.** Because of the free plan, the first request after a quiet period is slow. The app should say so while it waits, and the API should limit how often one person can call it.
- **More activities.** Sixteen will start repeating quickly. I would like to grow the bank, and maybe let users add their own.

## Security and privacy

What I checked before making this repository public is in [docs/06-security-and-privacy.md](docs/06-security-and-privacy.md).

## Author

A course project for Application and Systems Integration (6APSI), by [Jasmine-Rose-Palma](https://github.com/Jasmine-Rose-Palma).

## AI use

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

I used Claude (Anthropic) throughout this project, and it touched most of the code. It wrote the project scaffolding, the whole front end from my wireframes and design system, and the tests. I planned the app and wrote the core of the API myself, plus the logic of 18 more files on the front and back end, one TODO step at a time. By my count that is about 23% of the application code. The full account, with who wrote what and where the AI got things wrong, is in [AI-USAGE.md](AI-USAGE.md).

## Licence

MIT, see [LICENSE](LICENSE).
