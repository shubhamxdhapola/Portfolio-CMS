import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PortfolioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Portfolio_Storage',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'ico', 'pdf'],
  },
});

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`[Cloudinary] Failed to delete asset ${publicId}:`, err.message);
  }
};

export { cloudinary, PortfolioStorage };
export default PortfolioStorage;
