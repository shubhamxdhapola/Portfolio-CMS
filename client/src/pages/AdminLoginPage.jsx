import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { FiLock, FiUser, FiEye, FiEyeOff, FiLoader, FiShield } from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(username, password);
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f4f5f7] flex items-center justify-center p-4 overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-1/4 left-1/3 size-96 rounded-full bg-amber-400/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 size-96 rounded-full bg-slate-300/30 blur-[150px] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
        <div className="text-center mb-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-950 text-amber-400 shadow-md mb-4">
            <FiShield className="size-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">ADMIN PANEL</h2>
          <p className="mt-1.5 text-[13px] font-semibold text-slate-500">
            Sign in to manage your portfolio CMS, projects, and analytics.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiUser className="size-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@gmail.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock className="size-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition"
              >
                {showPassword ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-black py-3 text-sm font-bold text-white shadow-md shadow-slate-900/10 active:scale-98 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <FiLoader className="size-4 animate-spin text-amber-400" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            ← Return to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
