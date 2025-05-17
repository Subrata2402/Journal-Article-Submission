import React, { useState, useRef } from 'react';
import { IoCloudUploadOutline, IoDocumentOutline, IoAlertCircleOutline } from 'react-icons/io5';
import '../../assets/styles/common/dragDropFileUpload.scss';

const DragDropFileUpload = ({ 
  title, 
  name, 
  acceptedFormats = ".pdf", 
  value, 
  onChange, 
  error,
  required = false,
  existingFile = null,
  maxFileSize = 10 // Max file size in MB
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [sizeError, setSizeError] = useState(null);
  const inputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  // Check file size
  const validateFileSize = (file) => {
    const fileSize = file.size / 1024 / 1024; // Convert to MB
    if (fileSize > maxFileSize) {
      setSizeError(`File size exceeds ${maxFileSize}MB limit`);
      return false;
    }
    setSizeError(null);
    return true;
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (validateFileSize(file)) {
        // Create synthetic event to pass to onChange handler
        const event = {
          target: {
            name: name,
            files: e.dataTransfer.files
          }
        };
        onChange(event);
      }
    }
  };

  // Handle manual file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (validateFileSize(file)) {
        onChange(e);
      } else {
        // Clear the input if file is too large
        e.target.value = '';
      }
    }
  };

  // Handle button click to open file explorer
  const handleButtonClick = () => {
    inputRef.current && inputRef.current.click();
  };

  // Get file name to display
  const getDisplayFileName = () => {
    if (value) {
      return value.name;
    } else if (existingFile) {
      // Extract filename from path if it's a full path
      const fileNameParts = existingFile.split('\\');
      return fileNameParts[fileNameParts.length - 1];
    }
    return null;
  };

  const fileName = getDisplayFileName();

  return (
    <div 
      className={`drag-drop-upload ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="upload-content">
        <div className="upload-icon">
          <IoCloudUploadOutline />
        </div>
        <p className="upload-title">{title}</p>
        <p className="upload-instruction">
          {fileName ? "Change file" : "Drag & Drop to Upload File"}
        </p>
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
        </button>        {fileName && (
          <div className="selected-file">
            <IoDocumentOutline />
            <span title={fileName}>{fileName}</span>
          </div>
        )}
        {existingFile && !value && (
          <div className="selected-file">
            <IoDocumentOutline />
            <span title={existingFile}>Current: {getDisplayFileName()}</span>
          </div>
        )}
        {error && <div className="upload-error" role="alert">{error}</div>}
        {sizeError && <div className="upload-error" role="alert">
          <IoAlertCircleOutline /> {sizeError}
        </div>}
        <div className="upload-size-limit">
          Maximum file size: {maxFileSize}MB
        </div>
      </div>
    </div>
  );
};

export default DragDropFileUpload;