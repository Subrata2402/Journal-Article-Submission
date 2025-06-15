import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Spinner from './components/common/Spinner';
import Preloader from './components/common/Preloader';
import './assets/styles/main.scss';

// Global loading component for suspense fallback
const GlobalLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spinner size="large" fullPage={true} />
  </div>
);

const App = () => {
  return (
    <>
      <Preloader />
      <Suspense fallback={<GlobalLoader />}>
        <AuthProvider>
          <Router>
            <AppRoutes />
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
      </Suspense>
    </>
  );
};

export default App;
