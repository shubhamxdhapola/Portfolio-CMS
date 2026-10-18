import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    section: { type: String, default: 'General' },
    details: { type: String, default: '' },
    adminUsername: { type: String, default: 'admin' },
    ip: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

activityLogSchema.index({ timestamp: -1 });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
