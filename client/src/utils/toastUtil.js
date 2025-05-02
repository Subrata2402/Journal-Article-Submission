import { toast } from 'react-toastify';

// Toast configuration options
const defaultOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

// Toast utility functions
const toastUtil = {
  success: (message, options = {}) => {
    return toast.success(message, { ...defaultOptions, ...options });
  },
  
  error: (message, options = {}) => {
    return toast.error(message, { ...defaultOptions, ...options });
  },
  
  info: (message, options = {}) => {
    return toast.info(message, { ...defaultOptions, ...options });
  },
  
  warning: (message, options = {}) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  },
  
  // For custom content with more control
  custom: (content, options = {}) => {
    return toast(content, { ...defaultOptions, ...options });
  }
};

export default toastUtil;