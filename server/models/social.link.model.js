import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    customIconUrl: { type: String, default: '' },
    label: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

socialLinkSchema.index({ displayOrder: 1 });

export const SocialLink = mongoose.model('SocialLink', socialLinkSchema);
export default SocialLink;
