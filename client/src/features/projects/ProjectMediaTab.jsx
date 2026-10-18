import React from 'react';
import { FiX } from 'react-icons/fi';
import ImageUploader from '../../components/ImageUploader';

export default function ProjectMediaTab({
  editingProject,
  setEditingProject,
  handleAddListItem,
  handleUpdateListItem,
  handleRemoveListItem,
}) {
  return (
    <div className="space-y-6">
      <ImageUploader
        label="Project Thumbnail Image"
        value={editingProject.image || ''}
        publicId={editingProject.imagePublicId || ''}
        onChange={({ url, publicId }) =>
          setEditingProject({ ...editingProject, image: url, imagePublicId: publicId })
        }
        folder="portfolio_cms/projects"
        description="16:9 aspect ratio thumbnail (e.g. /thumbnails/barbaeq_thumbnail.png)"
      />

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
          Short Description (Card summary)
        </label>
        <textarea
          rows={2}
          value={editingProject.description || ''}
          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
          placeholder="A summary of the project for cards and lists..."
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none leading-relaxed transition"
        />
      </div>

      {/* Bullet Highlights */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Feature Bullet Highlights
          </label>
          <button
            type="button"
            onClick={() => handleAddListItem('bullets')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
          >
            + Add Bullet
          </button>
        </div>

        {editingProject.bullets?.map((bullet, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={bullet}
              onChange={(e) => handleUpdateListItem('bullets', i, e.target.value)}
              placeholder="Feature highlight..."
              className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-3 sm:px-3.5 py-2 text-xs sm:text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
            />
            <button
              type="button"
              onClick={() => handleRemoveListItem('bullets', i)}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition cursor-pointer shrink-0"
            >
              <FiX className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Technologies Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Technology Tags
          </label>
          <button
            type="button"
            onClick={() => handleAddListItem('technologies')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
          >
            + Add Technology
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {editingProject.technologies?.map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-800 font-semibold"
            >
              <input
                type="text"
                value={tech}
                onChange={(e) => handleUpdateListItem('technologies', i, e.target.value)}
                placeholder="Tech"
                className="bg-transparent border-none text-xs text-slate-800 focus:outline-none w-24 font-semibold"
              />
              <button
                type="button"
                onClick={() => handleRemoveListItem('technologies', i)}
                className="text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <FiX className="size-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
