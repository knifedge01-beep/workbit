import { Router } from 'express';
import * as ctrl from '../controllers/workspaceController.js';

export const workspaceRoutes = Router();

workspaceRoutes.get('/projects', ctrl.getProjects);
workspaceRoutes.get('/teams', ctrl.getTeams);
workspaceRoutes.get('/members', ctrl.getMembers);
workspaceRoutes.post('/members/invite', ctrl.inviteMember);
workspaceRoutes.get('/views', ctrl.getViews);
workspaceRoutes.get('/roles', ctrl.getRoles);
