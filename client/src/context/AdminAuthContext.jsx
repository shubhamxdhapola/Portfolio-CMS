import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../api/client.js';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const loadCurrentAdmin = useCallback(async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setAdmin(response?.data?.admin || response?.data?.user || null);
      setAuthError(null);
    } catch (error) {
      if (error.status !== 401 && error.status !== 403) {
        setAuthError(error);
        console.error('Unable to verify the administrator session:', error);
      }
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentAdmin();
  }, [loadCurrentAdmin]);

  const login = useCallback(async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    const signedInAdmin = response?.data?.admin || response?.data?.user;
    if (!signedInAdmin) {
      throw new Error('The server response did not include an administrator account.');
    }
    setAdmin(signedInAdmin);
    setAuthError(null);
    return signedInAdmin;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setAdmin(null);
    }
  }, []);

  const updateProfile = useCallback(async (profile) => {
    const response = await apiClient.put('/auth/profile', profile);
    const updatedAdmin = response?.data?.admin || response?.data?.user;
    if (!updatedAdmin) {
      throw new Error('The server response did not include the updated administrator account.');
    }
    setAdmin(updatedAdmin);
    return updatedAdmin;
  }, []);

  const value = useMemo(
    () => ({
      admin,
      authError,
      isAuthenticated: Boolean(admin),
      loading,
      login,
      logout,
      updateProfile,
    }),
    [admin, authError, loading, login, logout, updateProfile]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider.');
  }
  return context;
}
