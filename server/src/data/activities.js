// 3 STEPS - ACTIVITY BANK

//   duration    - the label shown to the user, e.g. "8-10 min"
//   maxMinutes  - the upper end of that label as a number, used for filtering:
//                 time "under5" means maxMinutes < 5
//                 time "5to10"  means maxMinutes from 5 up to 10
//   difficulty  - 'low' (Low-effort) or 'someEffort' (Some effort), the same
//                 two values the Home screen's energy picker uses
//   proofType   - 'text' or 'photo'

export const activities = [
  { name: 'Stretch it out', category: 'Physical', duration: '3 min', maxMinutes: 3, difficulty: 'low', description: 'Reach for the ceiling, touch your toes, roll your shoulders a few times.', proofType: 'text', proofPrompt: 'How did your body feel after?' },
  { name: 'Read one chapter off a book', category: 'Learning', duration: '10 min', maxMinutes: 10, difficulty: 'someEffort', description: "Pick up the book you're currently reading and read one chapter.", proofType: 'text', proofPrompt: 'Paste your favorite sentence or line from the chapter.' },
  { name: 'Tidy one surface', category: 'Tidying', duration: '5 min', maxMinutes: 5, difficulty: 'low', description: 'Clear off your desk, nightstand, or one shelf.', proofType: 'photo', proofPrompt: 'Snap a photo of the cleared surface.' },
  { name: 'Water the plants', category: 'Tidying', duration: '3 min', maxMinutes: 3, difficulty: 'low', description: 'Check on and water any plants nearby.', proofType: 'photo', proofPrompt: 'Snap a photo of your watered plant.' },
  { name: 'Send a "thinking of you" text', category: 'Social', duration: '2 min', maxMinutes: 2, difficulty: 'low', description: "Message someone you haven't talked to in a while.", proofType: 'text', proofPrompt: 'Who did you message, or paste what you sent.' },
  { name: 'Write 3 gratitudes', category: 'Mindfulness', duration: '3 min', maxMinutes: 3, difficulty: 'low', description: 'Jot down three small good things from today.', proofType: 'text', proofPrompt: 'Type your three things.' },
  { name: 'Box breathing', category: 'Mindfulness', duration: '2 min', maxMinutes: 2, difficulty: 'low', description: '4 counts in, 4 hold, 4 out, 4 hold - repeat for 2 minutes.', proofType: 'text', proofPrompt: 'How do you feel now compared to before?' },
  { name: 'Doodle for 5 minutes', category: 'Creative', duration: '5 min', maxMinutes: 5, difficulty: 'low', description: 'Grab any pen and paper and draw whatever comes to mind, no pressure.', proofType: 'photo', proofPrompt: 'Snap a photo of your doodle.' },
  { name: 'Learn one new word', category: 'Learning', duration: '3 min', maxMinutes: 3, difficulty: 'low', description: "Look up a word you don't know and use it in a sentence.", proofType: 'text', proofPrompt: 'What word did you learn, and what does it mean?' },
  { name: 'Fold one pile of laundry', category: 'Tidying', duration: '8 min', maxMinutes: 8, difficulty: 'someEffort', description: 'Fold and put away one basket or pile of clothes.', proofType: 'photo', proofPrompt: 'Snap a photo of the folded, put-away pile.' },
  { name: 'Quick walk around the block', category: 'Physical', duration: '8-10 min', maxMinutes: 10, difficulty: 'someEffort', description: 'Step outside and walk a short loop.', proofType: 'text', proofPrompt: "What's one thing you noticed on your walk?" },
  { name: 'Clear the sink', category: 'Tidying', duration: '8 min', maxMinutes: 8, difficulty: 'someEffort', description: 'Wash whatever dishes have piled up.', proofType: 'photo', proofPrompt: 'Snap a photo of the cleared sink.' },
  { name: 'Quick bodyweight round', category: 'Physical', duration: '3 min', maxMinutes: 3, difficulty: 'someEffort', description: '10 push-ups, squats, or a similar quick set.', proofType: 'text', proofPrompt: 'What did you do, and how many reps?' },
  { name: 'Reorganize one drawer', category: 'Tidying', duration: '8 min', maxMinutes: 8, difficulty: 'someEffort', description: 'Sort and straighten one messy drawer.', proofType: 'photo', proofPrompt: 'Snap a photo of the organized drawer.' },
  { name: 'Free-write for 5 minutes', category: 'Creative', duration: '5 min', maxMinutes: 5, difficulty: 'someEffort', description: "Write whatever's on your mind, no editing, just get it out.", proofType: 'text', proofPrompt: 'Paste one line from what you wrote.' },
  { name: "Plan tomorrow's top 3", category: 'Planning', duration: '5 min', maxMinutes: 5, difficulty: 'someEffort', description: 'Write down the three things you most want to get done tomorrow.', proofType: 'text', proofPrompt: "What are tomorrow's top 3?" },
]
