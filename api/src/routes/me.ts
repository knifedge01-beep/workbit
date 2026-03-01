import { Router } from 'express'
import * as ctrl from '../controllers/meController.js'

export const meRoutes = Router()

meRoutes.get('/member', ctrl.getMember)
meRoutes.get('/teams', ctrl.getTeams)
meRoutes.get('/issues', ctrl.getMyIssues)
meRoutes.get('/notifications', ctrl.getNotifications)
