import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { GripVertical } from 'lucide-react';

export default function CertificationTable({
  certs,
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

    const reordered = [...certs];
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
          <thead className="bg-slate-50 border-b border-slate-200 uppercase text-slate-500 font-semibold tracking-wider text-[11px] whitespace-nowrap">
            <tr>
              <th className="w-10 px-3 py-3 text-center whitespace-nowrap">
                <span className="sr-only">Order</span>
              </th>
              <th className="px-4 py-3 whitespace-nowrap">Certification</th>
              <th className="px-4 py-3 whitespace-nowrap">Issuer & Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Category</th>
              <th className="px-4 py-3 whitespace-nowrap">Credential URL</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {certs.map((c, index) => {
              const isDragging = draggedIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <tr
                  key={c._id || c.id}
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
                      title={canReorder ? 'Drag to reorder' : 'Reordering disabled'}
                    >
                      <GripVertical className="size-4" />
                    </div>
                  </td>

                  {/* Certification Info */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <img
                          src={c.image || c.issuerLogo}
                          alt={c.title}
                          className="size-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0 max-w-[260px] sm:max-w-xs">
                        <p className="font-bold text-slate-900 text-[13px] truncate" title={c.title}>
                          {c.title}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500 truncate" title={c.description}>
                          {c.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-800 whitespace-nowrap">
                    <span className="font-semibold">{c.issuer}</span>
                    <span className="block text-[11px] font-semibold text-slate-400">
                      {c.fullDate || c.issueDate}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap"
                      style={{
                        backgroundColor: `${c.accentColor || '#facc15'}15`,
                        borderColor: `${c.accentColor || '#facc15'}40`,
                        color: `${c.accentColor || '#d97706'}`,
                      }}
                    >
                      {c.category}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {c.credentialUrl ? (
                      <a
                        href={c.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        onMouseDown={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-amber-600 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>Verify</span>
                        <FiExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onEdit(c)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Certification"
                      >
                        <FiEdit className="size-4" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onDelete(c)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Certification"
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
