import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const AboutMeCms = lazy(() => import('./pages/AboutMeCms.jsx'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'));
const CertificationsCms = lazy(() => import('./pages/CertificationsCms.jsx'));
const DashboardOverviewPage = lazy(() => import('./pages/DashboardOverviewPage.jsx'));
const EducationCms = lazy(() => import('./pages/EducationCms.jsx'));
const HomePageCms = lazy(() => import('./pages/HomePageCms.jsx'));
const LeetCodeCms = lazy(() => import('./pages/LeetCodeCms.jsx'));
const ProjectsCms = lazy(() => import('./pages/ProjectsCms.jsx'));
const ResumeCms = lazy(() => import('./pages/ResumeCms.jsx'));
const SettingsCms = lazy(() => import('./pages/SettingsCms.jsx'));
const SkillsCms = lazy(() => import('./pages/SkillsCms.jsx'));
const SocialLinksCms = lazy(() => import('./pages/SocialLinksCms.jsx'));
const WorkCms = lazy(() => import('./pages/WorkCms.jsx'));

function ProtectedAdminLayout() {
  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f5f7]" />}>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedAdminLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="home" element={<HomePageCms />} />
          <Route path="about" element={<AboutMeCms />} />
          <Route path="projects" element={<ProjectsCms />} />
          <Route path="skills" element={<SkillsCms />} />
          <Route path="leetcode" element={<LeetCodeCms />} />
          <Route path="certifications" element={<CertificationsCms />} />
          <Route path="education" element={<EducationCms />} />
          <Route path="work" element={<WorkCms />} />
          <Route path="resume" element={<ResumeCms />} />
          <Route path="social-links" element={<SocialLinksCms />} />
          <Route path="settings" element={<SettingsCms />} />
        </Route>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
}
