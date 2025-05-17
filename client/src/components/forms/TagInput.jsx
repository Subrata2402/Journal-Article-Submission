// filepath: d:\Programming\React-Projects\journal_project\client\src\components\forms\TagInput.jsx
import React, { useRef } from 'react';
import { IoClose, IoAddOutline } from 'react-icons/io5';
import '../../assets/styles/common/forms.scss';

const TagInput = ({
  label,
  tags,
  setTags,
  placeholder = "Add tags (press Enter or comma)",
  tagInputValue,
  setTagInputValue,
  error,
  required = false,
  maxTags = null,
  className = '',
  helpText = "Press Enter, comma, or tab to add a tag",
  icon
}) => {
  const tagInputRef = useRef(null);
  
  const handleTagInputChange = (e) => {
    setTagInputValue(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && tagInputValue === '' && tags.length > 0) {
      // Remove the last tag when backspace is pressed on empty input
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedInput = tagInputValue.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      // Check for max tags limit
      if (maxTags !== null && tags.length >= maxTags) {
        return;
      }
      const newTags = [...tags, trimmedInput];
      setTags(newTags);
      setTagInputValue('');
    }
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleTagInputBlur = () => {
    if (tagInputValue.trim()) {
      addTag();
    }
  };

  const focusTagInput = () => {
    tagInputRef.current?.focus();
  };
  
  const isMaxTagsReached = maxTags !== null && tags.length >= maxTags;
  return (
    <div className={`tags-input-container ${className}`}>
      {label && (
        <label className="tags-input-label">
          {icon && <span className="form-field__icon">{icon}</span>}
          {label} {required && <span className="form-field__required">*</span>}
        </label>
      )}
      <div
        className="tags-input-wrapper"
        onClick={focusTagInput}
      >
        {tags.map((tag, index) => (
          <div className="tag-item" key={index}>
            <span>{tag}</span>
            <button
              type="button"
              className="tag-close"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              aria-label={`Remove tag ${tag}`}
            >
              <IoClose />
            </button>
          </div>
        ))}
        <input
          ref={tagInputRef}
          type="text"
          value={tagInputValue}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
          onBlur={handleTagInputBlur}
          className="tags-input"
          placeholder={tags.length === 0 ? placeholder : ""}
          disabled={isMaxTagsReached}
        />
        {tagInputValue && !isMaxTagsReached && (
          <button 
            type="button" 
            className="add-tag-btn"
            onClick={addTag}
            aria-label="Add tag"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}
          >
            <IoAddOutline />
          </button>
        )}
      </div>
      {error ? (
        <div className="form-field__error">{error}</div>
      ) : (
        <div className="tags-input-help">
          {isMaxTagsReached ? `Maximum ${maxTags} tags reached` : helpText}
        </div>
      )}
    </div>
  );
};

export default TagInput;