import { Router } from 'express'
import * as ctrl from '../controllers/issuesController.js'

export const issuesRoutes = Router()

issuesRoutes.post('/', ctrl.createIssue)
issuesRoutes.get('/:issueId', ctrl.getIssue)
issuesRoutes.get('/:issueId/sub-issues', ctrl.getSubIssues)
issuesRoutes.post('/:issueId/sub-issues/generate', ctrl.generateSubIssues)
issuesRoutes.patch('/:issueId', ctrl.updateIssue)
issuesRoutes.get('/:issueId/comments', ctrl.getIssueComments)
issuesRoutes.post('/:issueId/comments', ctrl.postIssueComment)
