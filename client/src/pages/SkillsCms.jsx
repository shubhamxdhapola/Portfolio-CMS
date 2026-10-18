import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiPlus, FiLoader } from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import { usePortfolioData } from '../context/PortfolioDataContext';
import ConfirmModal from '../components/ConfirmModal';
import SkillGrid from '../features/skills/SkillGrid';
import MarqueeManager from '../features/skills/MarqueeManager';
import SkillModal from '../features/skills/SkillModal';

export default function SkillsCms() {
  const [skills, setSkills] = useState([]);
  const [marquee, setMarquee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingMarquee, setEditingMarquee] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, type: 'skill', id: null, title: '' });

  const { showToast } = useOutletContext();
  const { refreshData } = usePortfolioData();

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Language', 'Other'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [skillsRes, marqueeRes] = await Promise.all([
        apiClient.get('/admin/skills'),
        apiClient.get('/admin/marquee'),
      ]);
      if (skillsRes.success) setSkills(skillsRes.data);
      if (marqueeRes.success) setMarquee(marqueeRes.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddSkill = () => {
    setEditingSkill({
      name: '',
      iconUrl: '',
      iconPublicId: '',
      category: 'Frontend',
      isVisible: true,
      displayOrder: skills.length,
    });
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!editingSkill.name) {
      showToast('Skill name is required.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingSkill._id) {
        await apiClient.put(`/admin/skills/${editingSkill._id}`, editingSkill);
        showToast(`Skill "${editingSkill.name}" updated successfully!`);
      } else {
        await apiClient.post('/admin/skills', editingSkill);
        showToast(`Skill "${editingSkill.name}" added successfully!`);
      }
      setEditingSkill(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMarquee = async (e) => {
    e.preventDefault();
    if (!editingMarquee.text) return;

    try {
      setSaving(true);
      if (editingMarquee._id) {
        await apiClient.put(`/admin/marquee/${editingMarquee._id}`, editingMarquee);
        showToast('Marquee title updated.');
      } else {
        await apiClient.post('/admin/marquee', editingMarquee);
        showToast('Marquee title added.');
      }
      setEditingMarquee(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteModal.type === 'skill') {
        await apiClient.delete(`/admin/skills/${deleteModal.id}`);
        showToast('Skill deleted.');
      } else {
        await apiClient.delete(`/admin/marquee/${deleteModal.id}`);
        showToast('Marquee item deleted.');
      }
      setDeleteModal({ open: false, type: 'skill', id: null, title: '' });
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReorderSkills = async (reorderedSkills) => {
    const previous = [...skills];
    setSkills(reorderedSkills);

    try {
      const items = reorderedSkills.map((s, idx) => ({
        id: s._id,
        displayOrder: idx,
      }));

      const res = await apiClient.patch('/admin/skills/reorder', { items });
      if (res.success) {
        showToast('Skills reordered successfully!');
        refreshData?.();
      }
    } catch (err) {
      setSkills(previous);
      showToast(err.message || 'Failed to save skills order.', 'error');
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
    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
      {/* Skills Manager Card */}
      <div className="space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Skills & Technologies</span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Manage technologies and icons rendered in the 3D graphic skill artwork.
            </p>
          </div>

          <button
            onClick={handleOpenAddSkill}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-black px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition cursor-pointer shrink-0"
          >
            <FiPlus className="size-4" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Skills Grid */}
        {skills?.length > 0 ? (
          <SkillGrid
            skills={skills}
            onReorder={handleReorderSkills}
            onEdit={(skill) => setEditingSkill({ ...skill })}
            onDelete={(skill) =>
              setDeleteModal({ open: true, type: 'skill', id: skill._id, title: skill.name })
            }
          />
        ) : (
          <p className="text-sm font-semibold text-slate-400 py-6 text-center">No skills found. Add a new skill to get started.</p>
        )}
      </div>

      {/* Marquee Ticker Titles Card */}
      <MarqueeManager
        marquee={marquee}
        onAdd={() => setEditingMarquee({ text: '', isVisible: true, displayOrder: marquee.length })}
        onEdit={(m) => setEditingMarquee({ ...m })}
        onDelete={(m) =>
          setDeleteModal({ open: true, type: 'marquee', id: m._id, title: m.text })
        }
        editingMarquee={editingMarquee}
        setEditingMarquee={setEditingMarquee}
        onSaveMarquee={handleSaveMarquee}
        saving={saving}
      />

      {/* Skill Modal */}
      <SkillModal
        editingSkill={editingSkill}
        setEditingSkill={setEditingSkill}
        onSaveSkill={handleSaveSkill}
        onClose={() => setEditingSkill(null)}
        saving={saving}
        categories={categories}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title={`Delete ${deleteModal.type === 'skill' ? 'Skill' : 'Marquee Item'}`}
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, type: 'skill', id: null, title: '' })}
      />
    </div>
  );
}
