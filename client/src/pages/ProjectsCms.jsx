import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiLoader } from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import { usePortfolioData } from '../context/PortfolioDataContext';
import ConfirmModal from '../components/ConfirmModal';
import AdminSelect from '../components/AdminSelect';
import ProjectTable from '../features/projects/ProjectTable';
import ProjectModal from '../features/projects/ProjectModal';

export default function ProjectsCms() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPublished, setFilterPublished] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  const { showToast } = useOutletContext();
  const { refreshData } = usePortfolioData();

  useEffect(() => {
    fetchProjects();
  }, [filterPublished]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (editingProject || deleteModal.open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [editingProject, deleteModal.open]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const query = filterPublished !== '' ? `?published=${filterPublished}` : '';
      const res = await apiClient.get(`/admin/projects${query}`);
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    const nextOrder = projects.length;
    setEditingProject({
      id: Date.now(),
      title: '',
      slug: '',
      altSlugs: [],
      tagline: '',
      type: '',
      year: new Date().getFullYear().toString(),
      accentColor: '#facc15',
      gradient: '',
      textColor: '',
      shadowColor: '',
      image: '',
      imagePublicId: '',
      description: '',
      liveUrl: '',
      githubUrl: '',
      bullets: [],
      technologies: [],
      techBadges: [],
      caseStudy: {
        subtitle: '',
        role: '',
        duration: '',
        team: '',
        year: '',
        problem: '',
        solution: '',
        impact: '',
        process: [],
        keyFeatures: [],
        challenges: [],
        learnings: [],
      },
      featured: true,
      published: true,
      displayOrder: nextOrder,
    });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!editingProject.title) {
      showToast('Project title is required.', 'error');
      return;
    }
    if (!editingProject.slug) {
      showToast('Project slug is required.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingProject._id) {
        await apiClient.put(`/admin/projects/${editingProject._id}`, editingProject);
        showToast('Project updated successfully!');
      } else {
        await apiClient.post('/admin/projects', editingProject);
        showToast('Project created successfully!');
      }
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiClient.delete(`/admin/projects/${deleteModal.id}`);
      showToast('Project deleted successfully.');
      setDeleteModal({ open: false, id: null, title: '' });
      fetchProjects();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReorder = async (reorderedProjects) => {
    const previous = [...projects];
    setProjects(reorderedProjects);

    try {
      const items = reorderedProjects.map((p, idx) => ({
        id: p._id,
        displayOrder: idx,
      }));

      const res = await apiClient.patch('/admin/projects/reorder', { items });
      if (res.success) {
        showToast('Projects reordered successfully!');
        refreshData?.();
      }
    } catch (err) {
      setProjects(previous);
      showToast(err.message || 'Failed to save projects order.', 'error');
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q)
    );
  });

  const canReorder = !search.trim() && filterPublished === '';

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Top Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900">Projects Management</h2>
          <p className="text-sm font-semibold text-slate-500">
            Create, edit, reorder, publish, and manage comprehensive case studies for your projects.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-black px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition cursor-pointer shrink-0"
        >
          <FiPlus className="size-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-0">
        <div className="relative flex-1 min-w-[200px] w-full">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, slug, or tagline..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <AdminSelect
            value={filterPublished}
            onChange={setFilterPublished}
            icon={FiFilter}
            headerTitle="Filter by Status"
            align="right"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'true', label: 'Published Only' },
              { value: 'false', label: 'Drafts / Unpublished' },
            ]}
          />
        </div>
      </div>

      {/* Project Table / Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <FiLoader className="size-8 text-amber-500 animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl font-semibold border border-slate-200 bg-white p-12 text-center text-slate-500 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          No projects found matching your search.
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          canReorder={canReorder}
          onReorder={handleReorder}
          onEdit={(p) => setEditingProject({ ...p })}
          onDelete={(p) => setDeleteModal({ open: true, id: p._id, title: p.title })}
        />
      )}

      {/* Full-Featured Modal Editor */}
      <ProjectModal
        editingProject={editingProject}
        setEditingProject={setEditingProject}
        onSave={handleSaveProject}
        saving={saving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${deleteModal.title}"? This action cannot be undone.`}
        confirmText="Delete Project"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
      />
    </div>
  );
}
