import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ProfilePage from './pages/auth/ProfilePage';
import EditProfilePage from './pages/auth/EditProfilePage';
import ArticlesPage from './pages/article/ArticlesPage';
import ArticleDetailsPage from './pages/article/ArticleDetailsPage';
import AddArticlePage from './pages/article/AddArticlePage';
import EditArticlePage from './pages/article/EditArticlePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ReviewerPage from './pages/reviewer/ReviewerPage';
import ReviewPage from './pages/reviewer/ReviewPage';
import ReviewArticlePage from './pages/reviewer/ReviewArticlePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import JournalDetailsPage from './pages/journal/JournalDetailsPage';
import AddJournalPage from './pages/journal/AddJournalPage';
import EditJournalPage from './pages/journal/EditJournalPage';
import AddEditorPage from './pages/journal/AddEditorPage';
import MainLayout from './components/layout/MainLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './assets/styles/main.scss';

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return children;
};

// User-only route - redirects editors to the home page
const UserRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If user is an editor, redirect to home page
  if (user && user.role === "editor") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Editor-only route - redirects regular users to the home page
const EditorRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If user is not an editor, redirect to home page
  if (!user || user.role !== "editor") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Reviewer-only route - redirects non-reviewers to the home page
const ReviewerRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If user is not a reviewer, redirect to home page
  if (!user || user.role !== "reviewer") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin-only route - redirects non-admins to the home page
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If user is not an admin, redirect to home page
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin or Editor route - restricts access to users with these roles
const AdminOrEditorRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // Allow access only if user is an admin or editor
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
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

          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          closeButton={false}
          draggablepercent={80}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
