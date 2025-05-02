import React from 'react';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoInformationCircleOutline, IoWarningOutline } from 'react-icons/io5';
import '../../assets/styles/common/alert.scss';

const Alert = ({ 
  type = 'info', 
  message, 
  title, 
  onClose,
  autoClose = false,
  autoCloseDelay = 5000
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  
  React.useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, isVisible]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircleOutline className="alert__icon alert__icon--success" />;
      case 'error':
        return <IoCloseCircleOutline className="alert__icon alert__icon--error" />;
      case 'warning':
        return <IoWarningOutline className="alert__icon alert__icon--warning" />;
      case 'info':
      default:
        return <IoInformationCircleOutline className="alert__icon alert__icon--info" />;
    }
  };
  
  return (
    <div className={`alert alert--${type}`}>
      <div className="alert__content">
        {getIcon()}
        <div className="alert__text">
          {title && <h4 className="alert__title">{title}</h4>}
          <p className="alert__message">{message}</p>
        </div>
      </div>
      {onClose && (
        <button className="alert__close" onClick={handleClose}>
          <IoCloseCircleOutline />
        </button>
      )}
    </div>
  );
};

export default Alert;