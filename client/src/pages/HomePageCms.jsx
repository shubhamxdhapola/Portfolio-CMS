import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FiSave,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiLayers,
  FiUser,
  FiFolder,
  FiCpu,
  FiCode,
  FiAward,
  FiBookOpen,
  FiMail,
} from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import { usePortfolioData } from '../context/PortfolioDataContext';

const SECTION_METADATA = {
  about: {
    name: 'About Me Section',
    badge: '#about',
    icon: FiUser,
    color: 'text-blue-600 bg-blue-50 border-blue-200/80',
    description: 'Header displayed above your bio narrative, profile badges, and social links.',
  },
  projects: {
    name: 'Projects Section',
    badge: '#work',
    icon: FiFolder,
    color: 'text-amber-600 bg-amber-50 border-amber-200/80',
    description: 'Header displayed above your featured interactive project case studies.',
  },
  skills: {
    name: 'Skills & Tech Stack',
    badge: '#skills',
    icon: FiCpu,
    color: 'text-purple-600 bg-purple-50 border-purple-200/80',
    description: 'Header displayed above your interactive 3D skill artwork and badges.',
  },
  leetcode: {
    name: 'LeetCode / Problem Solving',
    badge: '#leetcode',
    icon: FiCode,
    color: 'text-orange-600 bg-orange-50 border-orange-200/80',
    description: 'Header displayed above your live LeetCode stats, contest rank, and badges.',
  },
  certifications: {
    name: 'Certifications Section',
    badge: '#certifications',
    icon: FiAward,
    color: 'text-pink-600 bg-pink-50 border-pink-200/80',
    description: 'Header displayed above your stacked certification credential cards.',
  },
  education: {
    name: 'Education Section',
    badge: '#education',
    icon: FiBookOpen,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200/80',
    description: 'Header displayed above your academic journey timeline and degrees.',
  },
  contact: {
    name: 'Contact Section',
    badge: '#contact',
    icon: FiMail,
    color: 'text-rose-600 bg-rose-50 border-rose-200/80',
    description: 'Header displayed above your contact form and direct email actions.',
  },
};

