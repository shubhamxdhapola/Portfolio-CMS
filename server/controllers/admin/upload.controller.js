import { logActivity } from '../../utils/logger.js';

export async function uploadMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const fileUrl = req.file.path || req.file.secure_url;
    const publicId = req.file.filename || req.file.public_id || '';

    await logActivity('UPLOAD_MEDIA', 'Media', `Uploaded ${req.file.originalname}`, req);

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      profileImage: fileUrl,
      url: fileUrl,
      data: {
        url: fileUrl,
        publicId: publicId,
        storage: 'cloudinary',
      },
    });
  } catch (error) {
    console.error('Error in uploadMedia:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
