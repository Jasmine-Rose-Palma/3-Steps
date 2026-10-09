# AI Usage

This project, "3 Steps: What to Do When You Have Nothing to Do?", was built with the help of an AI assistant, Claude (Anthropic), used through the Claude app. This file says what the AI did, what I did, where it got things wrong, and how I checked the result.

Note: I only started using git on October 9, 2026, although the project template repo has already been created on my own workspace earlier, after the code was already written on my computer. The history of this repository therefore has two commits of mine, and each link points to the commit that contains the work described. Planning documents and slides live in my course workspace, so some entries have no commit to link to.

## Summary

| Area | Who did the work |
| --- | --- |
| Idea, proposal, wireframes, design system, what each screen should do | Me |
| Back end: the working logic behind the API routes, the database setup and the login check | Me, one TODO step at a time |
| Back end: project structure, starter files, step-by-step TODO notes, test checkers, the Supabase token verifier | Claude |
| Front end: the layout, styling and structure of every screen | Claude, from my wireframes and design system |
| Front end: the working logic of 16 files (the API client, the login layer, labels, random pick, the small components and two pages) | Me, with the TODO notes |
| Tests | Claude |
| Deployment settings (GitHub Pages, Render, Neon, Supabase) | Me, following Claude's step-by-step instructions |
| Deployment code changes (base path, CORS, `helmet`, workflow variables) | Claude, except the one-line sign-in redirect fix in `auth.js`, which I made |

Claude's role on the back end was a guide. It gave me a starter project where the key functions were left empty with a numbered TODO, and a test file for each step. I wrote the code, ran the tests, and fixed my mistakes until they passed. On the front end I first handed the work over for initial deploy and run testing: I gave Claude my wireframes, design system and proposal, and it wrote the code. Later I asked for a second round of the same kind of exercises, so that more of the code in this project is mine. In that round I wrote the logic of 18 files across the front end and back end.

## How I used AI

