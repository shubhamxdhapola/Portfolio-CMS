import React from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiAward } from 'react-icons/fi';
import ImageUploader from '../../components/ImageUploader';
import AdminSelect from '../../components/AdminSelect';
import useImageUploading from '../../hooks/useImageUploading';

export default function CertificationModal({
  editingCert,
  setEditingCert,
  onSave,
  onClose,
  saving,
  categories,
}) {
  const isImageUploading = useImageUploading();
  if (!editingCert || typeof document === 'undefined') return null;

  const handleAddSkillTag = () => {
    setEditingCert((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), ''],
    }));
  };

  const handleUpdateSkillTag = (index, value) => {
    setEditingCert((prev) => {
      const updated = [...(prev.skills || [])];
      updated[index] = value;
      return { ...prev, skills: updated };
    });
  };

  const handleRemoveSkillTag = (index) => {
    setEditingCert((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/70 shrink-0">
          <h3 className="text-base font-bold text-slate-900 truncate pr-2">
            {editingCert._id ? `Edit Certification: ${editingCert.title}` : 'Add New Certification'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Title *</label>
              <input
                type="text"
                required
                value={editingCert.title || ''}
                placeholder="Software Development"
                onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Issuer *</label>
              <input
                type="text"
                required
                value={editingCert.issuer || ''}
                placeholder="Google"
                onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Category</label>
              <AdminSelect
                value={editingCert.category}
                onChange={(val) => setEditingCert({ ...editingCert, category: val })}
                options={categories}
                icon={FiAward}
                headerTitle="Select Category"
                fullWidth
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Issue Date</label>
              <input
                type="text"
                value={editingCert.issueDate || ''}
                onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                placeholder="Jul 2024"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Full Date</label>
              <input
                type="text"
                value={editingCert.fullDate || ''}
                onChange={(e) => setEditingCert({ ...editingCert, fullDate: e.target.value })}
                placeholder="14 Jul, 2024"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 font-semibold placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Credential ID</label>
              <input
                type="text"
                value={editingCert.credentialId || ''}
                onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                placeholder="1891d440bef..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 font-semibold placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Credential URL</label>
              <input
                type="url"
                value={editingCert.credentialUrl || ''}
                onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 font-semibold placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
              />
            </div>
          </div>

          <ImageUploader
            label="Certificate Proof Image"
            value={editingCert.image || ''}
            publicId={editingCert.imagePublicId || ''}
            onChange={({ url, publicId }) =>
              setEditingCert({ ...editingCert, image: url, imagePublicId: publicId })
            }
            folder="portfolio_cms/certifications"
            description="Uploaded scanned certificate or screenshot"
          />

          <ImageUploader
            label="Issuer Logo URL or Asset"
            value={editingCert.issuerLogo || ''}
            publicId={editingCert.issuerLogoPublicId || ''}
            onChange={({ url, publicId }) =>
              setEditingCert({ ...editingCert, issuerLogo: url, issuerLogoPublicId: publicId })
            }
            folder="portfolio_cms/certifications"
            description="Official issuer SVG or brand logo"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Description</label>
            <textarea
              rows={3}
              value={editingCert.description || ''}
              placeholder="Learned about software development concepts"
              onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 font-semibold placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
            />
          </div>

          {/* Skills Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Related Skills</label>
              <button
                type="button"
                onClick={handleAddSkillTag}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
              >
                + Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editingCert.skills?.map((sk, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-800 font-semibold">
                  <input
                    type="text"
                    value={sk}
                    onChange={(e) => handleUpdateSkillTag(i, e.target.value)}
                    className="bg-transparent border-none text-xs text-slate-800 focus:outline-none w-20 sm:w-24"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillTag(i)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                  >
                    <FiX className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || isImageUploading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 hover:bg-black px-5 py-2.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
            >
              <span>
                {saving
                  ? 'Saving...'
                  : isImageUploading
                    ? 'Uploading Image...'
                    : 'Save Certification'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
