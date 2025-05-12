import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';
import ArticleForm from '../../components/article/ArticleForm';
import { useAuth } from '../../contexts/AuthContext';
import articleService from '../../services/articleService';
import toastUtil from '../../utils/toastUtil';

const EditArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading: authLoading } = useAuth();
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [articleData, setArticleData] = useState(null);
  const [referrer, setReferrer] = useState('/articles'); // default referrer
  
  useEffect(() => {
    fetchArticleData();
    
    // Determine where the user came from
    const { state } = location;
    if (state && state.referrer) {
      setReferrer(state.referrer);
    } else if (document.referrer.includes('/articles/')) {
      setReferrer(`/articles/${articleId}`);
    } else {
      setReferrer('/articles');
    }
  }, [articleId, location]);
  
  const fetchArticleData = async () => {
    if (!articleId) return;
    
    setInitialLoading(true);
    try {
      const result = await articleService.getArticleById(articleId);
      if (result.success) {
        const article = result.data;
        
        // Format data for our form component
        setArticleData({
          title: article.title || '',
          abstract: article.abstract || '',
          journalId: article.journalId?._id || '',
          keywords: article.keywords || [],
          menuScript: article.menuScript || null,
          coverLetter: article.coverLetter || null,
          supplementaryFile: article.supplementaryFile || null,
          authors: article.authors || []
        });
      } else {
        toastUtil.error('Failed to fetch article data');
        navigate('/articles');
      }
    } catch (err) {
      console.error('Error fetching article data:', err);
      toastUtil.error('An error occurred while fetching article data. Please try again later.');
      navigate('/articles');
    } finally {
      setInitialLoading(false);
    }
  };
  
  const handleSubmit = async (formData) => {
    try {
      // Make API request using FormData
      const response = await articleService.updateArticle(articleId, formData);
      
      if (response.success) {
        toastUtil.success('Article updated successfully');
        navigate(`/articles/${articleId}`);
      } else {
        toastUtil.error(response.message || 'Failed to update article');
      }
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  // If authentication is loading, show spinner
  if (authLoading) {
    return <Spinner fullPage />;
  }
  
  if (initialLoading) {
    return (
      <div className="content-container">
        <div className="loading-container">
          <Spinner size="medium" />
          <p>Loading article data...</p>
        </div>
      </div>
    );
  }
  
  const backText = referrer.includes('/articles/') ? 'Article' : 'Articles';
  
  return (
    <ArticleForm
      mode="edit"
      initialData={articleData}
      articleId={articleId}
      submitHandler={handleSubmit}
      backLink={referrer}
      backText={backText}
      pageTitle="Edit Article"
      pageDescription="Update your article information below"
      buttonText="Update Article"
      loadingText="Updating..."
    />
  );
};

export default EditArticlePage;