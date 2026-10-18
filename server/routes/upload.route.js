import express from 'express';
import multer from 'multer';
import PortfolioStorage from '../config/cloudinary.js';
import { uploadImage } from '../controllers/upload.controller.js';

const router = express.Router();
const upload = multer({ storage: PortfolioStorage });

router.post('/', upload.single('file'), uploadImage);

export { upload };
export default router;
