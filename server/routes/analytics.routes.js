import express from 'express';
import {
  recordPageView,
  getAnalyticsOverview,
  getAnalyticsTimeline,
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router.post('/page-view', recordPageView);
router.get('/overview', authenticate, getAnalyticsOverview);
router.get('/timeline', authenticate, getAnalyticsTimeline);

export default router;
