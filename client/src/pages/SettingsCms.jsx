import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FiSettings,
  FiLock,
  FiSave,
  FiLoader,
  FiShield,
  FiCheck,
  FiUser,
} from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import ImageUploader from '../components/ImageUploader';
import { useAdminAuth } from '../context/AdminAuthContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import useImageUploading from '../hooks/useImageUploading';

export default function SettingsCms() {
  const { admin, updateProfile } = useAdminAuth();
  const { refreshData } = usePortfolioData();
  const isImageUploading = useImageUploading();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Admin Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    sidebarTitle: '',
    avatarUrl: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { showToast } = useOutletContext();

  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.name || 'Shubham Dhapola',
        sidebarTitle: admin.sidebarTitle || 'shubhamxdev',
        avatarUrl: admin.avatarUrl || '',
      });
    }
  }, [admin]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/settings');
      if (res.success) {
        setSettings(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await apiClient.put('/admin/settings', settings);
      if (res.success) {
        showToast('Global settings updated successfully!');
        if (refreshData) {
          await refreshData();
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile(profileData);
      showToast('Admin profile & sidebar header updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await apiClient.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.success) {
        showToast('Administrator password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <FiLoader className="size-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl w-full min-w-0">
      {/* Top Header */}
      <div className="border-b border-slate-200/80 pb-4 min-w-0">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span>Global Settings & Security</span>
        </h2>
        <p className="text-sm font-semibold text-slate-500">
          Configure site-wide SEO metadata, contact details, social share images, and admin credentials.
        </p>
      </div>

      {/* Website Meta & SEO Card */}
      <form
        onSubmit={handleSaveSettings}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-5 min-w-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <h3 className="text-base font-bold text-slate-900">General SEO & Contact Settings</h3>
          <button
            type="submit"
            disabled={savingSettings || isImageUploading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-slate-950 hover:bg-black text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {savingSettings || isImageUploading ? (
              <FiLoader className="size-4 animate-spin text-amber-400" />
            ) : (
              <FiSave className="size-4 text-amber-400" />
            )}
            <span>
              {savingSettings
                ? 'Saving...'
                : isImageUploading
                  ? 'Uploading Image...'
                  : 'Save Settings'}
            </span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Website Title (Browser tab)
          </label>
          <input
            type="text"
            value={settings?.siteTitle || ''}
            onChange={(e) => handleSettingsChange('siteTitle', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Meta Description (Search engines)
          </label>
          <textarea
            rows={2}
            value={settings?.metaDescription || ''}
            onChange={(e) => handleSettingsChange('metaDescription', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Contact Receiving Email
          </label>
          <input
            type="email"
            value={settings?.contactEmail || ''}
            onChange={(e) => handleSettingsChange('contactEmail', e.target.value)}
            placeholder="e.g. shubhamdhapola07@gmail.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUploader
            label="Favicon Asset"
            value={settings?.faviconUrl || ''}
            onChange={({ url }) => handleSettingsChange('faviconUrl', url)}
            folder="portfolio_cms/icons"
            description="Browser tab icon (.ico or .png)"
          />

          <ImageUploader
            label="Social Share Image (OG:Image)"
            value={settings?.socialShareImageUrl || ''}
            onChange={({ url }) => handleSettingsChange('socialShareImageUrl', url)}
            folder="portfolio_cms/social"
            description="Preview card image for Twitter / LinkedIn"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Footer Description Text
            </label>
            <input
              type="text"
              value={settings?.footerText || ''}
              onChange={(e) => handleSettingsChange('footerText', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Copyright Notice
            </label>
            <input
              type="text"
              value={settings?.copyrightText || ''}
              onChange={(e) => handleSettingsChange('copyrightText', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>
        </div>
      </form>

      {/* Admin Profile & Sidebar Branding Card */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-5 min-w-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Admin Profile & Sidebar Header</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Customize the sidebar heading title ("{profileData.sidebarTitle || 'shubhamxdev'}"), your display name, and avatar picture.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingProfile || isImageUploading}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-slate-950 hover:bg-black text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {savingProfile || isImageUploading ? (
              <FiLoader className="size-4 animate-spin text-amber-400" />
            ) : (
              <FiSave className="size-4 text-amber-400" />
            )}
            <span>
              {savingProfile
                ? 'Saving Profile...'
                : isImageUploading
                  ? 'Uploading Avatar...'
                  : 'Save Profile'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Sidebar Heading Title
            </label>
            <input
              type="text"
              value={profileData.sidebarTitle}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, sidebarTitle: e.target.value }))
              }
              placeholder="e.g. shubhamxdev"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Admin Display Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Shubham Dhapola"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>
        </div>

        <div>
          <ImageUploader
            label="Admin Profile Picture / Avatar"
            value={profileData.avatarUrl}
            onChange={({ url }) =>
              setProfileData((prev) => ({ ...prev, avatarUrl: url }))
            }
            folder="admin_profile"
            description="JPG, PNG, or WEBP. If empty, the stylized initial letter badge is displayed."
          />
        </div>
      </form>

      {/* Admin Password Change Card */}
      <form
        onSubmit={handleChangePassword}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4 min-w-0"
      >
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Administrator Security & Password</span>
          </h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Update your administrator password for this CMS portal.
          </p>
        </div>

        {passwordError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
            {passwordError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 hover:bg-black text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
          >
            {savingPassword ? <FiLoader className="size-4 animate-spin text-amber-400" /> : <FiLock className="size-4 text-amber-400" />}
            <span>Update Password</span>
          </button>
        </div>
      </form>
    </div>
  );
}
