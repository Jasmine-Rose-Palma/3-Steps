# 1. Proposal

This is the proposal as I first wrote it, updated to match the app as it was built.

## App name

**3 Steps: What to Do When You Have Nothing to Do?**

## What the app is for, in one sentence

3 Steps helps someone who is about to doom-scroll pick and complete one quick, low-effort activity that matches the time and energy they have right now, and prove they actually did it, so the idle moment ends in a small, verified accomplishment instead of a wasted scroll session.

## Who it is for

It is for someone like me, a person who catches themselves reaching for their phone to scroll during idle moments (like waiting for something or procrastinating, between tasks), and already knows scrolling won't make them feel better. In the moment they open the app, they have a few free minutes, don't have the motivation for anything big, and want one easy, low-stakes thing to do instead of a decision to make on their own.

## The five screens

| # | Screen | What it is for |
| - | --- | --- |
| 1 | Login | The entry point. The user signs in with email and password or with Google, or creates an account, so their progress belongs to them and follows them to other devices. |
| 2 | Home | The user picks how much time they currently have and how much energy. |
| 3 | Activity Suggestion | Shows one activity that matches, and an option to see another. |
| 4 | Proof / Mark Complete | Shows the activity again, asks for proof (a text or a photo, depending on the activity), and lets the user mark it done once the proof is given. |
| 5 | Progress | Lists the completed activities, newest first, for the signed-in user only, so they can see their small wins add up. |

If I removed Home, the filtering that the recommendation depends on would break. Removing Suggestion removes the recommendation itself. Removing Proof would turn actually doing the activity into an honor system, which undercuts the whole point of the app. Progress is not needed to complete an activity, but it is needed for the app's actual purpose, feeling better about small accomplishments, which makes it valuable enough.

**Login was added in week 2.** The first version worked with one anonymous user and no accounts. Once Progress is meant to mean something real, it has to belong to somebody, and that somebody has to be able to come back to it from another device.

**How login and the back end are split.** Supabase Auth only does the login: email and password, and "Continue with Google". Everything the app actually produces (the activity bank, the completed activities and the progress) lives on a back end I wrote myself, an Express and PostgreSQL API with hand-written RESTful routes and parameterized queries. In simple terms, Supabase only ever answers "who is this", and never "what did they do". My API checks the login token on every request that touches personal data.

## State: what data does the app hold?

| Data | Shape (rough) | Who owns it | Changes when... |
| --- | --- | --- | --- |
| session | `{ id, email, displayName } \| null` | `App`, set by Supabase Auth. Read by the header and the Home greeting, and used to decide which screens are open | the user signs in, signs out, or the session expires |
| activities | `[{ id, name, category, duration, difficulty, description, proofType, proofPrompt }]` | `App` | fetched from the API once after signing in |
| selectedTime | `'under5' \| '5to10'` | `App`, set on Home | the user picks a time |
| selectedEnergy | `'low' \| 'someEffort'` | `App`, set on Home | the user picks an energy level |
| matches | list of activities | `App` | the user taps Find an activity. "Show another" picks a different one from this list without asking the server again |
| currentActivity | one activity or `null` | `App`, read by both `SuggestionPage` and `ProofPage` | the user chooses to do the activity, or taps "Show another" |
| proofInput | `string \| File \| null` | `ProofPage` | the user types a line or picks a photo. It is cleared after submitting |
| completedActivities | `[{ activityId, completedAt }]` | `App`, but the data comes from my API and is stored in PostgreSQL under the user's id | the user submits proof and marks the activity done |

Two changes happened along the way. After sketching the wireframes I moved `currentActivity` up from the Suggestion screen to `App`, because the Proof screen has to read the same activity. And in week 2, `completedActivities` stopped being an in-memory array. With accounts, it has to be saved with the user's id so it is still there the next time they sign in, even on another device.

The proof itself is shown once and is not stored. Only the activity and the date are saved.

## What each screen contains

**Activity Suggestion** (the most important screen)

1. A short heading, "Here's something for you...".
2. The activity card: name, category tag, duration, difficulty badge and description.
3. An action row with "Do this" and "Show another".

**Proof / Mark Complete**

1. An activity reminder (a compact card) so the user doesn't have to go back.
2. The proof input, depending on `proofType`: a text field with its prompt, or a photo picker with its own prompt.
3. A "Mark Complete" button, disabled until there is a typed answer or a photo.
4. A short confirmation after submitting, then an automatic return to Home.

**Login**

1. The logo, a welcome line and a short tagline.
2. Email and password fields, with a toggle between "Sign in" and "Create an account".
3. A "Continue with Google" button.
4. An inline error line for bad credentials or a failed Google sign-in.

## Content I needed to gather

- An activity bank with a name, category, duration, difficulty, description and a proof type and prompt, covering both low-effort and some-effort activities in both time ranges. I drafted 16 and reviewed them in week 2, when number 2 was swapped for "Read one chapter off a book". These 16 are what the database is loaded with.
- Short copy for the empty and encouraging states, such as the Progress screen when nothing is logged yet and the "Nice work" message after finishing an activity.
- A logo and a favicon.
- A Supabase project (URL and anon key) with the email and Google providers turned on.

## One risk

The part I was least sure about was the required proof step: switching the input between a text field and a photo picker depending on the activity, previewing a photo without saving it anywhere, and keeping Mark Complete disabled until real proof is given. I had never built a file input in React, so the plan was to get the text path working end to end first and add the photo picker as its own small piece.

**A second, newer risk from week 2:** connecting Supabase Auth for the first time, which meant the session state, protecting the screens behind login, handling the Google redirect, and making every call to my own API scope its data to the signed-in user.

**How it turned out.** The text and photo proof both work, but a photo is only previewed on screen and is never stored. The login risk was the harder one. My API has to check the token itself, and the Google sign-in redirect had to be fixed once the site moved to GitHub Pages, where it lives under `/3-Steps/` and not at the root.