1. **Choosing the login tool.** I asked Claude to compare Firebase and Supabase. It pointed out that the final project requires a hand-built Express and PostgreSQL back end, which changed my question. I decided to use Supabase for login only and keep my own API for everything else. The proposal was updated to match. (This was planning work in my course workspace, so there is no commit.)
2. **Writing the back end step by step.** Claude set up the project and left the key functions empty with numbered TODO notes and a test file for each. I wrote the function bodies, ran `npm test`, and fixed my code until each step passed. The result is in the `server/` folder of [commit 8b136db](https://github.com/Jasmine-Rose-Palma/3-Steps/commit/8b136db).
3. **Building the front end.** I gave Claude my wireframes, design system and proposal, and it wrote the React pages, components and CSS. I ran the app, compared every screen with my wireframe, and sent screenshots back until it matched. This is the `client/` folder of [commit 8b136db](https://github.com/Jasmine-Rose-Palma/3-Steps/commit/8b136db).
4. **The second round of exercises.** Once deployment and run tests were verified, I asked for more code to write myself. Claude took the finished front end and turned the logic of 16 front end files and 2 back end files into numbered TODO notes, each with a checker. I typed the code, ran the checker (for example `npm test -- pick` or `npm test -- api`), and kept going until it passed. These files are part of [commit 8b136db](https://github.com/Jasmine-Rose-Palma/3-Steps/commit/8b136db) too, because that is where my code first entered the repository.
5. **Tests.** Claude wrote the Vitest tests that are in the repository: 15 test files for the client and 2 for the server, plus their shared setup files. I used them as checkers while I worked, and I did not write them myself. They are part of [commit 8b136db](https://github.com/Jasmine-Rose-Palma/3-Steps/commit/8b136db).
6. **Deploying.** Claude walked me through GitHub Pages, Render, Neon and the Supabase settings one stage at a time, and prepared the small code changes that deploying needed. I did the testing on the live site. Those changes are in [commit 199e1b8](https://github.com/Jasmine-Rose-Palma/3-Steps/commit/199e1b8).
7. **Documentation.** Claude drafted my weekly reports, video script, slides content, and the README. I read each one, corrected it, and decided what went in.

## What I wrote myself

I wrote code in two rounds. In both, Claude set up the file and left the key lines out with numbered TODO notes, and I wrote them and ran the checker until it passed.

**Round 1: the back end.** These are the lines I wrote in the working logic of the API.

| File | What I wrote | Lines |
| --- | --- | --- |
| `server/src/activitiesRepo.js` | `getById` and `getAll`: the filter that builds the SQL from the chosen time and energy | 13 |
| `server/src/app.js` | The `GET /activities` route (checks the filters against a whitelist, answers 400 for bad values) and `GET /activities/:id` | 26 |
| `server/src/db.js` | Creating the PostgreSQL connection pool | 4 |
| `server/src/server.js` | Building the app and starting it listening | 2 |
| `server/src/setupDb.js` | `setupDatabase`: creating the tables and seeding the activities only when the table is empty | 9 |
| `server/src/completionsRepo.js` | `addCompletion` and `listCompletions` (only the caller's own rows, newest first) | 10 |
| `server/src/completionsRoutes.js` | `POST /completions` and `GET /completions` | 19 |
| `server/src/auth.js` | `getBearerToken` and `createRequireUser`: reading the login token and protecting routes | 22 |
| **Subtotal** | | **105** |

**Round 2: the exercises.** I asked for more code to write myself, and Claude turned the logic of 18 files into TODO notes.

| File | What I wrote | Lines |
| --- | --- | --- |
| `client/src/lib/api.js` | `ApiError` and `createApi`: the request function and the three calls to my API | 57 |
| `client/src/lib/auth.js` | The login layer that talks to Supabase | 61 |
| `client/src/lib/labels.js` | The wording for time and energy, `difficultyLabel`, `formatCompletedDate` | 18 |
| `client/src/lib/pick.js` | `pickRandom` | 7 |
| `client/src/lib/supabase.js` | The shared Supabase client | 3 |
| `client/src/components/atoms/` | `Tag`, `Badge`, `Button` and `Heading` | 36 |
| `client/src/components/molecules/` | `ActivityMeta`, `HistoryItem` and `SelectorGroup` | 38 |
| `client/src/components/organisms/` | `ActivityCard` and `HistoryList` | 33 |
| `client/src/pages/` | The logic of the Activity and Progress screens | 54 |
| `server/src/index.js` | The command behind `npm start` | 15 |
| `server/src/dbSetupCli.js` | The command behind `npm run db:setup` | 11 |
| **Subtotal** | | **333** |

For scale: the application code, not counting tests, comments or blank lines, is about 1,900 lines. The back end is about 300 of them and the front end (JavaScript, JSX, CSS and HTML) is about 1,600. I counted only the lines I added to each starter file, not the lines Claude had already written in it.

| | My lines | Out of | Share |
| --- | --- | --- | --- |
| Back end | 131 | about 300 | 44% |
| Front end | 307 | about 1,600 | 19% |
| **Whole application** | **438** | **about 1,900** | **23%** |

A few things I want to be clear about:

- I typed the round 2 files myself in my old workspace folder, following the TODO notes, and then copied the finished files by hand into this repository's folder. Git came after that, so my code arrives in [commit 8b136db](https://github.com/Jasmine-Rose-Palma/3-Steps/commit/8b136db) together with everything else.
- The notes for round 2 were very detailed, nearly line by line. Because of that, nine of my files came out exactly like the version Claude had written before it turned them into exercises: `Tag`, `Badge`, `Heading`, `ActivityMeta`, `HistoryItem`, `ActivityCard`, `supabase.js` and the two pages. In the other seven (`Button`, `SelectorGroup`, `HistoryList`, `api.js`, `auth.js`, `labels.js` and `pick.js`) my version differs from Claude's. Round 2 is closer to carefully following steps than to designing. Round 1 asked more of me.
- Round 2 has two more steps, 13 and 14, which are in back end files. I did not count them, because I cannot show that I rewrote those lines.
- If you count only round 1, my share is about 6%. With both rounds it is about 23%.
- One line in `client/src/lib/auth.js` was changed after deploying: the Google sign-in redirect. That was my own edit, in [commit 199e1b8](https://github.com/Jasmine-Rose-Palma/3-Steps/commit/199e1b8).

## What Claude wrote

- The back end scaffolding around my code: the starter structure, the data file of 16 activities, the `createApp` setup, and `createSupabaseVerifier` in `auth.js`, which uses the `jose` library.
- The front end around my code: the pages (Login, Home, Suggestion, Proof, Progress), the components sorted into atoms, molecules and organisms, the CSS modules and the design tokens, the rest of each file I filled in during round 2, plus the layout changes I asked for after comparing the result with my wireframes.
- The tests in the repository.
- The deployment changes: the base path and 404 page for GitHub Pages, CORS limited to my site, `helmet`, the workflow variables and the new `dev` script.
- Drafts of my documentation, video script and slides.

## How I directed and checked the AI

- I ran the Vitest tests after each back end step and the checker for each exercise in round 2. They told me whether I was building each part correctly, and I fixed my code until they passed.
- For the front end I ran the app, compared each screen with my wireframe, and sent Claude screenshots and wireframe images. The Home, Activity, Completion and Login screens were each redone after that comparison.
- I read and worked to understand the codes carefully, especially the filter algorithm, the login check and the completions routes.
- I did the parts only I can do which are the Supabase project, Google sign-in setup, the Render and Neon accounts, the GitHub settings, my `.env` files, and testing everything on the live site, including email sign-in, sign-up and Google sign-in.

## Where the AI got it wrong

1. **The front end only worked at the root of a website.** Claude wrote the logo paths as `/logo.png`, left the router without a base path, and sent Google sign-in back to the site's root address. All of that works on my computer and breaks on GitHub Pages, where the site lives under `/3-Steps/`. I did not notice it myself. Claude found it while reading the template's deploy workflow during the move, before the first deploy. The fix is in [commit 199e1b8](https://github.com/Jasmine-Rose-Palma/3-Steps/commit/199e1b8): a base path in `vite.config.js`, the router and logos reading it, and my own one-line change to the sign-in redirect in `client/src/lib/auth.js`.
2. **Git instructions that ignored my existing repository.** My professor's template was already cloned, but Claude's first instructions told me to run `git init` and publish a new repository. I only found out something was wrong when `git remote -v` printed nothing. We moved my code into the clone instead, which is [commit 8b136db](https://github.com/Jasmine-Rose-Palma/3-Steps/commit/8b136db).
3. **The first front end screens did not match my wireframes.** Spacing, sizes and fonts were off on Home, Activity, Completion and Login. I caught it by putting the running app next to my wireframes. I sent Claude screenshots and it measured the differences and redid those screens. This happened before I had a repository, so there is no commit to link.

Smaller slips: Claude's first line count for this file used the wrong total, because it counted test setup files as application code. It also left my real name inside one test file, which would have broken my course's rule about keeping personal details out of the public repository. Both were caught before submission and fixed.

## Data and secrets

No passwords, keys or personal details are in the code. Real values live only in `.env` files, which are git-ignored, and in the settings pages of Render, Neon, Supabase and GitHub. The database connection string and the Supabase keys were never committed.
