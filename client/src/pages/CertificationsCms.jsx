import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiPlus, FiLoader } from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import { usePortfolioData } from '../context/PortfolioDataContext';
import ConfirmModal from '../components/ConfirmModal';
import CertificationTable from '../features/certifications/CertificationTable';
import CertificationPageSettings from '../features/certifications/CertificationPageSettings';
import CertificationModal from '../features/certifications/CertificationModal';

export default function CertificationsCms() {
  const [certs, setCerts] = useState([]);
  const [pageSettings, setPageSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingPage, setSavingPage] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  const { showToast } = useOutletContext();
  const { refreshData } = usePortfolioData();

  const categories = ['Software Development', 'Frontend', 'Backend', 'Core CS', 'Software Engineering', 'Cloud'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [certsRes, pageRes] = await Promise.all([
        apiClient.get('/admin/certifications'),
        apiClient.get('/admin/certifications-page'),
      ]);
      if (certsRes.success) setCerts(certsRes.data);
      if (pageRes.success) setPageSettings(pageRes.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCert({
      id: '',
      title: '',
      issuer: '',
      issuerLogo: '',
      issuerLogoPublicId: '',
      issuerBadge: '',
      issueDate: '',
      fullDate: '',
      credentialId: '',
      credentialUrl: '',
      image: '',
      imagePublicId: '',
      category: 'Software Development',
      accentColor: '#00A4EF',
      skills: [],
      description: '',
      featured: true,
      published: true,
      displayOrder: certs.length,
    });
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    if (!editingCert.title) {
      showToast('Title is required.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingCert._id) {
        await apiClient.put(`/admin/certifications/${editingCert._id}`, editingCert);
        showToast('Certification updated successfully!');
      } else {
        await apiClient.post('/admin/certifications', editingCert);
        showToast('Certification added successfully!');
      }
      setEditingCert(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePageSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingPage(true);
      await apiClient.put('/admin/certifications-page', pageSettings);
      showToast('Certification page settings saved.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingPage(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiClient.delete(`/admin/certifications/${deleteModal.id}`);
      showToast('Certification deleted.');
      setDeleteModal({ open: false, id: null, title: '' });
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReorder = async (reorderedCerts) => {
    const previous = [...certs];
    setCerts(reorderedCerts);

    try {
      const items = reorderedCerts.map((c, idx) => ({
        id: c._id,
        displayOrder: idx,
      }));

      const res = await apiClient.patch('/admin/certifications/reorder', { items });
      if (res.success) {
        showToast('Certifications reordered successfully!');
        refreshData?.();
      }
    } catch (err) {
      setCerts(previous);
      showToast(err.message || 'Failed to save certifications order.', 'error');
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
          <h2 className="text-xl font-bold text-slate-900">
            <span>Certifications Management</span>
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Manage verified credentials, issuer logos, proof images, and page header text.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-black px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition cursor-pointer shrink-0"
        >
          <FiPlus className="size-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Certifications Table */}
      {certs?.length > 0 ? (
        <CertificationTable
          certs={certs}
          onReorder={handleReorder}
          onEdit={(c) => setEditingCert({ ...c })}
          onDelete={(c) => setDeleteModal({ open: true, id: c._id, title: c.title })}
        />
      ) : (
        <p className="text-sm font-semibold text-slate-400 py-6 text-center">No certifications found. Add a new certification to get started.</p>
      )}

      {/* Certification Page CMS Settings */}
      {/* <CertificationPageSettings
        pageSettings={pageSettings}
        setPageSettings={setPageSettings}
        onSave={handleSavePageSettings}
        saving={savingPage}
      /> */}

      {/* Edit Certification Modal */}
      <CertificationModal
        editingCert={editingCert}
        setEditingCert={setEditingCert}
        onSave={handleSaveCert}
        onClose={() => setEditingCert(null)}
        saving={saving}
        categories={categories}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Certification"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
      />
    </div>
  );
}
