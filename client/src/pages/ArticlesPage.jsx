import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserArticleList from '../components/article/UserArticleList';
import EditorArticleList from '../components/article/EditorArticleList';
import Spinner from '../components/common/Spinner';
import '../assets/styles/article/userArticleList.scss';

const ArticlesPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  
  // Check if user is an editor
  const isEditor = user && user.role === "editor";

  // If authentication is loading, show spinner
  if (authLoading) {
    return <Spinner fullPage />;
  }

  return (
    <>
      <header className="page-header">
        <h1>{isEditor ? 'Article Review' : 'My Articles'}</h1>
        <p>
          {isEditor 
            ? 'Review and manage submitted articles' 
            : 'Manage and track the status of your submitted articles'
          }
        </p>
      </header>
      
      <div className="content-container">
        {isEditor ? <EditorArticleList /> : <UserArticleList />}
      </div>
    </>
  );
};

export default ArticlesPage;