# Security and privacy checklist

I worked through the security checks thoroughly before making the repository public, and again before submitting (October 9, 2026). The repository is public, in my own account, and permanent, which is why this file exists.

## Before the first push

- [x] `.gitignore` includes `.env`, and `git check-ignore -v` confirms it. I ran it on `server/.env`, `client/.env` and `server/.env.production`, and all three came back matched by a rule in `.gitignore`.
- [x] `git ls-files | Select-String -Pattern "\.env$|\.pem$|id_rsa"` prints nothing.
- [x] `.env.example` is committed in both `server/` and `client/`, with placeholder values only.
- [x] No connection string, key or password anywhere in the repository, including in a screenshot. I searched the whole project for `postgres://`, `neon.tech`, `eyJ` and the start of my database password. The only matches were placeholders in the examples and the docs.
- [x] No `student.json`, and no name, student number or email of mine or anyone else's. The only place my name appears is my GitHub username in links.

## The application

- [x] Every SQL query is parameterised. Values go in the array (`$1`, `$2`) and never into the string. The activities filter builds its `WHERE` part only from fixed text and `$n` placeholders.
- [x] Input is validated on the server, not only in React. `time` and `energy` are checked against a list of allowed values, and `id` and `activityId` must be whole numbers above 0, otherwise the API answers 400. Length limits on text fields do not apply, because the app does not store any typed text.
- [x] `cors({ origin: allowedOrigins })` names my own site, which comes from the `CORS_ORIGINS` setting. It is not `cors()` with no options.
- [x] `NODE_ENV=production` on Render, and the error handler only answers "Something went wrong", with no stack trace in the response.
- [x] `helmet` is installed and used.
- [ ] Anything that costs money or accepts a password is rate limited. **Not done.** See the journal paragraph below.
- [x] Passwords: not applicable to my own code. Supabase Auth takes and hashes them, so my API never sees or logs a password.
- [x] Every route that touches somebody's data has the ownership check in the query. `listCompletions` uses `WHERE user_id = $1`, and the user id comes from the verified login token, not from the request.
- [x] `npm audit` was run in `server/` and in `client/`, and both said "found 0 vulnerabilities".

## Privacy

- [x] No real classmates' names, numbers, emails or photos, anywhere. Not in the seed data, not in the screenshots and not in the demo video.
- [x] The seed data is invented. It is 16 activities I wrote.
- [x] The test data was cleaned up. Test completions and test accounts were deleted before I submitted, apart from my own.
- [x] The README says what the app collects. It explains that the proof (the typed line or the photo) is only checked on screen and is not stored, that the login keeps an email address (and a name, for Google sign-in) with Supabase, and that my own database saves only the account's id, the activity and the date.
- [x] Any face in a screenshot is stock, generated, or mine. There are none.

The app collects very little: an email address (kept by Supabase for the login), and, for each finished activity, which activity it was and when. If it ever handled more than that about real people, the Philippine Data Privacy Act would apply in full, so I kept it to the minimum on purpose.

## Journal

The riskiest thing about my project is that it has real logins, so there are two ways to get hurt. First, showing someone's progress to the wrong person, and leaking my own database password in a public repository. For the first one, I made sure the user id never comes from the request. It comes from the login token that my API checks, and every query that touches progress has parameterized `WHERE user_id = $1` in it, so changing a request cannot get someone else's data. Second, my `.env` files are ignored, and I checked it twice with `git check-ignore`. I also searched the whole project for anything that looked like a key or a connection string.

What I knowingly left out is rate limiting. Anyone could call my API as often as they want. Everything is on free plans, so it would not cost me money, but it could make the API slow or push it over its limit. I also chose not to store the proof, the typed line or the photo. That was partly a limit of how far I got, but it also means there is less private stuff to protect. If I added storage later, I would have to rethink these security measures again.
