// src/routes/analyticsRoutes.js
import { Router } from 'express';
import {
  createSessionController,
  trackEventController,
  getTeacherAnalyticsController,
  getUserJourneyController,
  getAllSessionsController,
} from '../controllers/analyticsControllers.js';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

// Публічні ендпоінти (без автентифікації) - для фронтенду
router.post('/session', ctrlWrapper(createSessionController));
router.post('/event', ctrlWrapper(trackEventController));

// Для викладачів (з автентифікацією)
router.get('/teacher/dashboard', authenticate, ctrlWrapper(getTeacherAnalyticsController));
router.get('/teacher/sessions', authenticate, ctrlWrapper(getAllSessionsController));
router.get('/journey/:sessionId', authenticate, ctrlWrapper(getUserJourneyController));

export default router;
