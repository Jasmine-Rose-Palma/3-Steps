import { createSchema, seedActivities } from './activitiesRepo.js'
import { createCompletionsSchema } from './completionsRepo.js'

async function countActivities(pool) {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM activities')
  return rows[0].n
}

export async function setupDatabase(pool) {
  await createSchema(pool)
  await createCompletionsSchema(pool)
  let count = await countActivities(pool)
  if (count === 0) {
    await seedActivities(pool)
    count = await countActivities(pool)
  }
  return count
}
