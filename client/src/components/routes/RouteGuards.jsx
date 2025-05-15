import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Protected route component that redirects to login if not authenticated
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} />;
  }

  return children;
};

// User-only route - redirects editors to the home page
export const UserRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} />;
  }

  // If user is an editor, redirect to home page
  if (user && user.role === "editor") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Editor-only route - redirects regular users to the home page
export const EditorRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} />;
  }

  // If user is not an editor, redirect to home page
  if (!user || user.role !== "editor") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Reviewer-only route - redirects non-reviewers to the home page
export const ReviewerRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} />;
  }

  // If user is not a reviewer, redirect to home page
  if (!user || user.role !== "reviewer") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin-only route - redirects non-admins to the home page
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Save the current path to redirect after login
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} />;
  }

  // If user is not an admin, redirect to home page
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin or Editor route - restricts access to users with these roles
export const AdminOrEditorRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} />;
  }

  // Allow access only if user is an admin or editor
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return <Navigate to="/" replace />;
  }

  return children;
};
