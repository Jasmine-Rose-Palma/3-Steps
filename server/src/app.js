import express from 'express'
import { getAll, getById } from './activitiesRepo.js'
import { completionsRouter } from './completionsRoutes.js'
import { defaultVerifyToken } from './auth.js'

const TIMES = ['under5', '5to10']
const ENERGIES = ['low', 'someEffort']

export function createApp(pool, { verifyToken = defaultVerifyToken } = {}) {
  const app = express()
  app.use(express.json())

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.get('/activities', async (req, res) => {
    const {time, energy} = req.query

    if (time && !TIMES.includes(time)) {
      return res.status(400).json({error: 'time must be one of: ' + TIMES.join(',')})
    }
    if (energy && !ENERGIES.includes(energy)) {
      return res.status(400).json({error: 'energy must be one of: ' + ENERGIES.join(',')})
    }
    res.status(200).json(await getAll(pool, {time, energy}))
  })

  app.get('/activities/:id', async (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({error: 'id must be a whole number greater than 0'})
    }

    const activity = await getById(pool, id)
    if (!activity) {
      return res.status(404).json({error: 'activity not found'})
    }
    res.status(200).json(activity)
  })

  app.use('/completions', completionsRouter(pool, verifyToken))

  app.use((req, res) => res.status(404).json({ error: 'Not found' }))

  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  })

  return app
}
