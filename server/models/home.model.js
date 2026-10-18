import mongoose from 'mongoose';

const sectionHeaderSchema = new mongoose.Schema(
  {
    watermark: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const homePageSchema = new mongoose.Schema(
  {
    hero: {
      headlinePrefix: { type: String, default: '' },
      headlineAccent: { type: String, default: '' },
      headlineSuffix: { type: String, default: '' },
      tagline: { type: String, default: '' },
      roleTitle: { type: String, default: '' },
      email: { type: String, default: '' },
      primaryCtaText: { type: String, default: '' },
      primaryCtaUrl: { type: String, default: '' },
      secondaryCtaText: { type: String, default: '' },
      secondaryCtaUrl: { type: String, default: '' },
      isVisible: { type: Boolean, default: true },
    },
    sections: {
      about: {
        type: sectionHeaderSchema,
        default: () => ({ isVisible: true }),
      },
      projects: {
        type: sectionHeaderSchema,
        default: () => ({ isVisible: true }),
      },
      skills: {
        type: sectionHeaderSchema,
        default: () => ({ isVisible: true }),
      },
      leetcode: {
        type: sectionHeaderSchema,
        default: () => ({ isVisible: true }),
      },
      certifications: {
        type: sectionHeaderSchema,
        default: () => ({ isVisible: true }),
      },
      education: {
        type: sectionHeaderSchema,
        default: () => ({ isVisible: true }),
      },
      contact: {
        type: sectionHeaderSchema,
        default: () => ({ isVisible: true }),
      },
    },
  },
  { timestamps: true }
);

export const HomePage = mongoose.model('HomePage', homePageSchema);
export default HomePage;
