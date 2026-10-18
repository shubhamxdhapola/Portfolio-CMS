import mongoose from 'mongoose';

const resumeVersionSchema = new mongoose.Schema(
  {
    versionNumber: { type: Number, required: true },
    fileName: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    pdfPublicId: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { _id: true }
);

const resumeSchema = new mongoose.Schema(
  {
    fileName: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    pdfPublicId: { type: String, default: '' },
    previewImageUrl: { type: String, default: '' },
    previewImagePublicId: { type: String, default: '' },
    role: { type: String, default: '' },
    location: { type: String, default: '' },
    stack: { type: String, default: '' },
    availability: { type: String, default: '' },
    updatedDate: { type: String, default: '' },
    summary: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    currentVersion: { type: Number, default: 1 },
    versions: { type: [resumeVersionSchema], default: [] },
  },
  { timestamps: true }
);

export const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
