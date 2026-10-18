import SiteSettings from '../../models/site.settings.model.js';
import User from '../../models/user.model.js';
import { logActivity } from '../../utils/logger.js';

export async function getSettings(req, res) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error in getSettings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateSettings(req, res) {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, req.body, {
      returnDocument: 'after',
      upsert: true,
    });
    const adminId = req.user?._id || req.admin?._id;
    if (req.body.sidebarBrandTitle && adminId) {
      await User.findByIdAndUpdate(adminId, { sidebarTitle: req.body.sidebarBrandTitle.trim() });
    }
    await logActivity('UPDATE_SETTINGS', 'Settings', 'Updated global site settings', req);
    return res.status(200).json({ success: true, message: 'Settings updated successfully.', data: settings });
  } catch (error) {
    console.error('Error in updateSettings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
