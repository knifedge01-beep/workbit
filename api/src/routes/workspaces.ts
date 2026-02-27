import { Router } from 'express'
import * as ctrl from '../controllers/workspacesController.js'

export const workspacesRoutes = Router()

workspacesRoutes.get('/', ctrl.getWorkspaces)
workspacesRoutes.post('/', ctrl.createWorkspace)
