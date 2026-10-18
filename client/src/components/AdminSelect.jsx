import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

/**
 * Modern Custom Dropdown Select matching the AnalyticsChart dropdown aesthetic
 * 
 * @param {Array<string | { value: string, label: string, icon?: React.ComponentType }>} options
 * @param {string} value
 * @param {(value: string) => void} onChange
 * @param {React.ComponentType} [icon]
 * @param {string} [placeholder]
 * @param {string} [headerTitle]
 * @param {boolean} [fullWidth]
 * @param {'left' | 'right'} [align='left']
 * @param {string} [className]
 */
export default function AdminSelect({
  options = [],
  value,
  onChange,
  icon: Icon,
  placeholder = 'Select option',
  headerTitle,
  fullWidth = false,
  align = 'left',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options to { value, label, icon }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value ?? '',
        label: opt.label ?? opt.value ?? '',
        icon: opt.icon,
      };
    }
    return {
      value: String(opt),
      label: String(opt),
      icon: null,
    };
  });

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [effectiveAlign, setEffectiveAlign] = useState(align);

  useEffect(() => {
    setEffectiveAlign(align);
  }, [align]);

  const handleToggle = () => {
    if (!open && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const estimatedWidth = 200;
      // If right-aligned, check if it would push menu off the left edge (< 16px)
      if (align === 'right' && rect.right - estimatedWidth < 16) {
        setEffectiveAlign('left');
      } else if (align === 'left' && rect.left + estimatedWidth > window.innerWidth - 16) {
        setEffectiveAlign('right');
      } else {
        setEffectiveAlign(align);
      }
    }
    setOpen((prev) => !prev);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${className} `}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={
          fullWidth
            ? `w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 px-3.5 py-2 text-[13px] font-semibold text-slate-800 transition shadow-2xs hover:border-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${open ? 'border-amber-500 ring-2 ring-amber-500/20 bg-white' : ''
            }`
            : `inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 px-3.5 py-1.5 text-[13px] font-semibold text-slate-800 transition shadow-2xs hover:border-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${open ? 'border-amber-500 ring-2 ring-amber-500/20 bg-white' : ''
            }`
        }
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon className="size-3.5 text-amber-500 shrink-0" />}
          {selectedOption?.icon && (
            <selectedOption.icon className="size-3.5 text-amber-500 shrink-0" />
          )}
          <span className="truncate">{displayLabel}</span>
        </div>

        <FiChevronDown
          className={`size-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${fullWidth ? 'ml-2' : ''
            } ${open ? 'rotate-180 text-slate-700' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1.5 min-w-[190px] w-max max-w-[calc(100vw-2.5rem)] ${fullWidth ? 'w-full' : ''
            } ${effectiveAlign === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'
            } rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto custom-scrollbar`}
        >
          {headerTitle && (
            <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {headerTitle}
            </div>
          )}
          <div className="space-y-0.5">
            {normalizedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] font-semibold transition cursor-pointer text-left ${isSelected
                    ? 'bg-amber-50 text-amber-950 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {OptIcon && (
                      <OptIcon
                        className={`size-3.5 ${isSelected ? 'text-amber-600' : 'text-slate-400'
                          }`}
                      />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && (
                    <FiCheck className="size-3.5 text-amber-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
