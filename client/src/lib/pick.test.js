import { describe, it, expect, vi, afterEach } from 'vitest'
import { pickRandom } from './pick.js'

afterEach(() => vi.restoreAllMocks())

describe('pickRandom', () => {
  it('returns null for an empty list', () => {
    expect(pickRandom([])).toBeNull()
  })

  it('picks by Math.random', () => {
    const list = [{ id: 1 }, { id: 2 }, { id: 3 }]
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    expect(pickRandom(list)).toEqual({ id: 3 })
    Math.random.mockReturnValue(0)
    expect(pickRandom(list)).toEqual({ id: 1 })
  })

  it('never repeats the excluded id when there is another choice', () => {
    const list = [{ id: 1 }, { id: 2 }]
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(pickRandom(list, 1)).toEqual({ id: 2 })
  })

  it('falls back to the only match rather than returning nothing', () => {
    expect(pickRandom([{ id: 1 }], 1)).toEqual({ id: 1 })
  })
})
