import { createPool } from './db.js'
import { startServer } from './server.js'

const port = process.env.PORT || 3000

function fail(err) {
  console.error(`Could not start the server: ${err.message}`)
  process.exit(1)
}

try {
  const pool = createPool()
  const server = startServer(pool, port)
  server.on('listening', () => {
    console.log(`API listening on http://localhost:${port}`)
  })
  server.on('error', fail)
} catch (err) {
  fail(err)
}
