import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <div
      className={`alert ${isError ? 'alert-error' : isSuccess ? 'alert-success' : 'alert-info'}`}
      role="alert"
    >
      <div className="alert-content">
        {isError && <AlertCircle className="alert-icon" size={18} />}
        {isSuccess && <CheckCircle className="alert-icon" size={18} />}
        {!isError && !isSuccess && <Info className="alert-icon" size={18} />}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="alert-close"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
