import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiHome,
  FiUser,
  FiFolder,
  FiCpu,
  FiCode,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiFileText,
  FiShare2,
  FiBarChart2,
  FiSettings,
  FiX,
} from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminSidebar({
  mobileOpen,
  onCloseMobile,
  collapsed,
}) {
  const { admin } = useAdminAuth();

  const sidebarTitle = admin?.sidebarTitle || 'shubhamxdev';
  const brandInitial = (sidebarTitle || 'S').charAt(0).toUpperCase();
  const displayName = admin?.name || 'Shubham Dhapola';
  const profileInitial = (displayName || 'S').charAt(0).toUpperCase();
  const roleDisplay = admin?.role
    ? admin.role.charAt(0).toUpperCase() + admin.role.slice(1)
    : 'Admin';

  const navSections = [
    {
      title: 'General',
      items: [
        { name: 'Dashboard', path: '/admin', icon: FiGrid, exact: true },
        { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
      ],
    },
    {
      title: 'Content',
      items: [
        { name: 'Home Page', path: '/admin/home', icon: FiHome },
        { name: 'About Me', path: '/admin/about', icon: FiUser },
        { name: 'Projects', path: '/admin/projects', icon: FiFolder },
        { name: 'Skills & Tech', path: '/admin/skills', icon: FiCpu, },
        { name: 'Problem Solving', path: '/admin/leetcode', icon: FiCode },
      ],
    },
    {
      title: 'Credentials',
      items: [
        { name: 'Certifications', path: '/admin/certifications', icon: FiAward },
        { name: 'Education', path: '/admin/education', icon: FiBookOpen },
        { name: 'Work Experience', path: '/admin/work', icon: FiBriefcase },
        { name: 'Resume', path: '/admin/resume', icon: FiFileText },
        { name: 'Social Links', path: '/admin/social-links', icon: FiShare2 },
      ],
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', path: '/admin/settings', icon: FiSettings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-[#1e2025] bg-[#0c0d10] transition-[width,transform] duration-300 ease-in-out ${
          /* Mobile Drawer: 64 width; Desktop: 64 if expanded, 20 if collapsed */
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
          } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div
          className={`flex h-16 items-center border-b border-[#1c1d22] px-6 ${collapsed ? 'lg:justify-center lg:px-0' : 'justify-between'
            }`}
        >
          {/* Logo and Brand Title: editable from Settings only */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="size-8 shrink-0 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black font-rajdhani text-base shadow-sm"
            >
              {brandInitial}
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0 overflow-hidden leading-tight flex-1">
                <span className="font-bold text-sm text-white tracking-wide truncate block">
                  {sidebarTitle}
                </span>
                <span className="text-xs font-semibold text-slate-400 tracking-normal block mt-0.5">
                  CMS Panel
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close menu"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {/* Section Header */}
              {(!collapsed || mobileOpen) && (
                <div className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {section.title}
                </div>
              )}

              {/* Items */}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `group relative flex items-center rounded-xl text-[13px] font-semibold tracking-wide transition-all ${collapsed
                        ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2 gap-3'
                        : 'px-3 py-2 justify-between'
                      } ${isActive
                        ? 'bg-[#1c1d22] text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`shrink-0 ${collapsed ? 'lg:size-5 size-4' : 'size-4'
                          } text-slate-300 group-hover:text-amber-400 transition-colors`}
                      />

                      {/* Text Label on Expanded / Mobile */}
                      <span
                        className={`truncate ${collapsed ? 'lg:hidden inline-block' : 'inline-block'
                          }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Badge indicator on Expanded / Mobile */}
                    {item.badge && (!collapsed || mobileOpen) && (
                      <span
                        className={`shrink-0 text-[10px] font-bold ${item.badge.length === 1 || item.badge.length === 2
                          ? 'size-5 rounded-full flex items-center justify-center'
                          : 'px-2 py-0.5 rounded-full'
                          } ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Floating Tooltip in Desktop Collapsed Mode */}
                    {collapsed && (
                      <div className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 border border-slate-700 rounded-lg shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {item.name}
                        {item.badge && ` (${item.badge})`}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card Bottom Bar */}
        <div className="border-t border-[#1c1d22] p-3">
          {/* Admin Account */}
          <div
            className={`group relative flex items-center rounded-xl bg-[#141519] p-2.5 ${collapsed ? 'justify-center' : 'gap-2.5'
              }`}
          >
            <div
              className={`min-w-0 flex items-center gap-2.5 ${collapsed ? 'justify-center' : 'flex-1'
                }`}
            >
              {admin?.avatarUrl ? (
                <img
                  src={admin.avatarUrl}
                  alt={displayName}
                  className="size-9 shrink-0 rounded-full object-cover border border-amber-400/40"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="size-8 shrink-0 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 text-xs font-bold">
                  {profileInitial}
                </div>
              )}
              {(!collapsed || mobileOpen) && (
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-white truncate leading-tight">
                    {displayName}
                  </p>
                  <p className="text-[12px] font-semibold text-slate-400 truncate leading-tight mt-0.5">
                    {roleDisplay}
                  </p>
                </div>
              )}
            </div>

            {/* Floating Tooltip in Desktop Collapsed Mode */}
            {collapsed && (
              <div className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 border border-slate-700 rounded-lg shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {displayName}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
