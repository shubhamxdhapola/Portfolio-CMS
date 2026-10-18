import React from 'react';
import { FiX } from 'react-icons/fi';

export default function ProjectCaseStudyTab({
  editingProject,
  setEditingProject,
  handleAddCaseStudyItem,
  handleUpdateCaseStudyItem,
  handleRemoveCaseStudyItem,
}) {
  const caseStudy = editingProject.caseStudy || {};

  const updateCaseStudyField = (field, value) => {
    setEditingProject({
      ...editingProject,
      caseStudy: {
        ...caseStudy,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
          Case Study Subtitle / Overview
        </label>
        <textarea
          rows={2}
          value={caseStudy.subtitle || ''}
          onChange={(e) => updateCaseStudyField('subtitle', e.target.value)}
          placeholder="A detailed case study subtitle and overview..."
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">Role</span>
          <input
            type="text"
            value={caseStudy.role || ''}
            onChange={(e) => updateCaseStudyField('role', e.target.value)}
            placeholder="e.g. Full Stack Developer"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
          />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">Duration</span>
          <input
            type="text"
            value={caseStudy.duration || ''}
            onChange={(e) => updateCaseStudyField('duration', e.target.value)}
            placeholder="e.g. 2 Months"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
          />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 block mb-1">Team</span>
          <input
            type="text"
            value={caseStudy.team || ''}
            onChange={(e) => updateCaseStudyField('team', e.target.value)}
            placeholder="e.g. Solo Developer"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">The Problem</label>
          <textarea
            rows={2}
            value={caseStudy.problem || ''}
            onChange={(e) => updateCaseStudyField('problem', e.target.value)}
            placeholder="What problem does this project address?"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">The Solution</label>
          <textarea
            rows={2}
            value={caseStudy.solution || ''}
            onChange={(e) => updateCaseStudyField('solution', e.target.value)}
            placeholder="How does this application solve the problem?"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">The Impact</label>
          <textarea
            rows={2}
            value={caseStudy.impact || ''}
            onChange={(e) => updateCaseStudyField('impact', e.target.value)}
            placeholder="What results, metrics, or user value were achieved?"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Process Steps */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Process Steps</span>
          <button
            type="button"
            onClick={() => handleAddCaseStudyItem('process')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
          >
            + Add Step
          </button>
        </div>
        {caseStudy.process?.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateCaseStudyItem('process', i, e.target.value)}
              placeholder="Step description..."
              className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => handleRemoveCaseStudyItem('process', i)}
              className="text-slate-400 hover:text-rose-600 p-1.5 cursor-pointer shrink-0"
            >
              <FiX className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Key Features */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Features</span>
          <button
            type="button"
            onClick={() => handleAddCaseStudyItem('keyFeatures')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
          >
            + Add Feature
          </button>
        </div>
        {caseStudy.keyFeatures?.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateCaseStudyItem('keyFeatures', i, e.target.value)}
              placeholder="Key feature description..."
              className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => handleRemoveCaseStudyItem('keyFeatures', i)}
              className="text-slate-400 hover:text-rose-600 p-1.5 cursor-pointer shrink-0"
            >
              <FiX className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Challenges */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Challenges</span>
          <button
            type="button"
            onClick={() => handleAddCaseStudyItem('challenges')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
          >
            + Add Challenge
          </button>
        </div>
        {caseStudy.challenges?.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateCaseStudyItem('challenges', i, e.target.value)}
              placeholder="Technical challenge faced..."
              className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => handleRemoveCaseStudyItem('challenges', i)}
              className="text-slate-400 hover:text-rose-600 p-1.5 cursor-pointer shrink-0"
            >
              <FiX className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Learnings */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Learnings & Takeaways</span>
          <button
            type="button"
            onClick={() => handleAddCaseStudyItem('learnings')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
          >
            + Add Learning
          </button>
        </div>
        {caseStudy.learnings?.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateCaseStudyItem('learnings', i, e.target.value)}
              placeholder="What did you learn?"
              className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => handleRemoveCaseStudyItem('learnings', i)}
              className="text-slate-400 hover:text-rose-600 p-1.5 cursor-pointer shrink-0"
            >
              <FiX className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
