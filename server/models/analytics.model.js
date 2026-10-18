import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, index: true },
    path: { type: String, required: true, index: true },
    referrer: { type: String, default: 'Direct' },
    deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet', 'other'], default: 'desktop' },
    browser: { type: String, default: 'Unknown' },
    ipHash: { type: String, default: '', index: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ path: 1, timestamp: -1 });

export const PageView = mongoose.model('PageView', pageViewSchema);
export default PageView;
