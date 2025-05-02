import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserArticleList from '../components/article/UserArticleList';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Spinner from '../components/common/Spinner';
import useTheme from '../hooks/useTheme';
import { Navigate } from 'react-router-dom';
import '../assets/styles/article/userArticleList.scss';

const ArticlesPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { theme, handleThemeChange } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const themeMenuRef = React.useRef(null);

  const toggleThemeMenu = () => {
    setShowThemeMenu(prev => !prev);
  };

  // If authentication is loading, show spinner
  if (authLoading) {
    return <Spinner fullPage />;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app">
      <Navbar 
        theme={theme}
        handleThemeChange={handleThemeChange}
        showThemeMenu={showThemeMenu}
        toggleThemeMenu={toggleThemeMenu}
        themeMenuRef={themeMenuRef}
        isAuthenticated={isAuthenticated}
      />
      
      <main className="main-content">
        <header className="page-header">
          <h1>My Articles</h1>
          <p>Manage and track the status of your submitted articles</p>
        </header>
        
        <div className="content-container">
          <UserArticleList />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticlesPage;