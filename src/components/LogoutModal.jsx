import React from 'react';
import { LogOut, AlertCircle } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-icon">
          <LogOut size={24} />
        </div>
        <h3 className="modal-title">Sign Out of Session</h3>
        <p className="modal-description">
          Are you sure you want to log out? Any unsaved attendance approvals or configuration changes will be lost.
        </p>
        <div className="modal-actions">
          <button type="button" className="modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="modal-btn-confirm" onClick={onConfirm}>
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
