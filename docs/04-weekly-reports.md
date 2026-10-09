# Weekly reports

---

## Week of 2026-10-04 to 2026-10-09

**Done.** Everything works on the deployed site now. I signed in with email, created a new account and signed in with Google, then finished an activity and saw it on the Progress page.

- Wrote the back end: an Express API with routes for `/activities` and `/completions`, PostgreSQL queries that are all parameterized, and a login check that reads the Supabase token and gives back who the user is. I wrote the core of each file one TODO step at a time and ran `npm test` after each step until it passed.
- Built all five screens (Login, Home, Activity, Proof and Progress). My first screens did not match my wireframes, so I compared them side by side, sent screenshots, and had the spacing, sizes and fonts redone until they matched.
- Did a second round of TODO exercises on 18 more files, so that more of the code in the project is my own (the API client, the login layer, the small components and two pages).
- Put it online. The client is on GitHub Pages, the API on Render and the database on Neon, with Supabase pointed at the live address. I also moved my code into the template repository my professor gave us and made my first two commits.
- Wrote the README, AI-USAGE.md and the security checklist.

**Stuck.**

- The first deploy showed "Ensure GitHub Pages has been enabled" and failed with a 404. I had never set Settings > Pages > Source to GitHub Actions. Setting it and running the workflow again fixed it.
- The app only worked at the root of a website. The logos, the router and the Google sign-in redirect all pointed to `/`, but on GitHub Pages my site lives under `/3-Steps/`. The fix was a base path in `vite.config.js` that the router and the redirect also read.
- I had never set-up git before this week, and the first instructions I got told me to run `git init` even though my professor's template was already cloned. `git remote -v` printed nothing, which is how I found out. We moved my code into the clone instead.
- The first commit looked frozen. VS Code had opened a `COMMIT_EDITMSG` tab and was waiting for a message, so the commit finished only after I typed one there, saved and closed it.
- Render's free plan puts the API to sleep, so the first request after a quiet period takes about 50 seconds. I have not fixed this. I will open the site a few minutes early when I record.

**Hours.** About 7-8 hours, inclusive of breaks.

**Next.**

- Record the demo video on the deployed site and paste the link into the README.
- Finish the documents, add a screenshot, and update the slides.

---

## Week of 2026-09-16 to 2026-09-30

This covers weeks 1 and 2 together. It was all planning, and nothing was deployed yet.

**Done.**

Week 1 (September 16 to 23):

- Wrote the app proposal: what it is, who it is for, the main screens (Home, Activity Suggestion, Proof / Completion and Progress), who owns the state of the most important screen, and a list of content to gather.
- Added a proof-of-completion feature. An activity can no longer be marked done with a plain checkbox. The user has to give proof first, either a short typed line or a photo, depending on the activity (a quote from the chapter for a reading activity, a photo of the cleaned drawer for a tidying one). The proof is shown once after submitting and is not saved anywhere.
- Drafted a 16-item starter activity bank with a name, category, duration, difficulty and a proof type and prompt for each.
- Finished the wireframes: a screen map with labeled navigation, box sketches of every screen at phone and desktop width, and a full component tree. I also made a visual mockup of all the screens at both widths.
- Finished the design system: plain CSS with CSS Modules, 5 color tokens (primary green, accent orange, cream background, tan surface, near-black text), a 3-size type scale, an 8px spacing base, a 600px breakpoint, and a table of 6 reusable components (Header, Button, Tag, Badge, ActivityMeta and ActivityCard) with the screens each one appears on and its props.

Week 2 (September 23 to 30):

- Added login to the plan. I compared Firebase and Supabase and chose Supabase Auth for login only, with email and password and a "Continue with Google" option. Everything else the app stores (the activities, the completed activities and the progress) stays on a back end I write myself with Express, PostgreSQL and hand-written RESTful routes.
- Login became the fifth screen, and `App` now owns a new piece of state called `session`. I listed the content blocks of the Login screen, added the Supabase project and Google OAuth setup to the content to gather, and added a second risk about connecting authentication for the first time.
- Changed where progress is kept. `completedActivities` used to be an in-memory array in `App`, but now it has to be saved in PostgreSQL under the signed-in user's id, so it is still there the next time they open the app or when they use another device. That makes the progress more personal and traceable.
- Reviewed the activity bank and replaced number 2, "One-song dance break", with "Read one chapter off a book". Its proof is a favorite sentence from the chapter pasted into the text box. The bank now has eight low-effort and eight some-effort activities.
- Updated the polished wireframes and the design system.

**Stuck.**

- In week 1, `currentActivity` was owned by the Suggestion screen alone, but the Proof screen needs to read the same activity. I only noticed this when I mapped the navigation between the two screens. I moved that state up to `App`.
- Also in week 1, the accent orange (`#C1542B`) failed the contrast check when used as text on the cream background. It measures 3.99:1 and the minimum is 4.5:1. It looked fine to my eye, so I only found it by calculating. The fix was a second, slightly darker token, `--color-accent-text` (`#AD4B26`, 4.79:1), for accent text and outlines.
- Choosing the login tool. It first looked like a question of features, but the final project requires a self-built Node, Express and PostgreSQL back end, so using Firebase or Supabase for everything would not count. I settled on a split: Supabase only answers who the user is, and my own API handles what the user did.
- Adding login broke an earlier assumption. The proof and completions were designed with no back end and nothing saved, which is no longer true once accounts exist, so I had to rework the state table and the notes.
- A smaller open question: reading a whole book chapter may take longer than the ten minutes I set for that activity.

**Hours.** About 22 hours week 1 and 2 combined (roughly 40 minutes to 2 hours a day), inclusive of breaks and prioritization of other academic requirements.

**Next.**

- Start coding, back end first: the activities and completions API with tests, then the React screens, then the Supabase login connected to the API so that it checks who is signed in.
- Start AI-USAGE.md with real entries linked to commits, and add the credit line to the README.
- Confirm the exact fonts used in the design system mockup.
