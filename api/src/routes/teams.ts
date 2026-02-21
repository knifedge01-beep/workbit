import { Router } from 'express';
import * as teamsCtrl from '../controllers/teamsController.js';
import * as issuesCtrl from '../controllers/issuesController.js';

export const teamsRoutes = Router();

teamsRoutes.get('/:teamId', teamsCtrl.getTeam);
teamsRoutes.get('/:teamId/project', teamsCtrl.getTeamProject);
teamsRoutes.get('/:teamId/project/updates/:updateId/comments', teamsCtrl.getStatusUpdateComments);
teamsRoutes.post('/:teamId/project/updates', teamsCtrl.postStatusUpdate);
teamsRoutes.post('/:teamId/project/updates/:updateId/comments', teamsCtrl.postStatusUpdateComment);
teamsRoutes.patch('/:teamId/project', teamsCtrl.patchProject);
teamsRoutes.post('/:teamId/project/milestones', teamsCtrl.postMilestone);
teamsRoutes.patch('/:teamId/project/milestones/:milestoneId', teamsCtrl.patchMilestone);
teamsRoutes.get('/:teamId/views', teamsCtrl.getTeamViews);
teamsRoutes.get('/:teamId/logs', teamsCtrl.getTeamLogs);
teamsRoutes.get('/:teamId/issues', issuesCtrl.getTeamIssues);
