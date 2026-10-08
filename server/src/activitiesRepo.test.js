import { describe, it, expect, beforeEach } from 'vitest'
import { newDb } from 'pg-mem'
import { createSchema, seedActivities, getById, getAll } from './activitiesRepo.js'

// Each test gets a fresh in-memory Postgres, seeded with the 16 activities.
// No real database is needed to run these tests.
let pool
beforeEach(async () => {
  const db = newDb()
  const { Pool } = db.adapters.createPg()
  pool = new Pool()
  await createSchema(pool)
  await seedActivities(pool)
})

// Helper: just the ids, so the expectations below are easy to read.
const ids = (list) => list.map((a) => a.id)

describe('Setup (provided - these should already pass)', () => {
  it('seedActivities loads all 16 activities', async () => {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM activities')
    expect(rows[0].n).toBe(16)
  })
})

describe('TODO 1: getById', () => {
  it('returns the matching activity in the camelCase shape', async () => {
    const a = await getById(pool, 1)
    expect(a).toEqual({
      id: 1,
      name: 'Stretch it out',
      category: 'Physical',
      duration: '3 min',
      difficulty: 'low',
      description: 'Reach for the ceiling, touch your toes, roll your shoulders a few times.',
      proofType: 'text',
      proofPrompt: 'How did your body feel after?',
    })
  })

  it('returns null for an id that does not exist', async () => {
    expect(await getById(pool, 1)).not.toBeNull() // a real id must work first
    expect(await getById(pool, 9999)).toBeNull()
  })
})

describe('TODO 2: getAll', () => {
  it('with no filters returns every activity, in id order', async () => {
    const all = await getAll(pool)
    expect(ids(all)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
  })

  it("time 'under5' returns only activities shorter than 5 minutes", async () => {
    expect(ids(await getAll(pool, { time: 'under5' }))).toEqual([1, 4, 5, 6, 7, 9, 13])
  })

  it("time '5to10' returns activities from 5 up to 10 minutes", async () => {
    expect(ids(await getAll(pool, { time: '5to10' }))).toEqual([2, 3, 8, 10, 11, 12, 14, 15, 16])
  })

  it("energy 'low' returns only low-effort activities", async () => {
    expect(ids(await getAll(pool, { energy: 'low' }))).toEqual([1, 3, 4, 5, 6, 7, 8, 9])
  })

  it("energy 'someEffort' returns only some-effort activities", async () => {
    expect(ids(await getAll(pool, { energy: 'someEffort' }))).toEqual([2, 10, 11, 12, 13, 14, 15, 16])
  })

  it('applies time and energy together', async () => {
    expect(ids(await getAll(pool, { time: 'under5', energy: 'someEffort' }))).toEqual([13])
    expect(ids(await getAll(pool, { time: '5to10', energy: 'low' }))).toEqual([3, 8])
  })

  it('is safe from SQL injection (energy must be a $1 placeholder, not pasted into the SQL)', async () => {
    expect(await getAll(pool, { energy: 'low' })).toHaveLength(8) // a real filter must work first
    const result = await getAll(pool, { energy: "low' OR '1'='1" })
    expect(result).toEqual([])
  })
})
