import ActivityLog from '../models/activity.log.model.js';

export async function logActivity(action, section, details, req) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const adminUsername = req.user?.username || req.admin?.username || 'admin';
    await ActivityLog.create({
      action,
      section,
      details,
      adminUsername,
      ip: typeof ip === 'string' ? ip.split(',')[0].trim() : '',
    });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
}

export default logActivity;
