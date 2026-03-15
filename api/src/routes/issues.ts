import { Router } from 'express'
import * as ctrl from '../controllers/issuesController.js'

export const issuesRoutes = Router()

issuesRoutes.post('/', ctrl.createIssue)
issuesRoutes.get('/:issueId', ctrl.getIssue)
issuesRoutes.patch('/:issueId', ctrl.updateIssue)
issuesRoutes.get('/:issueId/comments', ctrl.getIssueComments)
issuesRoutes.post('/:issueId/comments', ctrl.postIssueComment)
