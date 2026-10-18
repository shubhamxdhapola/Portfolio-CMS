import React from 'react';
import { FiLoader, FiSave } from 'react-icons/fi';

export default function CertificationPageSettings({ pageSettings, setPageSettings, onSave, saving }) {
  if (!pageSettings) return null;

  return (
    <form
      onSubmit={onSave}
      className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Certifications Page Static Content</h3>
          <p className="text-xs font-semibold text-slate-500">Headings and descriptions displayed at /certifications</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 hover:bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm transition cursor-pointer"
        >
          {saving ? <FiLoader className="size-4 animate-spin text-amber-400" /> : <FiSave className="size-4 text-amber-400" />}
          <span>Save Page Header</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 block mb-1">Watermark</span>
          <input
            type="text"
            value={pageSettings.watermark || ''}
            onChange={(e) => setPageSettings({ ...pageSettings, watermark: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 uppercase focus:border-amber-500 focus:outline-none transition"
          />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 block mb-1">Page Heading</span>
          <input
            type="text"
            value={pageSettings.heading || ''}
            onChange={(e) => setPageSettings({ ...pageSettings, heading: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 uppercase focus:border-amber-500 focus:outline-none transition"
          />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 block mb-1">Subheading / Badge</span>
          <input
            type="text"
            value={pageSettings.subheading || ''}
            onChange={(e) => setPageSettings({ ...pageSettings, subheading: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 uppercase focus:border-amber-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 block mb-1">Description</span>
        <textarea
          rows={2}
          value={pageSettings.description || ''}
          onChange={(e) => setPageSettings({ ...pageSettings, description: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-amber-500 focus:outline-none transition"
        />
      </div>
    </form>
  );
}
