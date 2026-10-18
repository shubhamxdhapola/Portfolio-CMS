import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { FiLoader } from 'react-icons/fi';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex flex-col items-center justify-center text-slate-800">
        <FiLoader className="size-8 text-amber-500 animate-spin mb-3" />
        <span className="text-sm font-medium text-slate-500">Verifying administrator session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
