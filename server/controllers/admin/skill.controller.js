import { Skill, MarqueeItem } from '../../models/skill.model.js';
import { deleteFromCloudinary } from '../../config/cloudinary.js';
import { logActivity } from '../../utils/logger.js';

export async function getSkills(req, res) {
  try {
    const skills = await Skill.find().sort({ displayOrder: 1, createdAt: 1 });
    return res.status(200).json({ success: true, data: skills });
  } catch (error) {
    console.error('Error in getSkills:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function createSkill(req, res) {
  try {
    const count = await Skill.countDocuments();
    const data = { ...req.body, displayOrder: req.body.displayOrder ?? count };
    const skill = await Skill.create(data);
    await logActivity('CREATE_SKILL', 'Skills', `Added skill "${skill.name}"`, req);
    return res.status(201).json({ success: true, message: 'Skill created.', data: skill });
  } catch (error) {
    console.error('Error in createSkill:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateSkill(req, res) {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    await logActivity('UPDATE_SKILL', 'Skills', `Updated skill "${skill.name}"`, req);
    return res.status(200).json({ success: true, message: 'Skill updated.', data: skill });
  } catch (error) {
    console.error('Error in updateSkill:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function deleteSkill(req, res) {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    if (skill.iconPublicId) await deleteFromCloudinary(skill.iconPublicId, 'image');
    await logActivity('DELETE_SKILL', 'Skills', `Deleted skill "${skill.name}"`, req);
    return res.status(200).json({ success: true, message: 'Skill deleted.' });
  } catch (error) {
    console.error('Error in deleteSkill:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function reorderSkills(req, res) {
  try {
    const { items } = req.body;
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));
    await Skill.bulkWrite(bulkOps);
    return res.status(200).json({ success: true, message: 'Skills reordered.' });
  } catch (error) {
    console.error('Error in reorderSkills:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getMarqueeItems(req, res) {
  try {
    const items = await MarqueeItem.find().sort({ displayOrder: 1 });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Error in getMarqueeItems:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function createMarqueeItem(req, res) {
  try {
    const count = await MarqueeItem.countDocuments();
    const item = await MarqueeItem.create({ ...req.body, displayOrder: req.body.displayOrder ?? count });
    await logActivity('CREATE_MARQUEE', 'Skills', `Added marquee text "${item.text}"`, req);
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Error in createMarqueeItem:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateMarqueeItem(req, res) {
  try {
    const item = await MarqueeItem.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Error in updateMarqueeItem:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function deleteMarqueeItem(req, res) {
  try {
    await MarqueeItem.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Marquee item deleted.' });
  } catch (error) {
    console.error('Error in deleteMarqueeItem:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function reorderMarqueeItems(req, res) {
  try {
    const { items } = req.body;
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));
    await MarqueeItem.bulkWrite(bulkOps);
    return res.status(200).json({ success: true, message: 'Marquee items reordered.' });
  } catch (error) {
    console.error('Error in reorderMarqueeItems:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
