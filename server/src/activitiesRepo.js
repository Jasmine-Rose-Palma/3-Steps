import { activities as starterActivities } from './data/activities.js'

function rowToActivity(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    duration: row.duration,
    difficulty: row.difficulty,
    description: row.description,
    proofType: row.proof_type,
    proofPrompt: row.proof_prompt,
  }
}

export async function createSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS activities (
      id           SERIAL PRIMARY KEY,
      name         TEXT NOT NULL,
      category     TEXT NOT NULL,
      duration     TEXT NOT NULL,
      max_minutes  INTEGER NOT NULL,
      difficulty   TEXT NOT NULL,
      description  TEXT NOT NULL,
      proof_type   TEXT NOT NULL,
      proof_prompt TEXT NOT NULL
    )
  `)
}

export async function seedActivities(pool, list = starterActivities) {
  for (const a of list) {
    await pool.query(
      `INSERT INTO activities
         (name, category, duration, max_minutes, difficulty, description, proof_type, proof_prompt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [a.name, a.category, a.duration, a.maxMinutes, a.difficulty, a.description, a.proofType, a.proofPrompt]
    )
  }
}

export async function getById(pool, id) {
  const { rows } = await pool.query(`
    SELECT * FROM activities
    WHERE id = $1`,
    [id]
  )
  if (rows.length === 0) {
    return null
  }
  return rowToActivity(rows[0])
}

export async function getAll(pool, { time, energy } = {}) {
  const conditions = []
  const values = []

  if (time === 'under5') {
    conditions.push('max_minutes < 5')
  } else if (time === '5to10') {
    conditions.push('max_minutes >= 5 AND max_minutes <= 10')
  }
  
  if (energy) {
    values.push(energy)
    conditions.push(`difficulty = $${values.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const { rows } = await pool.query(`
    SELECT * FROM activities
    ${whereClause}
    ORDER BY id`,
    values
  )
  return rows.map(rowToActivity)
}
