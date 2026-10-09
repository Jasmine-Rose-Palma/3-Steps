# Demo video

**Link:** https://drive.google.com/file/d/1j7ORnrtF1igjwod5-1fb2tZQvgfH5KR1/view?usp=sharing 

## My plan

**1. Thirty seconds: what it is and who it is for.** I start on the live site's login screen, not on a slide. I say that 3 Steps is for someone like me, who reaches for their phone to scroll when they have a few free minutes and no energy for anything big. It gives them one small activity that fits their time and energy, and asks for proof that they did it.

**2. Two to three minutes: the main flow, on the deployed site.** I sign in with a demo account that already has a few finished activities. Then:

1. On Home I pick **under 5 minutes** and **low-effort**. The Find an activity button stays locked until both are chosen.
2. I get one suggestion, tap **Show another** once to show it picks a different one, then tap **Do this**.
3. On the proof screen I give the proof (a typed line for a text activity), and Mark Complete only unlocks once there is an answer.
4. The app returns me to Home. I open **Progress** and show the new activity at the top of the list with the count going up.
5. I click sign out and show that it brings me back to the Login screen

**3. Thirty seconds: the thing I am proud of.** I open `server/src/auth.js` and then `server/src/completionsRepo.js`. The point I want to make is that Supabase only answers who the user is. My own API checks the token, takes the user id from it, and the SQL query itself only reads that user's rows, so nobody can see anyone else's progress by changing a request. I wrote the route protection and the queries myself. The part that checks the token's signature with the `jose` library was written by Claude, and I say so in the video.

**4. Thirty seconds: what I would do differently.** The photo proof is only previewed on the screen and the typed line is not kept, so Progress shows that I did something but not what I did. I would like to store the proof next time. I would also tell the user when the free-plan API is waking up, and limit how often one person can call it.

## Before I record

- [ ] Open the site five minutes early so the free-tier API on Render is awake
- [ ] Record the **deployed** URL, not `localhost`
- [ ] Use a demo account with an invented email. Home says "Hi, " followed by a name taken from the email or the Google profile, so a Google account would show my real name on screen
- [ ] Finish three or four activities on the demo account first, so Progress is not empty
- [ ] Close my other tabs. Check for personal messages, other students' names, and any `.env` file open in an editor
- [ ] Do a full practice run. If something breaks, I stop and start again.

## Fallback

If the live site is down or the API is slow on the day, I use a recording of the working app, and if that fails, screenshots of the five screens. If something fails during the recording, I say that it is the recording, and what went wrong, rather than hiding it.
