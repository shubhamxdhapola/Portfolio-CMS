import Education from '../../models/education.model.js';
import { logActivity } from '../../utils/logger.js';

export async function getEducation(req, res) {
  try {
    const items = await Education.find().sort({ displayOrder: 1 });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Error in getEducation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function createEducation(req, res) {
  try {
    const count = await Education.countDocuments();
    const highestId = await Education.findOne().sort({ id: -1 });
    const data = {
      ...req.body,
      id: highestId ? highestId.id + 1 : 1,
      displayOrder: req.body.displayOrder ?? count,
    };
    const item = await Education.create(data);
    await logActivity('CREATE_EDUCATION', 'Education', `Added degree "${item.degree}"`, req);
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Error in createEducation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateEducation(req, res) {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!item) return res.status(404).json({ success: false, message: 'Education record not found.' });
    await logActivity('UPDATE_EDUCATION', 'Education', `Updated degree "${item.degree}"`, req);
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Error in updateEducation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function deleteEducation(req, res) {
  try {
    const item = await Education.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Education record not found.' });
    await logActivity('DELETE_EDUCATION', 'Education', `Deleted degree "${item.degree}"`, req);
    return res.status(200).json({ success: true, message: 'Education record deleted.' });
  } catch (error) {
    console.error('Error in deleteEducation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function reorderEducation(req, res) {
  try {
    const { items } = req.body;
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));
    await Education.bulkWrite(bulkOps);
    return res.status(200).json({ success: true, message: 'Education reordered.' });
  } catch (error) {
    console.error('Error in reorderEducation:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
