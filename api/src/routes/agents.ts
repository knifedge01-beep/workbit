import { Router } from 'express'
import * as ctrl from '../controllers/agentsController.js'

export const agentsRoutes = Router()

agentsRoutes.post('/run', ctrl.postAgentRun)
