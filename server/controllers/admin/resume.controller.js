import Resume from '../../models/resume.model.js';
import { logActivity } from '../../utils/logger.js';
import { cloudinary } from '../../config/cloudinary.js';

export async function getResume(req, res) {
  try {
    let resume = await Resume.findOne();
    if (!resume) resume = await Resume.create({});
    return res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error('Error in getResume:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function updateResumeDetails(req, res) {
  try {
    const resume = await Resume.findOneAndUpdate({}, req.body, { returnDocument: 'after', upsert: true });
    await logActivity('UPDATE_RESUME_INFO', 'Resume', 'Updated resume textual metadata', req);
    return res.status(200).json({ success: true, message: 'Resume details updated.', data: resume });
  } catch (error) {
    console.error('Error in updateResumeDetails:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function uploadResumePdf(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a PDF file to upload.' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ success: false, message: 'Only PDF documents are supported for resume.' });
    }

    const fileUrl = req.file.path || req.file.secure_url;
    const publicId = req.file.filename || req.file.public_id || '';

    let previewImageUrl = '';
    if (publicId) {
      previewImageUrl = cloudinary.url(publicId, {
        format: 'png',
        page: 1,
        secure: true,
        quality: 'auto',
      });
    }

    let resume = await Resume.findOne();
    if (!resume) resume = await Resume.create({});

    if (resume.pdfUrl) {
      resume.versions.unshift({
        versionNumber: resume.currentVersion,
        fileName: resume.fileName,
        pdfUrl: resume.pdfUrl,
        pdfPublicId: resume.pdfPublicId,
        uploadedAt: resume.updatedAt || new Date(),
        notes: req.body.notes || `Version ${resume.currentVersion}`,
      });
    }

    resume.pdfUrl = fileUrl;
    resume.pdfPublicId = publicId;
    if (previewImageUrl) {
      resume.previewImageUrl = previewImageUrl;
      resume.previewImagePublicId = publicId;
    }
    resume.fileName = req.file.originalname;
    resume.currentVersion += 1;
    resume.updatedDate = new Date().getFullYear().toString();
    await resume.save();

    await logActivity(
      'UPLOAD_RESUME_PDF',
      'Resume',
      `Uploaded new resume PDF (v${resume.currentVersion}): ${req.file.originalname}`,
      req
    );

    return res.status(200).json({
      success: true,
      message: `Resume v${resume.currentVersion} published successfully.`,
      data: resume,
    });
  } catch (error) {
    console.error('Error in uploadResumePdf:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function restoreResumeVersion(req, res) {
  try {
    const { versionId } = req.params;
    const resume = await Resume.findOne();
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const targetVersion = resume.versions.id(versionId);
    if (!targetVersion) {
      return res.status(404).json({ success: false, message: 'Specified version not found in history.' });
    }

    resume.versions.unshift({
      versionNumber: resume.currentVersion,
      fileName: resume.fileName,
      pdfUrl: resume.pdfUrl,
      pdfPublicId: resume.pdfPublicId,
      uploadedAt: new Date(),
      notes: `Archived prior to restoring v${targetVersion.versionNumber}`,
    });

    resume.pdfUrl = targetVersion.pdfUrl;
    resume.pdfPublicId = targetVersion.pdfPublicId;
    resume.fileName = targetVersion.fileName;
    if (targetVersion.pdfPublicId) {
      resume.previewImageUrl = cloudinary.url(targetVersion.pdfPublicId, {
        format: 'png',
        page: 1,
        secure: true,
        quality: 'auto',
      });
      resume.previewImagePublicId = targetVersion.pdfPublicId;
    }
    resume.currentVersion += 1;
    await resume.save();

    await logActivity('RESTORE_RESUME', 'Resume', `Restored resume version to v${targetVersion.versionNumber}`, req);

    return res.status(200).json({
      success: true,
      message: `Successfully restored resume to version from ${new Date(targetVersion.uploadedAt).toLocaleDateString()}.`,
      data: resume,
    });
  } catch (error) {
    console.error('Error in restoreResumeVersion:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
