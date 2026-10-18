import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiPlus, FiLoader } from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import ConfirmModal from '../components/ConfirmModal';
import WorkTable from '../features/work/WorkTable';
import WorkPageSettings from '../features/work/WorkPageSettings';
import WorkModal from '../features/work/WorkModal';

export default function WorkCms() {
  const [workList, setWorkList] = useState([]);
  const [pageSettings, setPageSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingPage, setSavingPage] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  const { showToast } = useOutletContext();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [workRes, pageRes] = await Promise.all([
        apiClient.get('/admin/work'),
        apiClient.get('/admin/work-page'),
      ]);
      if (workRes.success) setWorkList(workRes.data);
      if (pageRes.success) setPageSettings(pageRes.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem({
      company: '',
      role: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: 'Present',
      isCurrent: true,
      description: '',
      responsibilities: [],
      technologies: [],
      companyUrl: '',
      isVisible: true,
      displayOrder: workList.length,
    });
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!editingItem.company || !editingItem.role) {
      showToast('Company and role are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingItem._id) {
        await apiClient.put(`/admin/work/${editingItem._id}`, editingItem);
        showToast('Work experience updated successfully!');
      } else {
        await apiClient.post('/admin/work', editingItem);
        showToast('Work experience added successfully!');
      }
      setEditingItem(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePage = async (e) => {
    e.preventDefault();
    try {
      setSavingPage(true);
      await apiClient.put('/admin/work-page', pageSettings);
      showToast('Work page settings saved.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingPage(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiClient.delete(`/admin/work/${deleteModal.id}`);
      showToast('Work experience deleted.');
      setDeleteModal({ open: false, id: null, title: '' });
      fetchData();
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
    <div className="space-y-8 max-w-5xl w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Work & Professional Experience</span>
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Manage your employment history, client projects, roles, and /work page static header content.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-black px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition cursor-pointer shrink-0"
        >
          <FiPlus className="size-4" />
          <span>Add Work Entry</span>
        </button>
      </div>

      {/* Work List */}
      {workList?.length > 0 ? (
        <WorkTable
          workList={workList}
          onEdit={(item) => setEditingItem({ ...item })}
          onDelete={(item) =>
            setDeleteModal({ open: true, id: item._id, title: `${item.role} at ${item.company}` })
          }
        />
      ) : (
        <p className="text-sm font-semibold text-slate-400 py-6 text-center">No work experiences found. Add a new work experience to get started.</p>
      )}

      {/* Work Page CMS Settings */}
      {/* <WorkPageSettings
        pageSettings={pageSettings}
        setPageSettings={setPageSettings}
        onSave={handleSavePage}
        saving={savingPage}
      /> */}

      {/* Add / Edit Modal */}
      <WorkModal
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        onSave={handleSaveItem}
        onClose={() => setEditingItem(null)}
        saving={saving}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Work Entry"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
      />
    </div>
  );
}