export default function HomePageCms() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useOutletContext();
  const { refreshData } = usePortfolioData();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/home');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleHeroChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const handleSectionChange = (sectionKey, field, value) => {
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: { ...prev.sections[sectionKey], [field]: value },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await apiClient.put('/admin/home', data);
      if (res.success) {
        showToast('Home page settings saved successfully!');
        refreshData?.();
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

  const { hero, sections } = data || {};

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-5xl w-full min-w-0">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Home Page Content & Sections</h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Customize the animated hero banner, tagline, CTAs, watermarks, and section titles.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-black px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer shrink-0"
        >
          {saving ? <FiLoader className="size-4 animate-spin text-amber-400" /> : <FiSave className="size-4 text-amber-400" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Hero Section Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-5 sm:space-y-6 min-w-0">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <FiLayers className="size-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-700">Hero Banner Section</h3>
          </div>
        </div>

        {/* Animated Headline: Prefix Accent Suffix */}
        <div>
          <label className="block text-[13px] font-semibold uppercase tracking-wider text-slate-600 mb-3">
            Main Animated Headline ("Code × Repeat")
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Prefix Word</span>
              <input
                type="text"
                value={hero?.headlinePrefix || ''}
                onChange={(e) => handleHeroChange('headlinePrefix', e.target.value)}
                placeholder="Code"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-semibold text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
              />
            </div>
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Accent Symbol</span>
              <input
                type="text"
                value={hero?.headlineAccent || ''}
                onChange={(e) => handleHeroChange('headlineAccent', e.target.value)}
                placeholder="X"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
              />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">Suffix Word</span>
              <input
                type="text"
                value={hero?.headlineSuffix || ''}
                onChange={(e) => handleHeroChange('headlineSuffix', e.target.value)}
                placeholder="Repeat"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
              />
            </div>
          </div>
          <p className="mt-2 text-[13px] font-semibold text-slate-500">
            Preview: <strong className="text-slate-700 font-rajdhani text-sm">{hero?.headlinePrefix} <span className="text-amber-500">{hero?.headlineAccent}</span> {hero?.headlineSuffix}</strong>
          </p>
        </div>

        {/* Hero Tagline & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Hero Tagline
            </label>
            <input
              type="text"
              value={hero?.tagline || ''}
              onChange={(e) => handleHeroChange('tagline', e.target.value)}
              placeholder="Hello, I’m Shubham — a Full Stack Developer"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              value={hero?.email || ''}
              onChange={(e) => handleHeroChange('email', e.target.value)}
              placeholder="shubhamxdhapola@gmail.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-2">
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-slate-600">
              Primary CTA
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={hero?.primaryCtaText || ''}
                onChange={(e) => handleHeroChange('primaryCtaText', e.target.value)}
                placeholder="Button Label"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
              />
              <input
                type="text"
                value={hero?.primaryCtaUrl || ''}
                onChange={(e) => handleHeroChange('primaryCtaUrl', e.target.value)}
                placeholder="URL or #hash"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-slate-600">
              Secondary CTA
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={hero?.secondaryCtaText || ''}
                onChange={(e) => handleHeroChange('secondaryCtaText', e.target.value)}
                placeholder="Button Label"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
              />
              <input
                type="text"
                value={hero?.secondaryCtaUrl || ''}
                onChange={(e) => handleHeroChange('secondaryCtaUrl', e.target.value)}
                placeholder="URL or #hash"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Headings & Watermarks */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-700">Section Headings & Watermarks</h3>
          <p className="text-[13px] text-slate-500 font-semibold">
            Configure the background watermark text, foreground titles, and subheadings across all portfolio sections.
          </p>
        </div>

        <div className="grid gap-4">
          {sections &&
            Object.keys(sections).map((secKey) => {
              const sec = sections[secKey];
              const meta = SECTION_METADATA[secKey] || {
                name: `${secKey.charAt(0).toUpperCase() + secKey.slice(1)} Section`,
                badge: `#${secKey}`,
                icon: FiLayers,
                color: 'text-slate-600 bg-slate-50 border-slate-200',
                description: `Section heading configuration for ${secKey}.`,
              };
              const Icon = meta.icon;

              return (
                <div
                  key={secKey}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4"
                >
                  {/* Indicator Header */}
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`hidden md:flex p-2 rounded-xl border ${meta.color} items-center justify-center shrink-0`}>
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800">
                            {meta.name}
                          </h4>
                          {/* <span className="text-[12px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80">
                            {meta.badge}
                          </span> */}
                        </div>
                        <p className="text-[12px] font-semibold text-slate-400">
                          {meta.description}
                        </p>
                      </div>
                    </div>

                    {/* <button
                      type="button"
                      onClick={() => handleSectionChange(secKey, 'isVisible', !(sec.isVisible ?? true))}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${sec.isVisible ?? true
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60 hover:bg-emerald-100/60'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200/60'
                        }`}
                    >
                      {sec.isVisible ?? true ? <FiEye className="size-3.5" /> : <FiEyeOff className="size-3.5" />}
                      <span>{sec.isVisible ?? true ? 'Visible' : 'Hidden'}</span>
                    </button> */}
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-600 block mb-1">Watermark Text</span>
                      <input
                        type="text"
                        value={sec.watermark || ''}
                        onChange={(e) => handleSectionChange(secKey, 'watermark', e.target.value)}
                        placeholder="BACKGROUND WATERMARK"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none uppercase transition"
                      />
                    </div>
                    <div>
                      <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-600 block mb-1">Foreground Title</span>
                      <input
                        type="text"
                        value={sec.title || ''}
                        onChange={(e) => handleSectionChange(secKey, 'title', e.target.value)}
                        placeholder="Section Title"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-600 block mb-1">Subtitle / Eyebrow</span>
                      <input
                        type="text"
                        value={sec.subtitle || ''}
                        onChange={(e) => handleSectionChange(secKey, 'subtitle', e.target.value)}
                        placeholder="SUBTITLE"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none uppercase transition"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </form>
  );
}
