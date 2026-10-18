import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FiFileText,
  FiUpload,
  FiDownload,
  FiExternalLink,
  FiRotateCcw,
  FiCheckCircle,
  FiLoader,
  FiSave,
  FiPlus,
  FiX,
  FiClock,
  FiAlertCircle,
  FiEye,
} from 'react-icons/fi';
import { API_BASE_URL, apiClient } from '../api/client.js';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function ResumeCms() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [previewTab, setPreviewTab] = useState('pdf');
  const fileInputRef = useRef(null);

  const { showToast } = useOutletContext();
  const { refreshData } = usePortfolioData();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/resume');
      if (res.success) {
        setResume(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsChange = (field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    try {
      setSavingDetails(true);
      const res = await apiClient.put('/admin/resume', resume);
      if (res.success) {
        showToast('Resume metadata saved successfully!');
        refreshData?.();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingDetails(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Only PDF files are permitted for resumes.', 'error');
      return;
    }

    try {
      setUploadingPdf(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('notes', `Updated via Admin CMS on ${new Date().toLocaleDateString()}`);

      const res = await apiClient.post('/admin/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success) {
        showToast(`Resume published successfully as version ${res.data.currentVersion}!`);
        setResume(res.data);
        refreshData?.();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRestoreVersion = async (versionId) => {
    try {
      setRestoringId(versionId);
      const res = await apiClient.post(`/admin/resume/restore/${versionId}`);
      if (res.success) {
        showToast('Previous resume version restored successfully!');
        setResume(res.data);
        refreshData?.();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRestoringId(null);
    }
  };

  const handleAddHighlight = () => {
    setResume((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), ''],
    }));
  };

  const handleUpdateHighlight = (index, value) => {
    setResume((prev) => {
      const updated = [...(prev.highlights || [])];
      updated[index] = value;
      return { ...prev, highlights: updated };
    });
  };

  const handleRemoveHighlight = (index) => {
    setResume((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <FiLoader className="size-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const pdfStreamUrl = resume?.pdfPublicId
    ? `${API_BASE_URL}/public/resume/pdf`
    : (resume?.pdfUrl || '/Shubham_Dhapola_Resume.pdf');

  const downloadUrl = resume?.pdfPublicId
    ? `${API_BASE_URL}/public/resume/pdf?download=true`
    : (resume?.pdfUrl || '/Shubham_Dhapola_Resume.pdf');

  const getVersionPdfUrl = (ver) => {
    if (ver?.pdfPublicId) return `${API_BASE_URL}/public/resume/pdf/${ver._id}`;
    return ver?.pdfUrl;
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Resume Management</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Upload new resume PDFs, manage version history, and update resume metadata facts.
          </p>
        </div>

        <div className="self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPdf}
            className="inline-flex items-center gap-2 font-semibold rounded-xl bg-slate-950 hover:bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {uploadingPdf ? (
              <FiLoader className="size-4 animate-spin text-amber-400" />
            ) : (
              <FiUpload className="size-4 text-amber-400" />
            )}
            <span>{uploadingPdf ? 'Uploading PDF...' : 'Upload New Resume PDF'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Active Resume Status Card with In-Dashboard Preview */}
      <div className="grid lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: Metadata & Download Actions */}
        <div className="lg:col-span-5 space-y-4 min-w-0">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-11 sm:size-12 shrink-0 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                <FiFileText className="size-5 sm:size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 truncate" title={resume?.fileName || 'N/A'}>
                    {resume?.fileName || 'N/A'}
                  </h4>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 shrink-0">
                    v{resume?.currentVersion}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                  Published Year: {resume?.updatedDate || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              {resume?.pdfUrl && (
                <>
                  <a
                    href={downloadUrl}
                    download={resume.fileName}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200 py-2 sm:py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition"
                  >
                    <FiDownload className="size-3.5" />
                    <span>Download</span>
                  </a>

                  <a
                    href={pdfStreamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-2 sm:p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
                    title="Open in new tab"
                  >
                    <FiExternalLink className="size-4" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Version History List */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <FiClock className="size-3.5 text-amber-500" />
              <span>Version History ({resume?.versions?.length || 0})</span>
            </h4>

            {resume?.versions?.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {resume.versions.map((ver) => (
                  <div key={ver._id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 truncate" title={ver.fileName}>
                        Version {ver.versionNumber} — {ver.fileName}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-400 font-mono">
                        {new Date(ver.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={getVersionPdfUrl(ver)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                        title="Preview version"
                      >
                        <FiExternalLink className="size-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleRestoreVersion(ver._id)}
                        disabled={restoringId === ver._id}
                        className="inline-flex items-center gap-1 rounded bg-slate-100 border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 transition disabled:opacity-50 cursor-pointer"
                        title="Restore this version as active"
                      >
                        <FiRotateCcw className="size-3" />
                        <span>Restore</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-semibold text-slate-400 py-3 text-center">No older versions saved yet.</p>
            )}
          </div>
        </div>

        {/* Right: PDF In-Dashboard Live Embed Preview */}
        <div className="lg:col-span-7 min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col h-[380px] sm:h-[440px] min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 font-semibold min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="font-bold text-slate-800 shrink-0">In-Dashboard Live Preview</span>
                {resume?.previewImageUrl && (
                  <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 text-[11px] shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('pdf')}
                      className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${previewTab === 'pdf'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      PDF Viewer
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('image')}
                      className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${previewTab === 'image'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Page 1 Render
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px] sm:max-w-[200px]" title={resume?.fileName}>
                {resume?.fileName}
              </span>
            </div>

            {resume?.pdfUrl ? (
              previewTab === 'image' && resume?.previewImageUrl ? (
                <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 overflow-hidden min-w-0">
                  <img
                    src={resume.previewImageUrl}
                    alt={`${resume.fileName} page 1 render`}
                    className="max-h-full max-w-full object-contain rounded shadow-lg"
                  />
                </div>
              ) : (
                <iframe
                  src={`${pdfStreamUrl}#toolbar=0`}
                  title="Resume Preview"
                  className="w-full flex-1 border-none bg-slate-100 min-w-0 max-w-full"
                />
              )
            ) : (
              <div className="flex font-semibold flex-1 items-center justify-center text-[13px] text-slate-400">
                No active resume PDF uploaded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Textual Metadata Form */}
      <form
        onSubmit={handleSaveDetails}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4 sm:space-y-5 min-w-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900">Resume Text Content & Facts</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Information displayed on the /resume page</p>
          </div>
          <button
            type="submit"
            disabled={savingDetails}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-slate-950 hover:bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm transition cursor-pointer shrink-0"
          >
            {savingDetails ? <FiLoader className="size-4 animate-spin text-amber-400" /> : <FiSave className="size-4 text-amber-400" />}
            <span>Save Text Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Role Title
            </label>
            <input
              type="text"
              value={resume?.role || ''}
              onChange={(e) => handleDetailsChange('role', e.target.value)}
              placeholder="Full Stack Developer (MERN)"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Location
            </label>
            <input
              type="text"
              value={resume?.location || ''}
              onChange={(e) => handleDetailsChange('location', e.target.value)}
              placeholder="Indore, India"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Tech Stack Summary
            </label>
            <input
              type="text"
              value={resume?.stack || ''}
              onChange={(e) => handleDetailsChange('stack', e.target.value)}
              placeholder="MERN ● TypeScript ● Redux"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Availability
            </label>
            <input
              type="text"
              value={resume?.availability || ''}
              onChange={(e) => handleDetailsChange('availability', e.target.value)}
              placeholder="Full-time / Freelance"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Summary Paragraph
          </label>
          <textarea
            rows={3}
            value={resume?.summary || ''}
            onChange={(e) => handleDetailsChange('summary', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
          />
        </div>

        {/* Highlights List */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Resume Highlights</span>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
            >
              + Add Highlight
            </button>
          </div>

          {resume?.highlights?.map((hl, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={hl}
                onChange={(e) => handleUpdateHighlight(i, e.target.value)}
                className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition font-semibold"
              />
              <button
                type="button"
                onClick={() => handleRemoveHighlight(i)}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition cursor-pointer shrink-0"
              >
                <FiX className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
