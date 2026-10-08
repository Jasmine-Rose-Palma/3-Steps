import { createApp } from './app.js'

export function startServer(pool, port) {
  const app = createApp(pool)
  return app.listen(port)
}
