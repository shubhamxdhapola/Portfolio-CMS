import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  FiUsers,
  FiEye,
  FiFolder,
  FiCpu,
  FiAward,
  FiBriefcase,
  FiFileText,
  FiCalendar,
  FiArrowRight,
  FiActivity,
  FiPlus,
  FiLoader,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import StatCard from '../components/StatCard';
import AnalyticsChart from '../components/AnalyticsChart';

export default function DashboardOverviewPage() {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartRange, setChartRange] = useState('30d');
  const [chartLoading, setChartLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useOutletContext();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchTimeline(chartRange);
  }, [chartRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/overview');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async (range) => {
    try {
      setChartLoading(true);
      const res = await apiClient.get(`/analytics/timeline?range=${range}`);
      if (res.success) {
        setChartData(res.data);
      }
    } catch {
      // Ignore background chart errors
    } finally {
      setChartLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <FiLoader className="size-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-7 w-full min-w-0 max-w-full">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 w-full min-w-0">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-xs border border-amber-200 mb-2">
            <span className="size-1.5 rounded-full bg-amber-500" />
            <span>Admin Overview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Portfolio Content & Operations
          </h2>
          <p className="text-sm font-semibold text-slate-500 max-w-xl">
            Live visitor analytics, project case studies, skills database, and resume versions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-4 py-2.5 text-[13px] font-semibold shadow-sm transition font-semibold"
          >
            <FiPlus className="size-4" />
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/resume"
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-[13px] text-slate-700 transition font-semibold"
          >
            <FiFileText className="size-4 text-slate-500" />
            <span>Manage Resume</span>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards with Pastel Icon Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full min-w-0">
        <StatCard
          title="Total Views"
          value={metrics.totalPageViews}
          icon={FiEye}
          bgColor="bg-amber-50"
          textColor="text-amber-500"
        />
        <StatCard
          title="Unique Visitors"
          value={metrics.totalUniqueVisitors}
          icon={FiUsers}
          bgColor="bg-emerald-50"
          textColor="text-emerald-600"
        />
        <StatCard
          title="Views Today"
          value={metrics.viewsToday}
          icon={FiCalendar}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Last 7 Days"
          value={metrics.views7d}
          icon={FiCalendar}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
        <StatCard
          title="Last 30 Days"
          value={metrics.views30d}
          icon={FiCalendar}
          bgColor="bg-rose-50"
          textColor="text-rose-600"
        />
        <StatCard
          title="Total Projects"
          value={metrics.totalProjects}
          icon={FiFolder}
          bgColor="bg-sky-50"
          textColor="text-sky-600"
        />
        <StatCard
          title="Total Skills"
          value={metrics.totalSkills}
          icon={FiCpu}
          bgColor="bg-amber-50"
          textColor="text-amber-500"
        />
        <StatCard
          title="Certifications"
          value={metrics.totalCertifications}
          icon={FiAward}
          bgColor="bg-emerald-50"
          textColor="text-emerald-600"
        />
        <StatCard
          title="Work History"
          value={metrics.totalWork}
          icon={FiBriefcase}
          bgColor="bg-indigo-50"
          textColor="text-indigo-600"
        />
        <StatCard
          title="Resume Year"
          value={metrics.resumeLastUpdated}
          change={`v${metrics.resumeCurrentVersion}`}
          icon={FiFileText}
          bgColor="bg-orange-50"
          textColor="text-orange-600"
        />
      </div>

      {/* User Activity Golden Wave Chart matching reference */}
      <AnalyticsChart
        data={chartData}
        activeRange={chartRange}
        onRangeChange={setChartRange}
        loading={chartLoading}
      />

      {/* Two-Column Grid: Quick CMS Shortcuts & Recent Activity Logs */}
      <div className="grid lg:grid-cols-12 gap-6 w-full min-w-0 max-w-full">
        {/* Left Column: Quick Navigation Cards */}
        <div className="lg:col-span-5 space-y-3.5 w-full min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-wider text-slate-700">
              CMS Shortcuts
            </h3>
          </div>

          <div className="grid gap-3 w-full min-w-0">
            {[
              { title: 'Home Page CMS', desc: 'Hero heading, tags & background text', path: '/admin/home', icon: FiFolder },
              { title: 'About Me & Bio', desc: 'Profile photo, description & work status', path: '/admin/about', icon: FiUsers },
              { title: 'Project Case Studies', desc: 'Full-stack case studies & GitHub links', path: '/admin/projects', icon: FiFolder },
              { title: 'LeetCode Configuration', desc: 'Username, API refresh & metrics', path: '/admin/leetcode', icon: FiActivity },
              { title: 'Resume Document', desc: 'PDF preview & version rollback', path: '/admin/resume', icon: FiFileText },
            ].map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Link
                  key={shortcut.path}
                  to={shortcut.path}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 hover:border-slate-300 hover:shadow-xs transition-all group w-full min-w-0"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 border border-slate-200/60 group-hover:bg-amber-50 group-hover:text-amber-600 transition shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition truncate">
                        {shortcut.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] font-semibold text-slate-500 truncate">{shortcut.desc}</p>
                    </div>
                  </div>
                  <FiArrowRight className="size-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition shrink-0 ml-2" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Activity Logs (Table style matching reference: Recent Logs) */}
        <div className="lg:col-span-7 space-y-3.5 w-full min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-wider text-slate-700">
              Recent Logs
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] w-full min-w-0">
            {data?.recentActivity?.length > 0 ? (
              <div className="divide-y divide-slate-100 w-full min-w-0">
                {data.recentActivity.slice(0, 6).map((log) => (
                  <div key={log._id} className="py-3 sm:py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 min-w-0">
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="mt-2.5 size-2 rounded-full bg-amber-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {log.details || log.action}
                        </p>
                        <p className="text-[12px] sm:text-[13px] text-slate-500 mt-0.5 truncate">
                          by <span className="font-semibold text-slate-700">{log.adminUsername}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] sm:text-xs font-semibold">
                        {log.section}
                      </span>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <FiCheckCircle className="size-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-500">No recent logs recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
