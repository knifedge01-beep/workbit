import { Router } from 'express';
import * as ctrl from '../controllers/issuesController.js';

export const issuesRoutes = Router();

issuesRoutes.patch('/:issueId', ctrl.updateIssue);
