import React from 'react';
import { createPortal } from 'react-dom';
import { FiType, FiPlus, FiEdit, FiX } from 'react-icons/fi';

export default function MarqueeManager({
  marquee,
  onAdd,
  onEdit,
  onDelete,
  editingMarquee,
  setEditingMarquee,
  onSaveMarquee,
  saving,
}) {
  return (
    <>
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiType className="text-amber-500" />
              <span>Marquee Velocity Text Items</span>
            </h3>
            <p className="text-[13px] font-semibold text-slate-500 mt-0.5">
              Items scrolling horizontally across the Skills section (e.g. "Frontend Developer", "Problem Solver")
            </p>
          </div>

          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition cursor-pointer"
          >
            <FiPlus className="size-3.5" />
            <span>Add Marquee Text</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {marquee.map((m) => (
            <div
              key={m._id}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800"
            >
              <span>{m.text}</span>
              <button
                onClick={() => onEdit(m)}
                className="text-slate-400 hover:text-slate-800 ml-1 cursor-pointer"
              >
                <FiEdit className="size-3" />
              </button>
              <button
                onClick={() => onDelete(m)}
                className="text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <FiX className="size-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Modal */}
      {editingMarquee && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingMarquee._id ? 'Edit Marquee Text' : 'Add Marquee Text'}
              </h3>
              <button
                onClick={() => setEditingMarquee(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="size-5" />
              </button>
            </div>

            <form onSubmit={onSaveMarquee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Ticker Text *
                </label>
                <input
                  type="text"
                  required
                  value={editingMarquee.text}
                  onChange={(e) => setEditingMarquee({ ...editingMarquee, text: e.target.value })}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMarquee(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-950 hover:bg-black px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50 cursor-pointer"
                >
                  Save Text
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
