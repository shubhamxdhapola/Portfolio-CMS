import AboutMe from '../../models/about.model.js';
import { logActivity } from '../../utils/logger.js';

export async function getAboutMe(req, res) {
  try {
    let aboutMe = await AboutMe.findOne();
    if (!aboutMe) aboutMe = await AboutMe.create({});
    return res.status(200).json({
      success: true,
      data: aboutMe
    });
  } catch (error) {
    console.error('Error in getAboutMe:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error'
    });
  }
}

export async function updateAboutMe(req, res) {
  try {
    const aboutMe = await AboutMe.findOneAndUpdate({}, req.body, {
      returnDocument: 'after',
      upsert: true,
    });
    await logActivity('UPDATE_ABOUT_ME', 'About Me', 'Updated profile and bio details', req);
    return res.status(200).json({ success: true, message: 'About Me updated successfully.', data: aboutMe });
  } catch (error) {
    console.error('Error in updateAboutMe:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
