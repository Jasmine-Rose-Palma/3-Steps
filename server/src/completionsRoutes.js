import express from 'express'
import { getById } from './activitiesRepo.js'
import { addCompletion, listCompletions } from './completionsRepo.js'
import { createRequireUser } from './auth.js'

export function completionsRouter(pool, verifyToken) {
  const router = express.Router()
  router.use(createRequireUser(verifyToken))

  router.post('/', async (req, res) => {
    const { activityId } = req.body ?? {}
    if (!Number.isInteger(activityId) || activityId <= 0) {
      return res.status(400).json({error: 'activityId must be a whole number greater than 0'})
    }
    const activity = await getById(pool, activityId)
    if (!activity) {
      return res.status(404).json({error: 'Activity not found'})
    }
    const newCompletion = await addCompletion(pool, req.userId, activityId)
    res.status(201).json(newCompletion)
  })

  router.get('/', async (req, res) => {
    const completion = await listCompletions(pool, req.userId)
    res.status(200).json(completion)
  })

  return router
}
