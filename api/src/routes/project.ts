import { Router } from 'express'
import * as ctrl from '../controllers/issuesController.js'
import * as decisionsCtrl from '../controllers/decisionsController.js'
import * as docsCtrl from '../controllers/projectDocumentationController.js'

export const projectRoutes = Router()

projectRoutes.get('/:id', ctrl.getProjectIssues)
projectRoutes.get('/:projectId/documentation', docsCtrl.getProjectDocumentation)
projectRoutes.patch(
  '/:projectId/documentation',
  docsCtrl.patchProjectDocumentation
)
projectRoutes.get('/:projectId/decisions', decisionsCtrl.listProjectDecisions)
projectRoutes.post('/:projectId/decisions', decisionsCtrl.createProjectDecision)
projectRoutes.patch(
  '/:projectId/decisions/:decisionId',
  decisionsCtrl.updateProjectDecision
)
projectRoutes.delete(
  '/:projectId/decisions/:decisionId',
  decisionsCtrl.deleteProjectDecision
)
