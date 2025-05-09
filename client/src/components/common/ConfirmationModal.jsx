import React from 'react';
import { IoWarningOutline, IoCloseOutline } from 'react-icons/io5';
import '../../assets/styles/common/modal.scss';

const ConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onClose,  
  onCancel,
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'warning', // warning, danger, success, primary
  isLoading = false
}) => {
  // If onCancel is not provided, use onClose as a fallback
  const handleCancel = onCancel || onClose;
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className={`modal-content modal-${confirmVariant}`}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button 
              className="modal-close-btn" 
              onClick={handleCancel}
              disabled={isLoading}
              aria-label="Close"
            >
              <IoCloseOutline />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="modal-icon">
              <IoWarningOutline />
            </div>
            <p>{message}</p>
          </div>
          
          <div className="modal-footer">
            <button 
              className="modal-btn modal-btn-secondary" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button 
              className={`modal-btn modal-btn-${confirmVariant}`} 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;