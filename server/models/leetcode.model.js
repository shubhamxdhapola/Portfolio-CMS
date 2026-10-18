import mongoose from 'mongoose';

const leetcodeSettingSchema = new mongoose.Schema(
  {
    username: { type: String, default: '', trim: true },
    apiBaseUrl: { type: String, default: 'https://leetcode-api-pied.vercel.app', trim: true },
    profileUrl: { type: String, default: '', trim: true },
    cacheTimeMs: { type: Number, default: 600000 }, // 10 minutes
    autoRefresh: { type: Boolean, default: true },
    lastFetchedAt: { type: Date, default: null },
    lastFetchStatus: { type: String, enum: ['success', 'error', 'idle'], default: 'idle' },
    lastErrorMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

export const LeetCodeSetting = mongoose.model('LeetCodeSetting', leetcodeSettingSchema);

const leetcodeCacheSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    statsData: { type: mongoose.Schema.Types.Mixed, default: {} },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LeetCodeCache = mongoose.model('LeetCodeCache', leetcodeCacheSchema);
export default LeetCodeSetting;
