import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    siteTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    faviconUrl: {
      type: String,
      default: '/favicon.ico',
    },
    socialShareImageUrl: {
      type: String,
      default: '',
    },
    footerText: {
      type: String,
      default: '',
    },
    copyrightText: {
      type: String,
      default: '',
    },
    isMaintenanceMode: {
      type: Boolean,
      default: false,
    },
    sidebarBrandTitle: {
      type: String,
      default: 'shubhamxdev',
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
