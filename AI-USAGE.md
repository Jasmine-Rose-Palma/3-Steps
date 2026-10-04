# AI Usage

This project, "3 Steps: What to Do When You Have Nothing to Do?", was built with the help of an AI assistant, Claude (Anthropic), used through the Claude app. This file says what the AI did, what I did, and how I checked the result.

## Summary

|Area|Who did the work|
|-|-|
|Idea, proposal, wireframes, design system, what each screen should do|Me|
|Backend: the function bodies behind every API route, the database setup, and the login check|Me, one TODO step at a time|
|Backend: project structure, starter files, step-by-step TODO instructions, test checkers, the Supabase token verifier|Claude|
|Frontend: all React components, pages, CSS and the favicon wiring|Claude, from my wireframes and design system|
|Frontend tests and end-to-end checks|Claude|
|Setup help, error explanations, documentation drafts, presentation script|Claude, with me deciding what to keep|

Claude's role on the backend was a guide. It gave me a starter project where the key functions were left empty with a numbered TODO, and a test file for each step. I wrote the code, ran the tests, and fixed my mistakes until they passed. On the frontend I handed over the work: I gave Claude my wireframes, design system and proposal, and it wrote the code.

## What I wrote myself

These are the lines I wrote in the backend, one TODO at a time. They are the working logic of the API.

|File|What I wrote|Lines|
|-|-|-|
|`backend/src/activitiesRepo.js`|`getById` and `getAll`: the filter that builds the SQL from the chosen time and energy|13|
|`backend/src/app.js`|The `GET /activities` route (checks the filters against a whitelist, answers 400 for bad values) and `GET /activities/:id`|26|
|`backend/src/db.js`|Creating the PostgreSQL connection pool|4|
|`backend/src/server.js`|Building the app and starting it listening|2|
|`backend/src/setupDb.js`|`setupDatabase`: creating the tables and seeding the activities only when the table is empty|9|
|`backend/src/completionsRepo.js`|`addCompletion` and `listCompletions` (only the caller's own rows, newest first)|10|
|`backend/src/completionsRoutes.js`|`POST /completions` and `GET /completions`|19|
|`backend/src/auth.js`|`getBearerToken` and `createRequireUser`: reading the login token and protecting routes|22|
|**Total**||**105**|


## What Claude wrote

* The backend scaffolding around my code: `index.js`, `dbSetupCli.js`, the data file of activities, the `createApp` setup, `createSupabaseVerifier` in `auth.js` (it uses the `jose` library), and the test file for every backend step.
* The whole frontend: the pages (Login, Home, Suggestion, Proof, Progress), the components sorted into atoms, molecules and organisms, the API client, the Supabase login wrapper, the CSS modules and design tokens, and the layout changes I asked for after comparing the result with my wireframes.
* The Vitest tests for the frontend and the end-to-end browser checks against the real API and a throwaway database.
* Drafts of my documentation and my presentation script. I edited them and decided what went in.

## How I directed and checked the AI

* I ran the Vitest tests after each backend step. They told me whether I was building each part correctly and in line with my project's goals, and I fixed my code until they passed.
* For the frontend I ran the app, compared each screen with my wireframe, and sent Claude screenshots and wireframe images. The Home, Activity, Completion and Login screens were each redone after that comparison.
* I read the code I would have to explain on video, especially the filter algorithm, the login check and the completions routes.
* I handled the parts only I can do: the Supabase project, Google sign-in setup, the `.env` file, and running everything on my own computer.

## Where the AI was not enough on its own

* A Google sign-in error from Supabase needed the setup changed in the Supabase dashboard, not in the code.
* The first frontend screens did not match my wireframes. I corrected them with screenshots, and Claude measured the differences and adjusted the spacing, sizes and fonts.
* Google sign-in with a live Supabase project has not been tested by Claude. I have to confirm it myself.

## Data and secrets

No passwords, keys or personal details were shared in the code. Real values live only in `.env` files, which are not committed.

