// ArticleModal.js
import React from 'react';
import './ArticleModal.css';

const ArticleModal = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{article.title}</h2>
        <p>{article.content}</p>
        <p><strong>Author:</strong> {article.author}</p>
      </div>
    </div>
  );
};

export default ArticleModal;
