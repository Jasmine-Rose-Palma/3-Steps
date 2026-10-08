function rowToCompletion(row) {
  return {
    id: row.id,
    activityId: row.activity_id,
    completedAt: row.completed_at,
  }
}

export async function createCompletionsSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS completions (
      id           SERIAL PRIMARY KEY,
      user_id      TEXT NOT NULL,
      activity_id  INTEGER NOT NULL REFERENCES activities(id),
      completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
}

export async function addCompletion(pool, userId, activityId) {
  const { rows } = await pool.query(`
    INSERT INTO completions (user_id, activity_id)
    VALUES ($1, $2)
    RETURNING *`,
    [userId, activityId]
  )
  return rowToCompletion(rows[0])
}

export async function listCompletions(pool, userId) {
  const { rows } = await pool.query(`
    SELECT * FROM completions
    WHERE user_id = $1
    ORDER BY completed_at DESC, id DESC`,
    [userId]
  )
  return rows.map(rowToCompletion)
}
