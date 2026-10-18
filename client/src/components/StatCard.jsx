import React from 'react';

export default function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  color = '#eab308',
  bgColor = 'bg-amber-50',
  textColor = 'text-amber-500',
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between w-full min-w-0">
      {/* Top Header: Title & Pastel Icon Box */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="text-xs sm:text-sm font-semibold text-slate-600 truncate min-w-0">
          {title}
        </span>
        {Icon && (
          <div
            className={`flex size-8 sm:size-10 items-center justify-center rounded-xl shrink-0 ${bgColor} ${textColor}`}
          >
            <Icon className="size-4 sm:size-5" />
          </div>
        )}
      </div>

      {/* Main Big Number Metric */}
      <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2 flex-wrap min-w-0">
        <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
          {typeof value === 'number' ? value.toLocaleString() : value ?? '0'}
        </span>
        {change && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ${changeType === 'positive'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-slate-100 text-slate-600'
              }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
