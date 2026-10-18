import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiLoader, FiSave } from 'react-icons/fi';
import ProjectGeneralTab from './ProjectGeneralTab';
import ProjectMediaTab from './ProjectMediaTab';
import ProjectBadgesTab from './ProjectBadgesTab';
import ProjectCaseStudyTab from './ProjectCaseStudyTab';
import useImageUploading from '../../hooks/useImageUploading';

export default function ProjectModal({
  editingProject,
  setEditingProject,
  onSave,
  saving,
}) {
  const [activeTab, setActiveTab] = useState('general');
  const isImageUploading = useImageUploading();

  if (!editingProject || typeof document === 'undefined') return null;

  const handleAddListItem = (field) => {
    setEditingProject((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ''],
    }));
  };

  const handleUpdateListItem = (field, index, value) => {
    setEditingProject((prev) => {
      const updated = [...(prev[field] || [])];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleRemoveListItem = (field, index) => {
    setEditingProject((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleAddCaseStudyItem = (subField) => {
    setEditingProject((prev) => ({
      ...prev,
      caseStudy: {
        ...prev.caseStudy,
        [subField]: [...(prev.caseStudy?.[subField] || []), ''],
      },
    }));
  };

  const handleUpdateCaseStudyItem = (subField, index, value) => {
    setEditingProject((prev) => {
      const updated = [...(prev.caseStudy?.[subField] || [])];
      updated[index] = value;
      return {
        ...prev,
        caseStudy: {
          ...prev.caseStudy,
          [subField]: updated,
        },
      };
    });
  };

  const handleRemoveCaseStudyItem = (subField, index) => {
    setEditingProject((prev) => ({
      ...prev,
      caseStudy: {
        ...prev.caseStudy,
        [subField]: prev.caseStudy?.[subField]?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const handleAddBadge = () => {
    setEditingProject((prev) => ({
      ...prev,
      techBadges: [...(prev.techBadges || []), { name: '', color: '#61DAFB', logo: '' }],
    }));
  };

  const handleUpdateBadge = (index, key, value) => {
    setEditingProject((prev) => {
      const updated = [...(prev.techBadges || [])];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, techBadges: updated };
    });
  };

  const handleRemoveBadge = (index) => {
    setEditingProject((prev) => ({
      ...prev,
      techBadges: prev.techBadges.filter((_, i) => i !== index),
    }));
  };

  const tabs = [
    { id: 'general', label: '1. General & SEO' },
    { id: 'media', label: '2. Media & Bullets' },
    { id: 'badges', label: '3. Tech Badges' },
    { id: 'caseStudy', label: '4. Case Study Details' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[94vh] sm:max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/70 shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {editingProject._id ? `Edit Project: ${editingProject.title}` : 'Create New Project'}
            </h3>
            <p className="text-xs sm:text-[13px] font-semibold text-slate-500 line-clamp-2 sm:line-clamp-none">
              Configure project metadata, Cloudinary thumbnail, tech badges, and case study details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditingProject(null)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-100 px-3 sm:px-6 bg-white overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-[13px] font-bold transition whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-500 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 custom-scrollbar">
          {activeTab === 'general' && (
            <ProjectGeneralTab
              editingProject={editingProject}
              setEditingProject={setEditingProject}
            />
          )}

          {activeTab === 'media' && (
            <ProjectMediaTab
              editingProject={editingProject}
              setEditingProject={setEditingProject}
              handleAddListItem={handleAddListItem}
              handleUpdateListItem={handleUpdateListItem}
              handleRemoveListItem={handleRemoveListItem}
            />
          )}

          {activeTab === 'badges' && (
            <ProjectBadgesTab
              editingProject={editingProject}
              handleAddBadge={handleAddBadge}
              handleUpdateBadge={handleUpdateBadge}
              handleRemoveBadge={handleRemoveBadge}
            />
          )}

          {activeTab === 'caseStudy' && (
            <ProjectCaseStudyTab
              editingProject={editingProject}
              setEditingProject={setEditingProject}
              handleAddCaseStudyItem={handleAddCaseStudyItem}
              handleUpdateCaseStudyItem={handleUpdateCaseStudyItem}
              handleRemoveCaseStudyItem={handleRemoveCaseStudyItem}
            />
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-200 bg-white px-4 py-2.5 sm:py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || isImageUploading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-black px-5 py-2.5 sm:py-2 text-[13px] font-semibold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
            >
              {saving || isImageUploading ? (
                <FiLoader className="size-4 animate-spin text-amber-400" />
              ) : (
                <FiSave className="size-4 text-amber-400" />
              )}
              <span>
                {saving
                  ? 'Saving Project...'
                  : isImageUploading
                    ? 'Uploading Thumbnail...'
                    : 'Save Project'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
