import { Router } from 'express'
import * as ctrl from '../controllers/chatController.js'

export const chatRoutes = Router()

chatRoutes.post('/', ctrl.postChat)
