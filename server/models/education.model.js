import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    grade: { type: String, default: '' },
    description: { type: String, default: '' },
    institutionLogo: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

educationSchema.index({ displayOrder: 1 });

export const Education = mongoose.model('Education', educationSchema);
export default Education;
