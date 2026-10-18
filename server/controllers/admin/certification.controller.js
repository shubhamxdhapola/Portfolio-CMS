import { Certification, CertificationPage } from '../../models/certification.model.js';
import { deleteFromCloudinary } from '../../config/cloudinary.js';
import { logActivity } from '../../utils/logger.js';

export async function getCertifications(req, res) {
  try {
    const certs = await Certification.find().sort({ displayOrder: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: certs });
  } catch (error) {
    console.error('Error in getCertifications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function createCertification(req, res) {
  try {
    const data = { ...req.body };
    if (!data.id && data.title) {
      data.id = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const count = await Certification.countDocuments();
    data.displayOrder = data.displayOrder ?? count;

    const cert = await Certification.create(data);
    await logActivity('CREATE_CERTIFICATION', 'Certifications', `Added certification "${cert.title}"`, req);
    return res.status(201).json({ success: true, message: 'Certification created.', data: cert });
  } catch (error) {
    console.error('Error in createCertification:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateCertification(req, res) {
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!cert) return res.status(404).json({ success: false, message: 'Certification not found.' });
    await logActivity('UPDATE_CERTIFICATION', 'Certifications', `Updated certification "${cert.title}"`, req);
    return res.status(200).json({ success: true, message: 'Certification updated.', data: cert });
  } catch (error) {
    console.error('Error in updateCertification:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function deleteCertification(req, res) {
  try {
    const cert = await Certification.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certification not found.' });
    if (cert.imagePublicId) await deleteFromCloudinary(cert.imagePublicId, 'image');
    if (cert.issuerLogoPublicId) await deleteFromCloudinary(cert.issuerLogoPublicId, 'image');
    await logActivity('DELETE_CERTIFICATION', 'Certifications', `Deleted certification "${cert.title}"`, req);
    return res.status(200).json({ success: true, message: 'Certification deleted.' });
  } catch (error) {
    console.error('Error in deleteCertification:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function reorderCertifications(req, res) {
  try {
    const { items } = req.body;
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));
    await Certification.bulkWrite(bulkOps);
    return res.status(200).json({ success: true, message: 'Certifications reordered.' });
  } catch (error) {
    console.error('Error in reorderCertifications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getCertificationPageSettings(req, res) {
  try {
    let settings = await CertificationPage.findOne();
    if (!settings) settings = await CertificationPage.create({});
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error in getCertificationPageSettings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateCertificationPageSettings(req, res) {
  try {
    const settings = await CertificationPage.findOneAndUpdate({}, req.body, { returnDocument: 'after', upsert: true });
    await logActivity('UPDATE_CERT_PAGE', 'Certifications', 'Updated certification page settings', req);
    return res.status(200).json({ success: true, message: 'Settings updated.', data: settings });
  } catch (error) {
    console.error('Error in updateCertificationPageSettings:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
