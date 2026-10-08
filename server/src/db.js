import pg from 'pg'

const { Pool } = pg

export function createPool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL environment variable')
  }
  return new Pool({connectionString})
}
