import { WorkExperience, WorkPage } from '../../models/work.model.js';
import { logActivity } from '../../utils/logger.js';

export async function getWorkExperience(req, res) {
  try {
    const items = await WorkExperience.find().sort({ displayOrder: 1 });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Error in getWorkExperience:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function createWorkExperience(req, res) {
  try {
    const count = await WorkExperience.countDocuments();
    const data = { ...req.body, displayOrder: req.body.displayOrder ?? count };
    const item = await WorkExperience.create(data);
    await logActivity('CREATE_WORK', 'Work Experience', `Added work "${item.role} at ${item.company}"`, req);
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Error in createWorkExperience:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateWorkExperience(req, res) {
  try {
    const item = await WorkExperience.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!item) return res.status(404).json({ success: false, message: 'Work experience not found.' });
    await logActivity('UPDATE_WORK', 'Work Experience', `Updated work "${item.role} at ${item.company}"`, req);
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Error in updateWorkExperience:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function deleteWorkExperience(req, res) {
  try {
    const item = await WorkExperience.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Work experience not found.' });
    await logActivity('DELETE_WORK', 'Work Experience', `Deleted work "${item.role} at ${item.company}"`, req);
    return res.status(200).json({ success: true, message: 'Work experience deleted.' });
  } catch (error) {
    console.error('Error in deleteWorkExperience:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function reorderWorkExperience(req, res) {
  try {
    const { items } = req.body;
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));
    await WorkExperience.bulkWrite(bulkOps);
    return res.status(200).json({ success: true, message: 'Work experiences reordered.' });
  } catch (error) {
    console.error('Error in reorderWorkExperience:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getWorkPageSettings(req, res) {
  try {
    let settings = await WorkPage.findOne();
    if (!settings) settings = await WorkPage.create({});
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error in getWorkPageSettings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateWorkPageSettings(req, res) {
  try {
    const settings = await WorkPage.findOneAndUpdate({}, req.body, { returnDocument: 'after', upsert: true });
    await logActivity('UPDATE_WORK_PAGE', 'Work Experience', 'Updated work page settings', req);
    return res.status(200).json({ success: true, message: 'Settings updated.', data: settings });
  } catch (error) {
    console.error('Error in updateWorkPageSettings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
