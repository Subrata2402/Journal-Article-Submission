import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';
import ArticleForm from '../../components/article/ArticleForm';
import { useAuth } from '../../contexts/AuthContext';
import httpService from '../../services/httpService';
import { API_ENDPOINTS } from '../../config/api';
import toastUtil from '../../utils/toastUtil';

const AddArticlePage = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth();
  
  const handleSubmit = async (formData) => {
    try {
      // Make API request using FormData
      const response = await httpService.post(API_ENDPOINTS.ARTICLES.SUBMIT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toastUtil.success('Article submitted successfully');
        navigate('/articles');
      } else {
        toastUtil.error(response.data.message || 'Failed to submit article');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // If authentication is loading, show spinner
  if (authLoading) {
    return <Spinner fullPage />;
  }  return (
    <ArticleForm
      mode="add"
      submitHandler={handleSubmit}
      pageTitle="Submit New Article"
      pageDescription="Complete the form below to submit your article for review"
      buttonText="Submit Article"
      loadingText="Submitting..."
    />
  );
};

export default AddArticlePage;