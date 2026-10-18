import express from 'express';
import {
  getSiteContent,
  getPublicProjects,
  getPublicProjectBySlug,
  getPublicSkills,
  getPublicCertifications,
  getPublicEducation,
  getPublicWork,
  getPublicResume,
  streamResumePdf,
  getPublicLeetCodeStats,
} from '../controllers/public.controller.js';

const router = express.Router();

router.get('/site-content', getSiteContent);
router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);
router.get('/skills', getPublicSkills);
router.get('/certifications', getPublicCertifications);
router.get('/education', getPublicEducation);
router.get('/work', getPublicWork);
router.get('/resume', getPublicResume);
router.get('/resume/pdf', streamResumePdf);
router.get('/resume/pdf/:versionId', streamResumePdf);
router.get('/leetcode/stats', getPublicLeetCodeStats);

export default router;
