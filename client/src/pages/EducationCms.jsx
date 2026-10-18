import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiBookOpen,
  FiX,
  FiLoader,
  FiSave,
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { apiClient } from '../api/client.js';
import ConfirmModal from '../components/ConfirmModal';

export default function EducationCms() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  const { showToast } = useOutletContext();

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/education');
      if (res.success) {
        setEducation(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem({
      degree: '',
      institution: '',
      period: '',
      grade: '',
      description: '',
      isVisible: true,
      displayOrder: education.length,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem.degree || !editingItem.institution) {
      showToast('Degree and institution are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingItem._id) {
        await apiClient.put(`/admin/education/${editingItem._id}`, editingItem);
        showToast('Education record updated successfully!');
      } else {
        await apiClient.post('/admin/education', editingItem);
        showToast('Education record added successfully!');
      }
      setEditingItem(null);
      fetchEducation();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiClient.delete(`/admin/education/${deleteModal.id}`);
      showToast('Education record deleted.');
      setDeleteModal({ open: false, id: null, title: '' });
      fetchEducation();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Education & Academic Journey</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Manage your academic credentials, institutions, graduation timelines, and CGPA scores.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-black px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition cursor-pointer shrink-0"
        >
          <FiPlus className="size-4" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Education List */}
      {education?.length > 0 ? (
        <div className="grid gap-4">
          {education.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-amber-400/60 transition min-w-0"
            >
              <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600">
                  <FaGraduationCap className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate" title={item.degree}>{item.degree}</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate" title={item.institution}>{item.institution}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-slate-600 font-semibold shrink-0">
                      {item.period}
                    </span>
                    {item.grade && (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-emerald-600 font-bold shrink-0">
                        {item.grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => setEditingItem({ ...item })}
                  className="rounded-lg p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                  title="Edit entry"
                >
                  <FiEdit className="size-4" />
                </button>
                <button
                  onClick={() =>
                    setDeleteModal({ open: true, id: item._id, title: item.degree })
                  }
                  className="rounded-lg p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Delete entry"
                >
                  <FiTrash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm font-semibold text-slate-400 py-6 text-center">No education records found. Add a new education record to get started.</p>
      )}

      {/* Add / Edit Modal */}
      {editingItem && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 truncate pr-2">
                {editingItem._id ? 'Edit Education Record' : 'Add Education Record'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition cursor-pointer shrink-0">
                <FiX className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Degree / Program *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.degree}
                  onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                  placeholder="Master of Computer Applications"
                  className="w-full rounded-xl border font-semibold border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Institution *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.institution}
                  onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                  placeholder="SAGE University, Indore"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 font-semibold placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Period / Years
                  </label>
                  <input
                    type="text"
                    value={editingItem.period}
                    onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                    placeholder="2025 - 2027"
                    className="w-full font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Grade / CGPA
                  </label>
                  <input
                    type="text"
                    value={editingItem.grade}
                    onChange={(e) => setEditingItem({ ...editingItem, grade: e.target.value })}
                    placeholder="8.68 CGPA"
                    className="w-full font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-black px-5 py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 cursor-pointer text-center"
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
        title="Delete Education Record"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
      />
    </div>
  );
}
