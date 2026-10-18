import Project from '../../models/project.model.js';
import { deleteFromCloudinary } from '../../config/cloudinary.js';
import { logActivity } from '../../utils/logger.js';

export async function getProjects(req, res) {
  try {
    const { search, published } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } },
      ];
    }

    if (published !== undefined && published !== '') {
      query.published = published === 'true';
    }

    const projects = await Project.find(query).sort({ displayOrder: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error('Error in getProjects:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error('Error in getProjectById:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function createProject(req, res) {
  try {
    const data = { ...req.body };

    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (!data.id) {
      const highest = await Project.findOne().sort({ id: -1 });
      data.id = highest ? highest.id + 1 : 1;
    }

    const existing = await Project.findOne({ slug: data.slug });
    if (existing) {
      return res.status(400).json({ success: false, message: `Slug "${data.slug}" is already in use.` });
    }

    if (data.displayOrder === undefined) {
      const count = await Project.countDocuments();
      data.displayOrder = count;
    }

    const project = await Project.create(data);
    await logActivity('CREATE_PROJECT', 'Projects', `Created project "${project.title}"`, req);

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });
  } catch (error) {
    console.error('Error in createProject:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.slug) {
      const existing = await Project.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ success: false, message: `Slug "${data.slug}" is already in use.` });
      }
    }

    const project = await Project.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    await logActivity('UPDATE_PROJECT', 'Projects', `Updated project "${project.title}"`, req);

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: project,
    });
  } catch (error) {
    console.error('Error in updateProject:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (project.imagePublicId) {
      await deleteFromCloudinary(project.imagePublicId, 'image');
    }

    await logActivity('DELETE_PROJECT', 'Projects', `Deleted project "${project.title}"`, req);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function reorderProjects(req, res) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array is required.' });
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));

    await Project.bulkWrite(bulkOps);
    await logActivity('REORDER_PROJECTS', 'Projects', 'Reordered projects list', req);

    return res.status(200).json({ success: true, message: 'Projects reordered successfully.' });
  } catch (error) {
    console.error('Error in reorderProjects:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
