import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function ProjectBadgesTab({
  editingProject,
  handleAddBadge,
  handleUpdateBadge,
  handleRemoveBadge,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Technology Badges (Header pills)</h4>
          <p className="text-xs font-semibold text-slate-500">Pills displayed on project card with custom brand color and SVG icon</p>
        </div>
        <button
          type="button"
          onClick={handleAddBadge}
          className="self-start sm:self-auto inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition cursor-pointer"
        >
          <FiPlus className="size-3.5" />
          <span>Add Badge</span>
        </button>
      </div>

      <div className="space-y-3">
        {editingProject.techBadges?.map((b, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-3.5">
            <div className="flex items-center justify-between sm:hidden">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Badge #{i + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveBadge(i)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition cursor-pointer"
                title="Remove Badge"
              >
                <FiTrash2 className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:contents gap-3">
              <div className="col-span-1 sm:flex-1 min-w-0">
                <span className="text-xs text-slate-500 font-semibold block mb-0.5">Name</span>
                <input
                  type="text"
                  value={b.name || ''}
                  onChange={(e) => handleUpdateBadge(i, 'name', e.target.value)}
                  placeholder="e.g. React"
                  className="w-full bg-transparent border-b border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none pb-1 font-semibold"
                />
              </div>

              <div className="col-span-1 sm:w-28 shrink-0">
                <span className="text-xs text-slate-500 font-semibold block mb-0.5">Color</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={b.color || '#61DAFB'}
                    onChange={(e) => handleUpdateBadge(i, 'color', e.target.value)}
                    className="size-6 rounded border-none bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={b.color || ''}
                    onChange={(e) => handleUpdateBadge(i, 'color', e.target.value)}
                    placeholder="#61DAFB"
                    className="w-16 sm:w-16 flex-1 min-w-0 bg-transparent border-b border-slate-200 text-[11px] text-slate-700 focus:border-amber-500 focus:outline-none uppercase font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-500 block mb-0.5">Logo URL</span>
              <input
                type="text"
                value={b.logo || ''}
                onChange={(e) => handleUpdateBadge(i, 'logo', e.target.value)}
                placeholder="https://cdn.simpleicons.org/..."
                className="w-full bg-transparent border-b border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none pb-1 font-semibold"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveBadge(i)}
              className="hidden sm:block text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition cursor-pointer shrink-0"
              title="Remove Badge"
            >
              <FiTrash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
