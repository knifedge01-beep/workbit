import { Router } from 'express'
import * as ctrl from '../controllers/issuesController.js'

export const projectRoutes = Router()

projectRoutes.get('/:id', ctrl.getProjectIssues)
