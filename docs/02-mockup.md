# 2. Mockup: wireframes and components

This is what the app looks like and how it breaks into components. I drew these as boxes and labels first, and then updated them after the screens were built and I compared them side by side with the running app.

## Screen map

```
Before everything:
[Login] --"sign in / create account / Continue with Google"--> [Home]
Signed-out visitors are always sent to Login. "Logout" in the header returns to Login.

Main flow:
[Home] --"pick time + energy, tap Find an activity"--> [Activity Suggestion]
                                                             |     ^
                                                  "tap Do this"    |  "tap Show another"
                                                             v     |  (loops back to itself, new activity)
                                                   [Proof / Mark Complete]
                                                             |
                                       "submit proof -> confirmation, auto-return"
                                                             v
                                                          [Home]

Header, present on all four signed-in screens:
[Home] <--"logo" / "Progress"--> [Progress]
```

The first screen is Login, and after signing in it is Home. Home is the home base: every flow ends there, and the logo in the header always leads back to it. There are no dead ends. The header is on every signed-in screen, so even in the middle of a flow (Suggestion or Proof) the user can leave for Home, check Progress, or log out.

## Box sketches at two widths

| Screen | Desktop layout | Phone layout | Goes to |
| --- | --- | --- | --- |
| **Login** | No header. The logo and "Welcome to 3 Steps!" with a tagline above a centered tan card: "Sign-in" heading, Email, Password, an error line when needed, a filled accent "Sign in" button, a "Continue with Google" button, and an outline "Create an account" button. | The same single column. The card goes full width with 16px side padding. Nothing stacks differently, since the card is already one column. | Home |
| **Home** | Header at the top. Below it, a greeting ("Hi, name!") and the big line "What do you feel like doing today...". Then "How much time do you have?" and "How much energy do you have?" selectors **side by side**, and a full-width "Find an activity" button underneath. | The header stays. The two selector groups **stack vertically**. The button stays full width. | Activity Suggestion (button), Progress (header) |
| **Activity Suggestion** | Header, then the heading "Here's something for you...", then a centered activity card: name, a row of tag, duration and difficulty badges **side by side**, the description, then "Do this" and "Show another" **side by side**. | The card is full width. The badges row wraps to two lines if it doesn't fit. The two buttons **stack**, with "Do this" on top. | Proof (Do this), itself with a new activity (Show another), Home or Progress (header) |
| **Proof / Mark Complete** | Header, the heading "Show what you did", a compact activity reminder (name and badges, no description), then the proof input: a text field or a photo picker with a preview, depending on the activity. Then "Mark Complete", disabled until filled. After submitting, the input is replaced by a short confirmation line. | The same order, all full width. The photo preview scales down to the screen width. | Home (automatically after the confirmation), Home or Progress (header) |
| **Progress** | Header, the heading "Your little wins", a stat line ("X activities completed"), then a **two-column** grid of finished activities (name, tag and badges, date). | The grid collapses to a **single column**. | Home (header) |

The one breakpoint is 600px. The phone sketches were drawn at 390px and the desktop sketches at 1280px.

## Component tree

| Level | What it is | Components |
| --- | --- | --- |
| **Atoms** | the smallest pieces | `Button`, `Tag` (category), `Badge` (duration, difficulty), `TextField` (single line or multiline), `Heading` |
| **Molecules** | small groups of atoms | `SelectorGroup` (a labeled row of toggle buttons, used for both the time and the energy picker), `ActivityMeta` (a `Tag` and two `Badge`s in a row), `PhotoPicker` (file input with a preview), `HistoryItem` (activity name, `ActivityMeta` and the date, one row for Progress) |
| **Organisms** | whole sections | `Header` (logo, Progress and Logout buttons, on all four signed-in screens), `ActivityCard` (name, `ActivityMeta` and description; a `compact` prop hides the description so the same card is the reminder on the Proof screen), `ProofForm` (a `TextField` or a `PhotoPicker` depending on `proofType`, plus the Mark Complete button), `HistoryList` (a list of `HistoryItem`s) |
| **Layout** | the frame around every signed-in screen | `PageLayout` (the `Header` and a `<main>` column) |
| **Pages** | the screens | `LoginPage`, `HomePage`, `SuggestionPage`, `ProofPage`, `ProgressPage` |

A component that repeats is a real component, and a level only uses the levels below it. `Header` appears on four pages. `ActivityCard` repeats in two forms: full on Suggestion, and `compact` on Proof, as one component with one prop instead of two near-duplicates. `ActivityMeta` repeats inside both `ActivityCard` and `HistoryItem`. `Button` is used on every screen.

## Sanity check

I walked through the one most important task: pick time and energy, get an activity, do it, submit proof, see it logged.

1. Login, then Home. `App` owns `session`, `selectedTime` and `selectedEnergy`.
2. Activity Suggestion reads `activities` and needs `currentActivity`.
3. Proof reads the **same** `currentActivity` to know the activity and its `proofType` and `proofPrompt`, and owns `proofInput`.
4. The confirmation returns to Home.
5. Progress reads `completedActivities` and looks up each activity's name and category from `activities` by `activityId`.

No forgotten screens and no dead ends. The walkthrough did catch one mistake in my proposal, wherein I had given `currentActivity` to the Suggestion screen alone, but the Proof screen needs it too. It moved up to `App`, and the proposal was changed to match.

## What changed after building

- Login was added as the fifth screen in week 2, and the header gained a Logout button.
- `matches`, the list the last search returned, was added to `App`, so "Show another" can pick a different activity without asking the server again.
- My first built screens did not match these sketches. Spacing, sizes and fonts were off on Home, Activity, Completion and Login. I put the running app next to the wireframes and had those screens redone until they matched.
- The header shows the logo and not a text title.
