import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FiBarChart2,
  FiUsers,
  FiEye,
  FiCalendar,
  FiGlobe,
  FiSmartphone,
  FiMonitor,
  FiTablet,
  FiLoader,
  FiInfo,
} from 'react-icons/fi';
import { apiClient } from '../api/client.js';
import StatCard from '../components/StatCard';
import AnalyticsChart from '../components/AnalyticsChart';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showToast } = useOutletContext();

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    fetchTimeline(timeRange);
  }, [timeRange]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/overview');
      if (res.success) {
        setOverview(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async (range) => {
    try {
      setTimelineLoading(true);
      const res = await apiClient.get(`/analytics/timeline?range=${range}`);
      if (res.success) {
        setTimeline(res.data);
      }
    } catch {
      // Ignore background errors
    } finally {
      setTimelineLoading(false);
    }
  };

  if (loading && !overview) {
    return (
      <div className="flex h-96 items-center justify-center">
        <FiLoader className="size-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const getDeviceIcon = (dev) => {
    if (dev === 'mobile') return FiSmartphone;
    if (dev === 'tablet') return FiTablet;
    return FiMonitor;
  };

  return (
    <div className="space-y-8 max-w-5xl w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4 min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Portfolio Visitor Analytics</span>
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Privacy-conscious tracking of SPA page views, unique sessions, top routes, and referrer origins.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
        <StatCard
          title="Total Page Views"
          value={overview?.totalPageViews ?? 0}
          icon={FiEye}
          color="#f59e0b"
        />
        <StatCard
          title="Unique Visitors"
          value={overview?.totalUniqueVisitors ?? 0}
          icon={FiUsers}
          color="#3b82f6"
        />
        <StatCard
          title="Views Today"
          value={overview?.today?.views ?? 0}
          change={`${overview?.today?.uniqueVisitors ?? 0} unique`}
          icon={FiCalendar}
          color="#10b981"
        />
        <StatCard
          title="Last 30 Days"
          value={overview?.last30Days?.views ?? 0}
          change={`${overview?.last30Days?.uniqueVisitors ?? 0} unique`}
          icon={FiCalendar}
          color="#8b5cf6"
        />
      </div>

      {/* Interactive Daily Traffic Chart */}
      <AnalyticsChart
        data={timeline}
        activeRange={timeRange}
        onRangeChange={setTimeRange}
        loading={timelineLoading}
      />

      {/* Two-Column Grid: Top Pages & Top Referrers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
        {/* Top Pages Visited Table */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4 min-w-0">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Top Visited Pages & Routes
          </h3>

          {overview?.topPages?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {overview.topPages.map((page, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-[13px] gap-2 min-w-0">
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="font-semibold mb-0.5 text-slate-900 truncate block font-medium">{page.path}</span>
                    <span className="text-xs font-semibold text-slate-400">{page.uniques} unique visitors</span>
                  </div>
                  <span className="font-bold text-slate-800 shrink-0 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs">
                    {page.views} views
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-400 py-6 text-center ">No route visits recorded yet.</p>
          )}
        </div>

        {/* Top Referrers Table */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4 min-w-0">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>Traffic Referrer Sources</span>
          </h3>

          {overview?.topReferrers?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {overview.topReferrers.map((ref, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-[13px] gap-2 min-w-0">
                  <span className="text-slate-500 truncate pr-2 font-semibold min-w-0 flex-1">{ref.referrer || 'Direct / Bookmark'}</span>
                  <span className="font-bold text-xs text-amber-700 shrink-0 px-2 py-0.5 rounded bg-amber-50 border border-amber-200/70">
                    {ref.count} visits
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 font-semibold py-6 text-center">No referrers detected yet.</p>
          )}
        </div>
      </div>

      {/* Device Category Breakdown */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Device & Platform Categories
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {overview?.devices?.length > 0 ? overview?.devices?.map((dev, idx) => {
            const Icon = getDeviceIcon(dev.device);
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200/50">
                  <Icon className="size-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 capitalize block">{dev.device}</span>
                  <span className="text-[12px] font-semibold text-slate-500">{dev.count} sessions recorded</span>
                </div>
              </div>
            );
          })
            : (<p className="text-sm col-span-3 text-slate-400 font-semibold py-6 text-center">No device data available yet.</p>)}
        </div>
      </div>
    </div>
  );
}
