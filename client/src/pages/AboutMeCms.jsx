import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiSave, FiPlus, FiTrash2, FiLoader, FiCode, FiTerminal, FiLayers, FiActivity } from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import ImageUploader from '../components/ImageUploader';
import AdminSelect from '../components/AdminSelect';
import useImageUploading from '../hooks/useImageUploading';

export default function AboutMeCms() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isImageUploading = useImageUploading();
  const { showToast } = useOutletContext();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/about');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [key]: value },
    }));
  };

  const handleAddWhatIDo = () => {
    setData((prev) => ({
      ...prev,
      whatIDo: [...(prev.whatIDo || []), { title: '', icon: '' }],
    }));
  };

  const handleUpdateWhatIDo = (index, field, value) => {
    setData((prev) => {
      const next = [...(prev.whatIDo || [])];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, whatIDo: next };
    });
  };

  const handleRemoveWhatIDo = (index) => {
    setData((prev) => ({
      ...prev,
      whatIDo: prev.whatIDo.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await apiClient.put('/admin/about', data);
      if (res.success) {
        showToast('About Me details saved successfully!');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
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
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-5xl w-full min-w-0 max-w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-4 w-full min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900">About Me CMS</h2>
          <p className="text-sm font-semibold text-slate-500">
            Manage your personal bio, profile avatars, open-to-work status, and skill capsules.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving || isImageUploading}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-black text-white px-5 py-2.5 text-[13px] font-semibold shadow-sm hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {saving || isImageUploading ? (
            <FiLoader className="size-4 animate-spin text-amber-400" />
          ) : (
            <FiSave className="size-4 text-amber-400" />
          )}
          <span>
            {saving
              ? 'Saving Changes...'
              : isImageUploading
                ? 'Uploading Media...'
                : 'Save Changes'}
          </span>
        </button>
      </div>

      {/* Profile Avatars Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-6 w-full min-w-0">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Profile Images & Badges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
          <ImageUploader
            label="Primary Profile Photo (Avatar)"
            value={data?.avatarUrl || ''}
            publicId={data?.avatarPublicId || ''}
            onChange={({ url, publicId }) => {
              handleChange('avatarUrl', url);
              handleChange('avatarPublicId', publicId);
            }}
            folder="portfolio_cms/profile"
            description="Square image displayed in the main circular avatar"
          />

          <ImageUploader
            label="Secondary Hover Photo (Memoji)"
            value={data?.avatarAltUrl || ''}
            publicId={data?.avatarAltPublicId || ''}
            onChange={({ url, publicId }) => {
              handleChange('avatarAltUrl', url);
              handleChange('avatarAltPublicId', publicId);
            }}
            folder="portfolio_cms/profile"
            description="3D Memoji revealed when hovering over avatar"
          />
        </div>

        {/* Floating Capsule Badges & Circular Text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 w-full min-w-0">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Top-Right Floating Badge
            </label>
            <input
              type="text"
              value={data?.badgeTopRight || ''}
              onChange={(e) => handleChange('badgeTopRight', e.target.value)}
              placeholder="Developer"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 font-semibold placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Bottom-Left Floating Badge
            </label>
            <input
              type="text"
              value={data?.badgeBottomLeft || ''}
              onChange={(e) => handleChange('badgeBottomLeft', e.target.value)}
              placeholder="Full Stack"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>

          {/* <div className="flex flex-col justify-center">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Open to Work Badge
            </span>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data?.openToWorkStatus ?? true}
                onChange={(e) => handleChange('openToWorkStatus', e.target.checked)}
                className="rounded accent-amber-500 size-4 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-700">
                {data?.openToWorkStatus ? 'Status: Active (Open to work)' : 'Status: Inactive'}
              </span>
            </label>
          </div> */}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Circular Rotating Text (surrounding the avatar)
          </label>
          <input
            type="text"
            value={data?.circularText || ''}
            onChange={(e) => handleChange('circularText', e.target.value)}
            placeholder="OPEN TO WORK ● OPEN TO WORK ● OPEN TO WORK ● "
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Personal Bio Details Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-6 w-full min-w-0">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Bio & Professional Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full min-w-0">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={data?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Shubham Dhapola"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Short / Nickname
            </label>
            <input
              type="text"
              value={data?.shortName || ''}
              onChange={(e) => handleChange('shortName', e.target.value)}
              placeholder="Shubham"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Professional Role
            </label>
            <input
              type="text"
              value={data?.role || ''}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="Full Stack Developer"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full min-w-0">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={data?.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="India"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Availability
            </label>
            <input
              type="text"
              value={data?.availability || ''}
              onChange={(e) => handleChange('availability', e.target.value)}
              placeholder="Full-time / Freelance"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Stack Summary
            </label>
            <input
              type="text"
              value={data?.stackSummary || ''}
              onChange={(e) => handleChange('stackSummary', e.target.value)}
              placeholder="React · Next.js · Node.js · TypeScript"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Bio Paragraphs */}
        <div className="w-full min-w-0">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Bio Paragraph 1 (ScrollReveal)
          </label>
          <textarea
            rows={3}
            value={data?.bioParagraph1 || ''}
            onChange={(e) => handleChange('bioParagraph1', e.target.value)}
            className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none leading-relaxed transition"
          />
        </div>

        <div className="w-full min-w-0">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Bio Paragraph 2 (ScrollReveal)
          </label>
          <textarea
            rows={3}
            value={data?.bioParagraph2 || ''}
            onChange={(e) => handleChange('bioParagraph2', e.target.value)}
            className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none leading-relaxed transition"
          />
        </div>
      </div>

      {/* "What I Do" Capsules */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2 w-full min-w-0">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900">"What I Do" Marquee Capsules</h3>
            <p className="text-[12px] font-semibold text-slate-500">Pills displayed in the LogoLoop animation on the About section</p>
          </div>
          <button
            type="button"
            onClick={handleAddWhatIDo}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shrink-0"
          >
            <FiPlus className="size-3.5 text-amber-500" />
            <span>Add Capsule</span>
          </button>
        </div>

        <div className="space-y-2.5 w-full min-w-0">
          {data?.whatIDo?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full min-w-0 p-3 sm:p-0 rounded-xl sm:rounded-none bg-slate-50/60 sm:bg-transparent border sm:border-0 border-slate-200/70"
            >
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => handleUpdateWhatIDo(index, 'title', e.target.value)}
                placeholder="Discipline Title (e.g. Full Stack Development)"
                className="flex-1 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start min-w-0">
                <div className="flex-1 sm:flex-initial min-w-0">
                  <AdminSelect
                    value={item.icon || 'code'}
                    onChange={(val) => handleUpdateWhatIDo(index, 'icon', val)}
                    headerTitle="Discipline Icon"
                    align="right"
                    fullWidth
                    className="w-full sm:w-auto"
                    options={[
                      { value: 'code', label: 'Icon: Code', icon: FiCode },
                      { value: 'terminal', label: 'Icon: Terminal', icon: FiTerminal },
                      { value: 'layers', label: 'Icon: Layers', icon: FiLayers },
                      { value: 'activity', label: 'Icon: Activity', icon: FiActivity },
                    ]}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveWhatIDo(index)}
                  className="rounded-xl p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                  title="Delete capsule"
                >
                  <FiTrash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
