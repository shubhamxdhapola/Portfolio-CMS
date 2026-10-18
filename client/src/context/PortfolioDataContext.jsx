import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { apiClient } from '../api/client.js';

const PortfolioDataContext = createContext(null);
const PUBLIC_DATA_PATHS = [
  ['siteContent', '/public/site-content'],
  ['projects', '/public/projects'],
  ['skills', '/public/skills'],
  ['certifications', '/public/certifications'],
  ['education', '/public/education'],
  ['work', '/public/work'],
  ['resume', '/public/resume'],
];

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState({});

  const refreshData = useCallback(async () => {
    const entries = await Promise.all(
      PUBLIC_DATA_PATHS.map(async ([key, path]) => {
        const response = await apiClient.get(path);
        return [key, response?.data];
      })
    );
    setData(Object.fromEntries(entries));
    return Object.fromEntries(entries);
  }, []);

  const value = useMemo(() => ({ data, refreshData }), [data, refreshData]);

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider.');
  }
  return context;
}
