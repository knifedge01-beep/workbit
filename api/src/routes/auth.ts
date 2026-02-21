import { Router } from 'express';
import * as ctrl from '../controllers/authController.js';

export const authRoutes = Router();

authRoutes.post('/login', ctrl.login);
