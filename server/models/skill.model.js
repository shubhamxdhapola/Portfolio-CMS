import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    iconUrl: { type: String, default: '' },
    iconPublicId: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Languages', 'Other'],
      default: 'Frontend',
    },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

skillSchema.index({ displayOrder: 1 });

export const Skill = mongoose.model('Skill', skillSchema);

const marqueeItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

marqueeItemSchema.index({ displayOrder: 1 });

export const MarqueeItem = mongoose.model('MarqueeItem', marqueeItemSchema);
export default Skill;
