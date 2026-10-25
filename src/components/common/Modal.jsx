import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * Reusable, self-contained Modal Popup component.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.icon]
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.footer]
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  size = 'md',
  children,
  footer
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-portal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className={`modal-container-card modal-size-${size}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header-bar">
          <div className="modal-title-group">
            {icon && <div className="modal-title-icon-wrap">{icon}</div>}
            <div>
              {title && <h3 className="modal-heading">{title}</h3>}
              {subtitle && <p className="modal-subheading">{subtitle}</p>}
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-icon-btn" 
            onClick={onClose}
            aria-label="Close popup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-scrollable">
          {children}
        </div>

        {/* Modal Footer (Optional) */}
        {footer && (
          <div className="modal-footer-bar">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
