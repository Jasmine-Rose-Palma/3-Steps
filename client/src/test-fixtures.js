export const stretch = {
  id: 1,
  name: 'Stretch it out',
  category: 'Physical',
  duration: '3 min',
  difficulty: 'low',
  description: 'Reach for the ceiling, touch your toes, roll your shoulders a few times.',
  proofType: 'text',
  proofPrompt: 'How did your body feel after?',
}

export const tidy = {
  id: 3,
  name: 'Tidy one surface',
  category: 'Tidying',
  duration: '5 min',
  difficulty: 'low',
  description: 'Clear off your desk, nightstand, or one shelf.',
  proofType: 'photo',
  proofPrompt: 'Snap a photo of the cleared surface.',
}

export const walk = {
  id: 11,
  name: 'Quick walk around the block',
  category: 'Physical',
  duration: '8-10 min',
  difficulty: 'someEffort',
  description: 'Step outside and walk a short loop.',
  proofType: 'text',
  proofPrompt: "What's one thing you noticed on your walk?",
}

export const allActivities = [stretch, tidy, walk]

export const completion = (id, activityId, completedAt = '2026-10-03T12:00:00.000Z') => ({
  id,
  activityId,
  completedAt,
})

export const sessionFixture = { id: 'user-1', email: 'jas@example.com', displayName: 'jas' }

import { vi } from 'vitest'
export function makeApi(overrides = {}) {
  return {
    getActivities: vi.fn(async () => allActivities),
    getCompletions: vi.fn(async () => []),
    addCompletion: vi.fn(async (activityId) => completion(99, activityId)),
    ...overrides,
  }
}

export function makeAuth(initial = null, overrides = {}) {
  let listener = null
  const auth = {
    onChange: vi.fn((callback) => {
      listener = callback
      callback(initial)
      return () => {
        listener = null
      }
    }),
    getToken: vi.fn(async () => 'token'),
    signIn: vi.fn(async () => {}),
    signUp: vi.fn(async () => ({ needsConfirmation: false })),
    signInWithGoogle: vi.fn(async () => {}),
    signOut: vi.fn(async () => {}),
    emit: (session) => listener?.(session),
    ...overrides,
  }
  return auth
}
