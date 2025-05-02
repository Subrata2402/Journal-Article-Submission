import React, { useRef, useState } from 'react';
import { IoCloudUploadOutline, IoDocumentOutline } from 'react-icons/io5';
import '../../assets/styles/common/dragDropFileUpload.scss';

const DragDropFileUpload = ({ 
  title, 
  name, 
  acceptedFormats = ".pdf", 
  value, 
  onChange, 
  error,
  required = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e, isDragging) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging !== undefined) {
      setDragActive(isDragging);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onChange({ target: { name, files: [file] } });
    }
  };

  // Handle manual file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e);
    }
  };

  // Handle button click to open file explorer
  const handleButtonClick = () => {
    inputRef.current && inputRef.current.click();
  };

  return (
    <div 
      className={`drag-drop-upload ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDragOver={(e) => handleDrag(e)}
      onDrop={(e) => handleDrop(e)}
    >
      <div className="upload-content">
        <div className="upload-icon">
          <IoCloudUploadOutline />
        </div>
        <p className="upload-title">{title}</p>
        <p className="upload-instruction">Drag & Drop to Upload File</p>
        <p className="upload-separator">OR</p>
        <input
          type="file"
          name={name}
          id={name}
          accept={acceptedFormats}
          onChange={handleFileChange}
          className="file-input"
          ref={inputRef}
          // Remove the required attribute to prevent the focusability issue
          aria-required={required}
          tabIndex={-1}
          aria-hidden="true"
        />
        <button 
          type="button" 
          className="browse-file-btn"
          onClick={handleButtonClick}
          // Make the button properly focusable
          tabIndex={0}
          aria-label={`Browse for ${title}`}
        >
          Browse File
        </button>
        {value && (
          <div className="selected-file">
            <IoDocumentOutline />
            <span>{value.name}</span>
          </div>
        )}
        {error && <div className="upload-error" role="alert">{error}</div>}
      </div>
    </div>
  );
};

export default DragDropFileUpload;