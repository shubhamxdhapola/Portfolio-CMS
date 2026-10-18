import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issuerLogo: { type: String, default: '' },
    issuerLogoPublicId: { type: String, default: '' },
    issuerBadge: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    fullDate: { type: String, default: '' },
    credentialId: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    category: { type: String, default: 'Software Development' },
    accentColor: { type: String, default: '#FF4ECD' },
    skills: { type: [String], default: [] },
    description: { type: String, default: '' },
    featured: { type: Boolean, default: true },
    published: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

certificationSchema.index({ displayOrder: 1 });

export const Certification = mongoose.model('Certification', certificationSchema);

const certificationPageSchema = new mongoose.Schema(
  {
    heading: { type: String, default: '' },
    subheading: { type: String, default: '' },
    watermark: { type: String, default: '' },
    description: {
      type: String,
      default: '',
    },
    emptyMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CertificationPage = mongoose.model('CertificationPage', certificationPageSchema);
export default Certification;
