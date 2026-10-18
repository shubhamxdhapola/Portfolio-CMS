import HomePage from '../../models/home.model.js';
import { logActivity } from '../../utils/logger.js';

export async function getHomePage(req, res) {
  try {
    let homePage = await HomePage.findOne();
    if (!homePage) homePage = await HomePage.create({});
    return res.status(200).json({ success: true, data: homePage });
  } catch (error) {
    console.error('Error in getHomePage:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateHomePage(req, res) {
  try {
    const homePage = await HomePage.findOneAndUpdate({}, req.body, {
      returnDocument: 'after',
      upsert: true,
    });
    await logActivity('UPDATE_HOME_PAGE', 'Home Page', 'Updated hero and section headers', req);
    return res.status(200).json({ success: true, message: 'Home page CMS updated successfully.', data: homePage });
  } catch (error) {
    console.error('Error in updateHomePage:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
