import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, UserRoute, EditorRoute, ReviewerRoute, AdminRoute, AdminOrEditorRoute } from '../components/routes/RouteGuards';

// Page imports
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import ProfilePage from '../pages/auth/ProfilePage';
import EditProfilePage from '../pages/auth/EditProfilePage';
import ArticlesPage from '../pages/article/ArticlesPage';
import ArticleDetailsPage from '../pages/article/ArticleDetailsPage';
import AddArticlePage from '../pages/article/AddArticlePage';
import EditArticlePage from '../pages/article/EditArticlePage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ReviewerPage from '../pages/reviewer/ReviewerPage';
import ReviewPage from '../pages/reviewer/ReviewPage';
import ReviewArticlePage from '../pages/reviewer/ReviewArticlePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import JournalDetailsPage from '../pages/journal/JournalDetailsPage';
import AddJournalPage from '../pages/journal/AddJournalPage';
import EditJournalPage from '../pages/journal/EditJournalPage';
import AddEditorPage from '../pages/journal/AddEditorPage';
import NotFoundPage from '../pages/NotFoundPage';
import MainLayout from '../components/layout/MainLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes without the main layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Routes with MainLayout */}
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* 404 page with MainLayout */}
        <Route path="*" element={<NotFoundPage />} />

        {/* Protected Journal Details route - requires authentication */}
        <Route
          path="/view-journal/:journalId"
          element={
            <ProtectedRoute>
              <JournalDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Edit Journal route - only for admins and editors */}
        <Route
          path="/edit-journal/:journalId"
          element={
            <AdminOrEditorRoute>
              <EditJournalPage />
            </AdminOrEditorRoute>
          }
        />

        {/* Common protected routes - accessible by both roles */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        {/* User-only routes */}
        <Route
          path="/add-article"
          element={
            <UserRoute>
              <AddArticlePage />
            </UserRoute>
          }
        />
        <Route
          path="/articles/:articleId/edit"
          element={
            <UserRoute>
              <EditArticlePage />
            </UserRoute>
          }
        />

        {/* Shared article routes with conditional rendering inside */}
        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <ArticlesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles/:articleId"
          element={
            <ProtectedRoute>
              <ArticleDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Editor-only routes */}
        <Route
          path="/reviewer"
          element={
            <EditorRoute>
              <ReviewerPage />
            </EditorRoute>
          }
        />

        {/* Reviewer-only routes */}
        <Route
          path="/review"
          element={
            <ReviewerRoute>
              <ReviewPage />
            </ReviewerRoute>
          }
        />
        <Route
          path="/review/:articleId"
          element={
            <ReviewerRoute>
              <ReviewArticlePage />
            </ReviewerRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/add-journal"
          element={
            <AdminRoute>
              <AddJournalPage />
            </AdminRoute>
          }
        />
        <Route
          path="/add-editor"
          element={
            <AdminRoute>
              <AddEditorPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
