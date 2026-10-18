import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiShare2,
  FiExternalLink,
  FiX,
  FiLoader,
  FiSave,
} from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import ConfirmModal from '../components/ConfirmModal';

export default function SocialLinksCms() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  const { showToast } = useOutletContext();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/social-links');
      if (res.success) {
        setLinks(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingLink({
      platform: '',
      url: '',
      icon: 'share-2',
      label: '',
      isVisible: true,
      displayOrder: links.length,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingLink.platform || !editingLink.url) {
      showToast('Platform and URL are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingLink._id) {
        await apiClient.put(`/admin/social-links/${editingLink._id}`, editingLink);
        showToast('Social link updated successfully!');
      } else {
        await apiClient.post('/admin/social-links', editingLink);
        showToast('Social link created successfully!');
      }
      setEditingLink(null);
      fetchLinks();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiClient.delete(`/admin/social-links/${deleteModal.id}`);
      showToast('Social link deleted.');
      setDeleteModal({ open: false, id: null, title: '' });
      fetchLinks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <FiLoader className="size-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Social & External Links</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Manage global social links displayed across your header, about section, and website footer.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto inline-flex font-semibold items-center gap-2 rounded-xl bg-slate-950 hover:bg-black text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow transition cursor-pointer shrink-0"
        >
          <FiPlus className="size-4 text-amber-400" />
          <span>Add Social Link</span>
        </button>
      </div>

      {/* Links List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {links.length > 0 ? (links.map((link) => (
          <div
            key={link._id}
            className="min-w-0 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-slate-300 transition"
          >
            <div className="min-w-0 flex-1 flex items-center gap-2.5 sm:gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200 font-bold">
                {link.platform?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">{link.platform}</h4>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-slate-500 hover:text-amber-600 truncate block mt-0.5"
                  title={link.url}
                >
                  {link.url}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                title="Visit link"
              >
                <FiExternalLink className="size-3.5" />
              </a>
              <button
                onClick={() => setEditingLink({ ...link })}
                className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                title="Edit link"
              >
                <FiEdit className="size-3.5" />
              </button>
              <button
                onClick={() => setDeleteModal({ open: true, id: link._id, title: link.platform })}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                title="Delete link"
              >
                <FiTrash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))) : (
          <p className="text-sm col-span-full font-semibold text-slate-400 py-6 text-center">No social links found. Add a new social link to get started.</p>
        )}
      </div>

      {/* Add / Edit Modal */}
      {editingLink && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 truncate pr-2">
                {editingLink._id ? `Edit ${editingLink.platform}` : 'Add Social Link'}
              </h3>
              <button onClick={() => setEditingLink(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded hover:bg-slate-100 shrink-0">
                <FiX className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.platform}
                  onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                  placeholder="e.g. GitHub, LinkedIn, Twitter"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-black text-white px-5 py-2 text-xs font-semibold shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer text-center"
                >
                  {saving ? <FiLoader className="size-4 animate-spin text-amber-400" /> : <FiSave className="size-4 text-amber-400" />}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Social Link"
        message={`Are you sure you want to delete the social link for "${deleteModal.title}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
      />
    </div>
  );
}
