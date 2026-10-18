import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiExternalLink, FiGithub } from 'react-icons/fi';
import { GripVertical } from 'lucide-react';

export default function ProjectTable({
  projects,
  onEdit,
  onDelete,
  onReorder,
  canReorder = true,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    if (!canReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    if (!canReorder || draggedIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    if (!canReorder || draggedIndex === null) return;
    e.preventDefault();
    if (draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...projects];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);

    if (onReorder) {
      onReorder(reordered);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 uppercase text-slate-500 font-semibold tracking-wider text-[12px] whitespace-nowrap">
            <tr>
              <th className="w-10 px-3 py-3 text-center whitespace-nowrap">
                <span className="sr-only">Order</span>
              </th>
              <th className="px-4 py-3 whitespace-nowrap">Project</th>
              <th className="px-4 py-3 whitespace-nowrap">Slug</th>
              <th className="px-4 py-3 whitespace-nowrap">Type & Year</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Links</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p, index) => {
              const isDragging = draggedIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <tr
                  key={p._id || p.id}
                  draggable={canReorder}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`transition-all select-none ${
                    isDragging
                      ? 'opacity-30 bg-amber-50/70 scale-[0.99]'
                      : isOver
                      ? 'bg-amber-50/80 border-t-2 border-amber-500'
                      : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Drag Handle */}
                  <td className="w-10 px-2 py-3 text-center whitespace-nowrap">
                    <div
                      className={`inline-flex items-center justify-center size-7 rounded-lg text-slate-400 transition ${
                        canReorder
                          ? 'cursor-grab active:cursor-grabbing hover:text-amber-600 hover:bg-amber-50'
                          : 'opacity-25 cursor-not-allowed'
                      }`}
                      title={
                        canReorder
                          ? 'Drag to reorder'
                          : 'Clear search/filter to reorder'
                      }
                    >
                      <GripVertical className="size-4" />
                    </div>
                  </td>

                  {/* Project info */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="size-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className="size-full flex items-center justify-center text-xs font-bold uppercase tracking-wider text-white"
                            style={{
                              background: p.accentColor
                                ? `linear-gradient(135deg, ${p.accentColor}, #0F172A)`
                                : 'linear-gradient(135deg, #f59e0b, #0F172A)',
                            }}
                          >
                            {p.title?.slice(0, 2) || 'PR'}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[260px] sm:max-w-xs">
                        <p className="font-bold text-slate-900 text-sm truncate" title={p.title}>
                          {p.title}
                        </p>
                        <p className="text-[12px] text-slate-500 font-semibold truncate" title={p.tagline}>
                          {p.tagline}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">
                    /work/{p.slug}
                  </td>

                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                    <span className="font-semibold text-[13px] whitespace-nowrap">{p.type}</span>
                    <span className="block text-[12px] text-slate-500 font-semibold whitespace-nowrap">
                      {p.year}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap ${
                        p.published
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                      }`}
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onMouseDown={(e) => e.stopPropagation()}
                          className="rounded p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="Live Demo"
                        >
                          <FiExternalLink className="size-3.5" />
                        </a>
                      )}
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          onMouseDown={(e) => e.stopPropagation()}
                          className="rounded p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="Source Code"
                        >
                          <FiGithub className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onEdit(p)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Project"
                      >
                        <FiEdit className="size-4" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onDelete(p)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Project"
                      >
                        <FiTrash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
