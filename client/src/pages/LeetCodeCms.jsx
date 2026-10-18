import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FiRefreshCw,
  FiSave,
  FiCode,
  FiCheckCircle,
  FiAlertCircle,
  FiExternalLink,
  FiLoader,
  FiAward,
} from 'react-icons/fi';
import { apiClient } from '../api/client.js';

export default function LeetCodeCms() {
  const [setting, setSetting] = useState(null);
  const [cachedStats, setCachedStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useOutletContext();

  useEffect(() => {
    fetchLeetCodeData();
  }, []);

  const fetchLeetCodeData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/leetcode/settings');
      if (res.success) {
        setSetting(res.data.setting);
        setCachedStats(res.data.cachedStats);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await apiClient.put('/admin/leetcode/settings', setting);
      if (res.success) {
        showToast('LeetCode settings updated successfully!');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await apiClient.post('/admin/leetcode/refresh');
      if (res.success) {
        showToast('LeetCode statistics refreshed successfully!');
        setCachedStats(res.data);
        fetchLeetCodeData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRefreshing(false);
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
    <div className="space-y-6 sm:space-y-8 max-w-5xl w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Problem Solving & LeetCode Integration</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            Configure the data source API, username, and sync live algorithm statistics.
          </p>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-lg bg-slate-950 hover:bg-black text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer shrink-0"
        >
          <FiRefreshCw className={`size-4 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Fetching Live Data...' : 'Refresh Statistics Now'}</span>
        </button>
      </div>

      {/* Sync Status Alert Banner */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-w-0 ${setting?.lastFetchStatus === 'success'
          ? 'border-emerald-200 bg-emerald-50/70'
          : setting?.lastFetchStatus === 'error'
            ? 'border-rose-200 bg-rose-50/70'
            : 'border-slate-200 bg-white'
          }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {setting?.lastFetchStatus === 'success' ? (
            <FiCheckCircle className="size-5 text-emerald-600 shrink-0" />
          ) : setting?.lastFetchStatus === 'error' ? (
            <FiAlertCircle className="size-5 text-rose-600 shrink-0" />
          ) : (
            <FiCode className="size-5 text-slate-400 shrink-0" />
          )}

          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-900">
              {setting?.lastFetchStatus === 'success'
                ? 'Sync Status: Up-to-date and healthy'
                : setting?.lastFetchStatus === 'error'
                  ? `Sync Status: Last refresh failed`
                  : 'Sync Status: Idle'}
            </p>
            <p className="text-[12px] font-semibold text-slate-500 mt-0.5 truncate">
              {setting?.lastFetchedAt
                ? `Last fetched: ${new Date(setting.lastFetchedAt).toLocaleString()}`
                : 'No sync recorded yet.'}
              {setting?.lastErrorMessage && ` — ${setting.lastErrorMessage}`}
            </p>
          </div>
        </div>

        {setting?.profileUrl && (
          <a
            href={setting.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline shrink-0"
          >
            <span>LeetCode Profile</span>
            <FiExternalLink className="size-3" />
          </a>
        )}
      </div>

      {/* Cached Statistics Preview Cards */}
      {cachedStats && (
        <div className="space-y-3 min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Current Synced Statistics Preview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-bold">
                Total Solved
              </span>
              <p className="mt-1 text-2xl font-black text-slate-900">{cachedStats.allSolved ?? 0}</p>
              <div className="mt-2 flex gap-2 text-[11px] font-bold">
                <span className="text-emerald-600">E: {cachedStats.easySolved}</span>
                <span className="text-amber-600">M: {cachedStats.mediumSolved}</span>
                <span className="text-rose-600">H: {cachedStats.hardSolved}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-bold">
                Acceptance Rate
              </span>
              <p className="mt-1 text-2xl font-black text-amber-600">
                {cachedStats.acceptanceRate}%
              </p>
              <span className="text-[11px] font-bold text-slate-400 mt-2 block">
                {cachedStats.totalSubmissions} submissions
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-bold">
                Global Ranking
              </span>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {cachedStats.ranking ? `#${cachedStats.ranking.toLocaleString()}` : 'N/A'}
              </p>
              <span className="text-[11px] font-bold text-slate-400 mt-2 block">Top percentile</span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-bold">
                Badges Earned
              </span>
              <p className="mt-1 text-2xl font-black text-amber-600">
                {cachedStats.badges?.length ?? 0}
              </p>
              <span className="text-[11px] font-bold text-slate-400 mt-2 block">Official LeetCode badges</span>
            </div>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <form
        onSubmit={handleSaveSettings}
        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-4 sm:space-y-5 min-w-0"
      >
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          API & Data Source Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              LeetCode Username *
            </label>
            <input
              type="text"
              required
              value={setting?.username || ''}
              onChange={(e) => setSetting({ ...setting, username: e.target.value })}
              placeholder="shubhamxdhapola"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              API Base URL *
            </label>
            <input
              type="url"
              required
              value={setting?.apiBaseUrl || ''}
              onChange={(e) => setSetting({ ...setting, apiBaseUrl: e.target.value })}
              placeholder="https://leetcode-api-pied.vercel.app"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              LeetCode Public Profile URL
            </label>
            <input
              type="url"
              value={setting?.profileUrl || ''}
              onChange={(e) => setSetting({ ...setting, profileUrl: e.target.value })}
              placeholder="https://leetcode.com/u/shubhamxdhapola/"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Cache Time (ms)
            </label>
            <input
              type="number"
              value={setting?.cacheTimeMs || 600000}
              onChange={(e) => setSetting({ ...setting, cacheTimeMs: Number(e.target.value) })}
              onWheel={(e) => e.target.blur()}
              placeholder="600000"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-black text-white px-5 py-2.5 text-xs font-semibold shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer text-center"
          >
            {saving ? <FiLoader className="size-4 animate-spin text-amber-400" /> : <FiSave className="size-4 text-amber-400" />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
