import mongoose from 'mongoose';

const workExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    employmentType: { type: String, default: 'Full-time' },
    location: { type: String, default: 'Remote' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: 'Present' },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: '' },
    responsibilities: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    companyUrl: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

workExperienceSchema.index({ displayOrder: 1 });

export const WorkExperience = mongoose.model('WorkExperience', workExperienceSchema);

const workPageSchema = new mongoose.Schema(
  {
    heading: { type: String, default: '' },
    subheading: { type: String, default: '' },
    watermark: { type: String, default: '' },
    description: {
      type: String,
      default: '',
    },
    ctaText: { type: String, default: '' },
    ctaUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const WorkPage = mongoose.model('WorkPage', workPageSchema);
export default WorkExperience;
