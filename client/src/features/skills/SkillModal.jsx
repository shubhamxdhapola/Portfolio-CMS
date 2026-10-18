import React from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiTag } from 'react-icons/fi';
import ImageUploader from '../../components/ImageUploader';
import AdminSelect from '../../components/AdminSelect';
import useImageUploading from '../../hooks/useImageUploading';

export default function SkillModal({
  editingSkill,
  setEditingSkill,
  onSaveSkill,
  onClose,
  saving,
  categories,
}) {
  const isImageUploading = useImageUploading();
  if (!editingSkill || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-900 truncate pr-2">
            {editingSkill._id ? `Edit Skill: ${editingSkill.name}` : 'Add Technology Skill'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <form onSubmit={onSaveSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={editingSkill.name}
              onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
              placeholder="e.g. ReactJS"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Category
            </label>
            <AdminSelect
              value={editingSkill.category}
              onChange={(val) => setEditingSkill({ ...editingSkill, category: val })}
              options={categories}
              icon={FiTag}
              headerTitle="Select Category"
              fullWidth
            />
          </div>

          <ImageUploader
            label="Icon Asset or URL"
            value={editingSkill.iconUrl || ''}
            publicId={editingSkill.iconPublicId || ''}
            onChange={({ url, publicId }) =>
              setEditingSkill({ ...editingSkill, iconUrl: url, iconPublicId: publicId })
            }
            folder="portfolio_cms/skills"
            description="SVG or PNG icon"
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || isImageUploading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 hover:bg-black px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
            >
              <span>
                {saving
                  ? 'Saving...'
                  : isImageUploading
                    ? 'Uploading Icon...'
                    : 'Save Skill'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
