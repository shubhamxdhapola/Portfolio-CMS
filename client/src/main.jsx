import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import { PortfolioDataProvider } from './context/PortfolioDataContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <PortfolioDataProvider>
          <App />
        </PortfolioDataProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
