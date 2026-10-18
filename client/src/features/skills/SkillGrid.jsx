import React, { useState } from 'react';
import { FiCpu, FiEdit, FiTrash2 } from 'react-icons/fi';
import { GripVertical } from 'lucide-react';

export default function SkillGrid({
  skills,
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

    const reordered = [...skills];
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {skills.map((skill, index) => {
        const isDragging = draggedIndex === index;
        const isOver = dragOverIndex === index;

        return (
          <div
            key={skill._id || skill.id}
            draggable={canReorder}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative flex flex-col items-center justify-center rounded-2xl p-4 text-center select-none transition-all ${
              canReorder ? 'cursor-grab active:cursor-grabbing' : ''
            } ${
              isDragging
                ? 'opacity-30 scale-95 border border-dashed border-amber-400 bg-amber-50/50'
                : isOver
                ? 'ring-2 ring-amber-500 scale-105 border-amber-400 shadow-md bg-amber-50/40 z-10'
                : 'border border-slate-200/90 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-amber-400/80 hover:shadow-md'
            }`}
          >
            {/* Grip handle indicator */}
            <div
              className="absolute top-2.5 left-2.5 text-slate-300 opacity-60 group-hover:opacity-100 group-hover:text-slate-500 transition pointer-events-none"
              title="Drag to reorder"
            >
              <GripVertical className="size-3.5" />
            </div>

            {/* Icon */}
            <div className="size-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 mb-2 group-hover:scale-110 transition pointer-events-none">
              {skill.iconUrl ? (
                <img
                  src={skill.iconUrl}
                  alt={skill.name}
                  className="size-full object-contain pointer-events-none"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <FiCpu className="size-5 text-slate-400" />
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-900 truncate max-w-full pointer-events-none">
              {skill.name}
            </h4>
            <span className="text-[12px] font-semibold text-slate-400 mt-0.5 pointer-events-none">
              {skill.category}
            </span>

            {/* Action buttons overlay */}
            <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => onEdit(skill)}
                className="rounded p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                title="Edit Skill"
              >
                <FiEdit className="size-3" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => onDelete(skill)}
                className="rounded p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Delete Skill"
              >
                <FiTrash2 className="size-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
