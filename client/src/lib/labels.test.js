import { describe, it, expect } from 'vitest'
import { difficultyLabel, formatCompletedDate, TIME_OPTIONS, ENERGY_OPTIONS } from './labels.js'

describe('labels', () => {
  it('uses the exact values the API accepts', () => {
    expect(TIME_OPTIONS.map((o) => o.value)).toEqual(['under5', '5to10'])
    expect(ENERGY_OPTIONS.map((o) => o.value)).toEqual(['low', 'someEffort'])
  })

  it('turns API difficulty values into screen wording', () => {
    expect(difficultyLabel('low')).toBe('Low-effort')
    expect(difficultyLabel('someEffort')).toBe('A bit of effort')
  })

  it('formats a completed date, and returns nothing for a bad one', () => {
    expect(formatCompletedDate('2026-10-03T12:00:00.000Z')).toMatch(/Oct 3, 2026/)
    expect(formatCompletedDate('not a date')).toBe('')
  })
})
