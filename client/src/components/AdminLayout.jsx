import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import Toast from "./Toast";
import { Globe } from "lucide-react";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_collapsed", String(next));
      } catch {
        // Ignore localStorage error
      }
      return next;
    });
  };

  const showToast = (message, type = "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ id: Date.now(), message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/admin") return "Dashboard Analytics";
    if (p.includes("/admin/home")) return "Home Page CMS";
    if (p.includes("/admin/about")) return "About Me CMS";
    if (p.includes("/admin/projects")) return "Projects CMS";
    if (p.includes("/admin/skills")) return "Skills & Technologies";
    if (p.includes("/admin/leetcode")) return "LeetCode CMS";
    if (p.includes("/admin/certifications")) return "Certifications CMS";
    if (p.includes("/admin/education")) return "Education CMS";
    if (p.includes("/admin/work")) return "Work Experience CMS";
    if (p.includes("/admin/resume")) return "Resume Management";
    if (p.includes("/admin/social-links")) return "Social Links CMS";
    if (p.includes("/admin/analytics")) return "Visitor Analytics";
    if (p.includes("/admin/settings")) return "Website Settings";
    return "Admin Panel";
  };

  useEffect(() => {
    document.title = `${getPageTitle()} | Admin CMS`;
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-800 flex font-sans w-full overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        collapsed={collapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 w-full overflow-x-hidden transition-[padding] duration-300 ease-in-out ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Top Header matching reference image */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-xs min-w-0 w-full">
          <div className="flex items-center gap-3">
            {/* Mobile Open Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar menu"
            >
              <FiMenu className="size-5" />
            </button>

            {/* Desktop Collapse / Expand Toggle */}
            <button
              onClick={toggleCollapse}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:flex items-center justify-center size-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <FiChevronRight className="size-4 text-amber-500" />
              ) : (
                <FiChevronLeft className="size-4 text-slate-600" />
              )}
            </button>

            <div>
              <h1 className="text-lg sm:text-lg font-bold text-slate-900 tracking-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Visit button */}
            <Link
              to={import.meta.env.VITE_PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 md:px-3.5 md:py-1.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-xs"
            >
              <Globe className="inline-block size-4  md:size-3.5 text-slate-600" />
              <span className="hidden md:inline-block">View Site</span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Sign out of Admin Panel"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 md:px-3.5 md:py-1.5 text-[13px] font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition shadow-xs cursor-pointer"
            >
              <FiLogOut className="inline-block size-4 md:size-3.5 text-slate-600" />
              <span className="hidden md:inline-block">Logout</span>
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
          <Outlet context={{ showToast }} />
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
