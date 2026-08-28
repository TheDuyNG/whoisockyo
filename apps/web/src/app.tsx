import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/components/dashboard/protected-route';
import { LoadingSkeleton } from '@/components/ui/async-state';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { PublicLayout } from '@/layouts/public-layout';

const HomePage = lazy(() => import('@/pages/public/home-page'));
const ProjectsPage = lazy(() => import('@/pages/public/projects-page'));
const ProjectDetailPage = lazy(() => import('@/pages/public/project-detail-page'));
const ContactPage = lazy(() => import('@/pages/public/contact-page'));
const LoginPage = lazy(() => import('@/pages/auth/login-page'));
const DashboardHomePage = lazy(() => import('@/pages/dashboard/dashboard-home-page'));
const ProfilePage = lazy(() => import('@/pages/dashboard/profile-page'));
const DashboardProjectsPage = lazy(() => import('@/pages/dashboard/projects-page'));
const ExperiencePage = lazy(() => import('@/pages/dashboard/experience-page'));
const SkillsPage = lazy(() => import('@/pages/dashboard/skills-page'));
const SocialLinksPage = lazy(() => import('@/pages/dashboard/social-links-page'));
const MessagesPage = lazy(() => import('@/pages/dashboard/messages-page'));
const SettingsPage = lazy(() => import('@/pages/dashboard/settings-page'));
const NotFoundPage = lazy(() => import('@/pages/not-found-page'));

function RouteFallback() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <LoadingSkeleton rows={4} />
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="projects" element={<DashboardProjectsPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="social-links" element={<SocialLinksPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
