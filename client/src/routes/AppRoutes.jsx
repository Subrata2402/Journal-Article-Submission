import { Routes, Route, useLocation } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { ProtectedRoute, UserRoute, EditorRoute, ReviewerRoute, AdminRoute } from '../components/routes/RouteGuards';
import Spinner from '../components/common/Spinner';
import MainLayout from '../components/layout/MainLayout';

// Lazy loaded components
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'));
const ProfilePage = lazy(() => import('../pages/auth/ProfilePage'));
const EditProfilePage = lazy(() => import('../pages/auth/EditProfilePage'));
const ArticlesPage = lazy(() => import('../pages/article/ArticlesPage'));
const ArticleDetailsPage = lazy(() => import('../pages/article/ArticleDetailsPage'));
const AddArticlePage = lazy(() => import('../pages/article/AddArticlePage'));
const EditArticlePage = lazy(() => import('../pages/article/EditArticlePage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const ReviewerPage = lazy(() => import('../pages/reviewer/ReviewerPage'));
const ReviewPage = lazy(() => import('../pages/reviewer/ReviewPage'));
const ReviewArticlePage = lazy(() => import('../pages/reviewer/ReviewArticlePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const JournalDetailsPage = lazy(() => import('../pages/journal/JournalDetailsPage'));
const AddJournalPage = lazy(() => import('../pages/journal/AddJournalPage'));
const EditJournalPage = lazy(() => import('../pages/journal/EditJournalPage'));
const AddEditorPage = lazy(() => import('../pages/journal/AddEditorPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spinner />
  </div>
);

const AppRoutes = () => {

  return (
    <Routes>
      {/* Auth routes without the main layout */}
      <Route path="/login" element={
        <Suspense fallback={<LoadingSpinner />}>
          <LoginPage />
        </Suspense>
      } />
      <Route path="/register" element={
        <Suspense fallback={<LoadingSpinner />}>
          <RegisterPage />
        </Suspense>
      } />
      <Route path="/verify-email" element={
        <Suspense fallback={<LoadingSpinner />}>
          <VerifyEmailPage />
        </Suspense>
      } />
      <Route path="/forgot-password" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ForgotPasswordPage />
        </Suspense>
      } />
      <Route path="/reset-password" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ResetPasswordPage />
        </Suspense>
      } />

      {/* Routes with MainLayout */}
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AboutPage />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ContactPage />
          </Suspense>
        } />
        
        {/* 404 page with MainLayout */}
        <Route path="*" element={
          <Suspense fallback={<LoadingSpinner />}>
            <NotFoundPage />
          </Suspense>
        } />

        {/* Protected Journal Details route - requires authentication */}
        <Route
          path="/view-journal/:journalId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <JournalDetailsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Edit Journal route - only for admins */}
        <Route
          path="/edit-journal/:journalId"
          element={
            <AdminRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <EditJournalPage />
              </Suspense>
            </AdminRoute>
          }
        />

        {/* Common protected routes - accessible by both roles */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <EditProfilePage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* User-only routes */}
        <Route
          path="/add-article"
          element={
            <UserRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AddArticlePage />
              </Suspense>
            </UserRoute>
          }
        />
        <Route
          path="/articles/:articleId/edit"
          element={
            <UserRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <EditArticlePage />
              </Suspense>
            </UserRoute>
          }
        />

        {/* Shared article routes with conditional rendering inside */}
        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ArticlesPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles/:articleId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ArticleDetailsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Editor-only routes */}
        <Route
          path="/reviewer"
          element={
            <EditorRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ReviewerPage />
              </Suspense>
            </EditorRoute>
          }
        />

        {/* Reviewer-only routes */}
        <Route
          path="/review"
          element={
            <ReviewerRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ReviewPage />
              </Suspense>
            </ReviewerRoute>
          }
        />
        <Route
          path="/review/:articleId"
          element={
            <ReviewerRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ReviewArticlePage />
              </Suspense>
            </ReviewerRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/add-journal"
          element={
            <AdminRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AddJournalPage />
              </Suspense>
            </AdminRoute>
          }
        />
        <Route
          path="/add-editor"
          element={
            <AdminRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AddEditorPage />
              </Suspense>
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
