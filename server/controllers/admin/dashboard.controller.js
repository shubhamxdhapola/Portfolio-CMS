import PageView from '../../models/analytics.model.js';
import ActivityLog from '../../models/activity.log.model.js';
import Project from '../../models/project.model.js';
import { Skill } from '../../models/skill.model.js';
import { Certification } from '../../models/certification.model.js';
import { WorkExperience } from '../../models/work.model.js';
import Resume from '../../models/resume.model.js';

export async function getDashboardOverview(req, res) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalPageViews,
      uniqueVisitorsArr,
      viewsToday,
      uniqueTodayArr,
      views7d,
      unique7dArr,
      views30d,
      unique30dArr,
      totalProjects,
      totalSkills,
      totalCertifications,
      totalWork,
      resumeDoc,
      recentActivity,
    ] = await Promise.all([
      PageView.countDocuments(),
      PageView.distinct('visitorId'),
      PageView.countDocuments({ timestamp: { $gte: todayStart } }),
      PageView.distinct('visitorId', { timestamp: { $gte: todayStart } }),
      PageView.countDocuments({ timestamp: { $gte: sevenDaysAgo } }),
      PageView.distinct('visitorId', { timestamp: { $gte: sevenDaysAgo } }),
      PageView.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      PageView.distinct('visitorId', { timestamp: { $gte: thirtyDaysAgo } }),
      Project.countDocuments(),
      Skill.countDocuments(),
      Certification.countDocuments(),
      WorkExperience.countDocuments(),
      Resume.findOne().select('updatedAt updatedDate currentVersion').lean(),
      ActivityLog.find().sort({ timestamp: -1 }).limit(8).lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalPageViews,
          totalUniqueVisitors: uniqueVisitorsArr.length,
          viewsToday,
          uniqueToday: uniqueTodayArr.length,
          views7d,
          unique7d: unique7dArr.length,
          views30d,
          unique30d: unique30dArr.length,
          totalProjects,
          totalSkills,
          totalCertifications,
          totalWork,
          resumeLastUpdated: resumeDoc?.updatedDate || 0,
          resumeCurrentVersion: resumeDoc?.currentVersion,
        },
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Error in getDashboardOverview:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getActivityLogs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find().sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      ActivityLog.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error in getActivityLogs:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
