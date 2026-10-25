import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import './Toast.css';

/**
 * Reusable, self-contained Toast Notification component.
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast items: [{ id, type: 'success'|'error'|'warning'|'info', title, message }]
 * @param {Function} props.onDismiss - Callback with toast ID
 */
export default function Toast({ toasts = [], onDismiss }) {
  return (
    <div className="toast-portal-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDismiss) onDismiss(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon-svg" />,
    error: <AlertCircle size={18} className="toast-icon-svg" />,
    warning: <AlertTriangle size={18} className="toast-icon-svg" />,
    info: <Info size={18} className="toast-icon-svg" />
  };

  return (
    <div className={`toast-card toast-${toast.type || 'info'}`} role="alert">
      <div className="toast-icon-wrapper">
        {icons[toast.type || 'info']}
      </div>
      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={() => onDismiss && onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
      <div 
        className="toast-progress-bar" 
        style={{ animationDuration: `${toast.duration || 4000}ms` }} 
      />
    </div>
  );
}
