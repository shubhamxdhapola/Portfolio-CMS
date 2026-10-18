import React from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

export default function WorkModal({ editingItem, setEditingItem, onSave, onClose, saving }) {
  if (!editingItem || typeof document === 'undefined') return null;

  const handleAddResponsibility = () => {
    setEditingItem((prev) => ({
      ...prev,
      responsibilities: [...(prev.responsibilities || []), ''],
    }));
  };

  const handleUpdateResponsibility = (index, value) => {
    setEditingItem((prev) => {
      const updated = [...(prev.responsibilities || [])];
      updated[index] = value;
      return { ...prev, responsibilities: updated };
    });
  };

  const handleRemoveResponsibility = (index) => {
    setEditingItem((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[94vh] sm:max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/70 shrink-0">
          <h3 className="text-base font-bold text-slate-900 truncate pr-2">
            {editingItem._id ? 'Edit Work Entry' : 'Add Work Entry'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Company / Organization *
              </label>
              <input
                type="text"
                required
                value={editingItem.company || ''}
                onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                placeholder="e.g. Freelance Client"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Role / Job Title *
              </label>
              <input
                type="text"
                required
                value={editingItem.role || ''}
                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                placeholder="Full Stack Developer"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Type</label>
              <input
                type="text"
                value={editingItem.employmentType || ''}
                onChange={(e) => setEditingItem({ ...editingItem, employmentType: e.target.value })}
                placeholder="Full-time / Contract"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Start Date</label>
              <input
                type="text"
                value={editingItem.startDate || ''}
                onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                placeholder="2025"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">End Date</label>
              <input
                type="text"
                value={editingItem.endDate || ''}
                onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                placeholder="Present"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Description</label>
            <textarea
              rows={2}
              value={editingItem.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
            />
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Key Achievements</span>
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
              >
                + Add Item
              </button>
            </div>
            {editingItem.responsibilities?.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateResponsibility(i, e.target.value)}
                  className="flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveResponsibility(i)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 cursor-pointer shrink-0"
                >
                  <FiX className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-initial rounded-xl bg-slate-950 hover:bg-black px-5 py-2.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer text-center"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
