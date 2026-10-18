import SocialLink from '../../models/social.link.model.js';
import { logActivity } from '../../utils/logger.js';

export async function getSocialLinks(req, res) {
  try {
    const links = await SocialLink.find().sort({ displayOrder: 1 });
    return res.status(200).json({ success: true, data: links });
  } catch (error) {
    console.error('Error in getSocialLinks:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function createSocialLink(req, res) {
  try {
    const count = await SocialLink.countDocuments();
    const link = await SocialLink.create({ ...req.body, displayOrder: req.body.displayOrder ?? count });
    await logActivity('CREATE_SOCIAL_LINK', 'Social Links', `Added link for "${link.platform}"`, req);
    return res.status(201).json({ success: true, data: link });
  } catch (error) {
    console.error('Error in createSocialLink:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateSocialLink(req, res) {
  try {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!link) return res.status(404).json({ success: false, message: 'Link not found.' });
    await logActivity('UPDATE_SOCIAL_LINK', 'Social Links', `Updated link for "${link.platform}"`, req);
    return res.status(200).json({ success: true, data: link });
  } catch (error) {
    console.error('Error in updateSocialLink:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function deleteSocialLink(req, res) {
  try {
    const link = await SocialLink.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ success: false, message: 'Link not found.' });
    await logActivity('DELETE_SOCIAL_LINK', 'Social Links', `Deleted link for "${link.platform}"`, req);
    return res.status(200).json({ success: true, message: 'Social link deleted.' });
  } catch (error) {
    console.error('Error in deleteSocialLink:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function reorderSocialLinks(req, res) {
  try {
    const { items } = req.body;
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));
    await SocialLink.bulkWrite(bulkOps);
    return res.status(200).json({ success: true, message: 'Social links reordered.' });
  } catch (error) {
    console.error('Error in reorderSocialLinks:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
