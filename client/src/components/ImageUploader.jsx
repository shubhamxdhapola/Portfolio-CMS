import React, { useState, useRef, useEffect } from 'react';
import { FiUploadCloud, FiImage, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import { apiClient } from '../api/client.js';

export default function ImageUploader({
  label = 'Upload Image',
  value = '',
  publicId = '',
  onChange,
  onUploadingChange,
  folder = 'portfolio_cms',
  description = 'PNG, JPG, WEBP or SVG up to 10MB',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const fileInputRef = useRef(null);
  const isUploadingRef = useRef(false);

  const notifyUploadState = (isUploading) => {
    isUploadingRef.current = isUploading;
    setUploading(isUploading);
    onUploadingChange?.(isUploading);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('admin_media_upload_state', { detail: { isUploading } })
      );
    }
  };

  useEffect(() => {
    return () => {
      if (isUploadingRef.current) {
        notifyUploadState(false);
      }
    };
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    notifyUploadState(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success && res.data) {
        onChange({ url: res.data.url, publicId: res.data.publicId });
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Image upload failed. You can paste an image URL instead.');
    } finally {
      notifyUploadState(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange({ url: '', publicId: '' });
    setError('');
  };

  return (
    <div className="space-y-2 w-full min-w-0">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <label className="text-[12px] font-semibold uppercase tracking-wider text-slate-600 truncate min-w-0">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-[12px] font-semibold text-amber-600 hover:text-amber-700 hover:underline shrink-0"
        >
          {manualMode ? 'Switch to File Upload' : 'Paste Image URL'}
        </button>
      </div>

      {manualMode ? (
        <div className="flex items-center gap-2 w-full min-w-0">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange({ url: e.target.value, publicId: '' })}
            placeholder="https://example.com/image.png or /thumbnails/..."
            className="flex-1 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl font-semibold border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition shrink-0"
            >
              <FiX className="size-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="w-full min-w-0">
          {value ? (
            <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center gap-3 w-full min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative size-12 sm:size-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                  <img
                    src={value}
                    alt="Uploaded preview"
                    className="size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">{value}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 shrink-0">
                      <FiCheck className="size-3" /> Ready
                    </span>
                    {publicId && (
                      <span className="text-[10px] text-slate-400 font-mono truncate min-w-0 max-w-[150px] sm:max-w-none">
                        ID: {publicId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end sm:justify-start gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200/70 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove image"
                >
                  <FiX className="size-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center hover:border-amber-500 hover:bg-amber-50/20 transition-colors bg-slate-50/50 w-full min-w-0"
            >
              {uploading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-2">
                  <FiLoader className="size-6 text-amber-500 animate-spin" />
                  <span className="text-xs font-semibold text-slate-600">Uploading media...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <FiUploadCloud className="size-5" />
                  </div>
                  <p className="text-[13px] font-semibold text-slate-800">
                    Click to browse or drag & drop image
                  </p>
                  <p className="text-[12px] font-semibold text-slate-500">{description}</p>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
