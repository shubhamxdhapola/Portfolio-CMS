import express from 'express';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { upload } from './upload.route.js';
import {
  getDashboardOverview,
  getSettings,
  updateSettings,
  getHomePage,
  updateHomePage,
  getAboutMe,
  updateAboutMe,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  getMarqueeItems,
  createMarqueeItem,
  updateMarqueeItem,
  deleteMarqueeItem,
  reorderMarqueeItems,
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  reorderCertifications,
  getCertificationPageSettings,
  updateCertificationPageSettings,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  reorderEducation,
  getWorkExperience,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  reorderWorkExperience,
  getWorkPageSettings,
  updateWorkPageSettings,
  getResume,
  updateResumeDetails,
  uploadResumePdf,
  restoreResumeVersion,
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
  getLeetCodeSettings,
  updateLeetCodeSettings,
  refreshLeetCode,
  uploadMedia,
  getActivityLogs,
} from '../controllers/admin.controller.js';

const router = express.Router();

// Protect all admin routes
router.use(authenticate);

// Dashboard Overview
router.get('/overview', getDashboardOverview);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Home Page
router.get('/home', getHomePage);
router.put('/home', updateHomePage);

// About Me
router.get('/about', getAboutMe);
router.put('/about', updateAboutMe);

// Projects
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.patch('/projects/reorder', reorderProjects);
router.get('/projects/:id', getProjectById);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Skills
router.get('/skills', getSkills);
router.post('/skills', createSkill);
router.patch('/skills/reorder', reorderSkills);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Marquee Items
router.get('/marquee', getMarqueeItems);
router.post('/marquee', createMarqueeItem);
router.patch('/marquee/reorder', reorderMarqueeItems);
router.put('/marquee/:id', updateMarqueeItem);
router.delete('/marquee/:id', deleteMarqueeItem);

// Certifications
router.get('/certifications', getCertifications);
router.post('/certifications', createCertification);
router.patch('/certifications/reorder', reorderCertifications);
router.put('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);
router.get('/certifications-page', getCertificationPageSettings);
router.put('/certifications-page', updateCertificationPageSettings);

// Education
router.get('/education', getEducation);
router.post('/education', createEducation);
router.patch('/education/reorder', reorderEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Work Experience
router.get('/work', getWorkExperience);
router.post('/work', createWorkExperience);
router.patch('/work/reorder', reorderWorkExperience);
router.put('/work/:id', updateWorkExperience);
router.delete('/work/:id', deleteWorkExperience);
router.get('/work-page', getWorkPageSettings);
router.put('/work-page', updateWorkPageSettings);

// Resume
router.get('/resume', getResume);
router.put('/resume', updateResumeDetails);
router.post('/resume/upload', upload.single('file'), uploadResumePdf);
router.post('/resume/restore/:versionId', restoreResumeVersion);

// Social Links
router.get('/social-links', getSocialLinks);
router.post('/social-links', createSocialLink);
router.patch('/social-links/reorder', reorderSocialLinks);
router.put('/social-links/:id', updateSocialLink);
router.delete('/social-links/:id', deleteSocialLink);

// LeetCode
router.get('/leetcode/settings', getLeetCodeSettings);
router.put('/leetcode/settings', updateLeetCodeSettings);
router.post('/leetcode/refresh', refreshLeetCode);

// File Uploads
router.post('/upload', upload.single('file'), uploadMedia);

// Audit Logs
router.get('/activity-logs', getActivityLogs);

export default router;
