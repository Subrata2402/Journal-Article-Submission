import React from 'react';
import { IoWarningOutline, IoCloseOutline } from 'react-icons/io5';
import '../../assets/styles/common/modal.scss';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // warning, danger, info
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className={`modal-content modal-${type}`}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close-btn" onClick={onClose}>
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
            <button className="modal-btn modal-btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
            <button className={`modal-btn modal-btn-${type}`} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;