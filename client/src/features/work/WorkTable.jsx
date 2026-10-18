import React from 'react';
import { FiBriefcase, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function WorkTable({ workList, onEdit, onDelete }) {
  return (
    <div className="grid gap-4">
      {workList.map((item) => (
        <div
          key={item._id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-amber-400/60 transition min-w-0"
        >
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600">
              <FiBriefcase className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 truncate">{item.role}</h4>
              <p className="text-xs font-semibold text-amber-600 mt-0.5 truncate">{item.company} ● {item.employmentType}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 max-w-xl break-words">{item.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-slate-600 font-semibold">
                  {item.startDate} — {item.isCurrent ? 'Present' : item.endDate}
                </span>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-slate-600 font-semibold">
                  {item.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => onEdit(item)}
              className="rounded-lg p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <FiEdit className="size-4" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="rounded-lg p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <FiTrash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
