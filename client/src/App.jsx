import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailsPage from './pages/ArticleDetailsPage';
import AddArticlePage from './pages/AddArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ReviewerPage from './pages/ReviewerPage';
import ReviewPage from './pages/ReviewPage';
import ReviewArticlePage from './pages/ReviewArticlePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import JournalDetailsPage from './pages/JournalDetailsPage';
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
              path="/journals/:journalId" 
              element={
                <ProtectedRoute>
                  <JournalDetailsPage />
                </ProtectedRoute>
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
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
