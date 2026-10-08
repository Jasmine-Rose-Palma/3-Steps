import { createPool } from './db.js'
import { setupDatabase } from './setupDb.js'

let pool
try {
  pool = createPool()
  const count = await setupDatabase(pool)
  console.log(`Database ready: ${count} activities.`)
} catch (err) {
  console.error(`Could not set up the database: ${err.message}`)
  process.exitCode = 1
} finally {
  await pool?.end()
}
