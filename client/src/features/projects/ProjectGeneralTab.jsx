import React from 'react';
import { FiGlobe, FiStar, FiCheck } from 'react-icons/fi';

export default function ProjectGeneralTab({ editingProject, setEditingProject }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Project Title *
          </label>
          <input
            type="text"
            required
            value={editingProject.title || ''}
            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
            placeholder="e.g. BarbaeQ"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Slug (URL identifier) *
          </label>
          <input
            type="text"
            required
            value={editingProject.slug || ''}
            onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
            placeholder="e.g. barbaeq"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
          Tagline / Hook
        </label>
        <input
          type="text"
          value={editingProject.tagline || ''}
          onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
          placeholder="Brief one-line summary..."
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Project Type
          </label>
          <input
            type="text"
            value={editingProject.type || ''}
            onChange={(e) => setEditingProject({ ...editingProject, type: e.target.value })}
            placeholder="e.g. Full Stack Web App"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Year / Timeline
          </label>
          <input
            type="text"
            value={editingProject.year || ''}
            onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
            placeholder="e.g. 2026"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Accent Color Hex
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={editingProject.accentColor || '#facc15'}
              onChange={(e) => setEditingProject({ ...editingProject, accentColor: e.target.value })}
              className="size-8 rounded border border-slate-200 bg-white cursor-pointer shrink-0"
            />
            <input
              type="text"
              value={editingProject.accentColor || ''}
              onChange={(e) => setEditingProject({ ...editingProject, accentColor: e.target.value })}
              placeholder="#facc15"
              className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Live Website URL
          </label>
          <input
            type="url"
            value={editingProject.liveUrl || ''}
            onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            GitHub Repository URL
          </label>
          <input
            type="url"
            value={editingProject.githubUrl || ''}
            onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        {/* Publish on Portfolio Toggle Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() =>
            setEditingProject({
              ...editingProject,
              published: !(editingProject.published ?? true),
            })
          }
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              setEditingProject({
                ...editingProject,
                published: !(editingProject.published ?? true),
              });
            }
          }}
          className={`group relative flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${(editingProject.published ?? true)
            ? 'border-emerald-200/90 bg-emerald-50/50 hover:bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500/10'
            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
            }`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${(editingProject.published ?? true)
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 scale-105'
                : 'bg-slate-200 text-slate-400'
                }`}
            >
              <FiGlobe className="size-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[13px] font-bold text-slate-900">
                  Publish on Portfolio
                </span>
                <span
                  className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors ${(editingProject.published ?? true)
                    ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                >
                  {(editingProject.published ?? true) ? 'Live' : 'Draft'}
                </span>
              </div>
              <p className="text-[11px] sm:text-[12px] font-semibold text-slate-500 mt-0.5 truncate">
                {(editingProject.published ?? true)
                  ? 'Visible to all visitors on live site'
                  : 'Hidden from public portfolio'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${(editingProject.published ?? true) ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
            >
              <span
                className={`inline-flex size-5 items-center justify-center transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${(editingProject.published ?? true)
                  ? 'translate-x-5 text-emerald-600'
                  : 'translate-x-0.5 text-slate-300'
                  }`}
              >
                {(editingProject.published ?? true) ? (
                  <FiCheck className="size-3 stroke-[3]" />
                ) : (
                  <span className="size-1.5 rounded-full bg-slate-300" />
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Project Toggle Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() =>
            setEditingProject({
              ...editingProject,
              featured: !(editingProject.featured ?? true),
            })
          }
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              setEditingProject({
                ...editingProject,
                featured: !(editingProject.featured ?? true),
              });
            }
          }}
          className={`group relative flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${(editingProject.featured ?? true)
            ? 'border-amber-200/90 bg-amber-50/50 hover:bg-amber-50/80 shadow-xs ring-1 ring-amber-500/10'
            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
            }`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${(editingProject.featured ?? true)
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                : 'bg-slate-200 text-slate-400'
                }`}
            >
              <FiStar className="size-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[13px] font-bold text-slate-900">
                  Featured Project
                </span>
                <span
                  className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors ${(editingProject.featured ?? true)
                    ? 'bg-amber-100/80 text-amber-900 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                >
                  {(editingProject.featured ?? true) ? 'Featured' : 'Standard'}
                </span>
              </div>
              <p className="text-[11px] sm:text-[12px] font-semibold text-slate-500 mt-0.5 truncate">
                {(editingProject.featured ?? true)
                  ? 'Spotlighted in hero showcase'
                  : 'Listed in standard project archive'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${(editingProject.featured ?? true) ? 'bg-amber-500' : 'bg-slate-300'
                }`}
            >
              <span
                className={`inline-flex size-5 items-center justify-center transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${(editingProject.featured ?? true)
                  ? 'translate-x-5 text-amber-600'
                  : 'translate-x-0.5 text-slate-300'
                  }`}
              >
                {(editingProject.featured ?? true) ? (
                  <FiCheck className="size-3 stroke-[3]" />
                ) : (
                  <span className="size-1.5 rounded-full bg-slate-300" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
