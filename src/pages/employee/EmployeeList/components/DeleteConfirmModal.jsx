import React from 'react';
import Modal from '../../../../components/common/Modal';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  employee = null
}) {
  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Employee Record"
      subtitle={`Permanently remove ${employee.name} (${employee.id}) from attendance database`}
      icon={<Trash2 size={22} style={{ color: '#E11D48' }} />}
      size="sm"
      footer={
        <>
          <button
            type="button"
            className="emp-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              color: '#ffffff',
              backgroundColor: '#E11D48',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
              transition: 'all 0.2s'
            }}
            onClick={() => onConfirm(employee)}
          >
            Yes, Delete Employee
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            borderRadius: 10,
            backgroundColor: 'rgba(225, 29, 72, 0.08)',
            border: '1px solid rgba(225, 29, 72, 0.2)'
          }}
        >
          <AlertTriangle size={22} style={{ color: '#E11D48', flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: '#9F1239', lineHeight: 1.4 }}>
            Warning: This action cannot be undone. All attendance punch logs, assigned geofence limits, and QR credentials for this employee will be deactivated.
          </div>
        </div>

        <div 
          style={{
            padding: 14,
            borderRadius: 10,
            backgroundColor: 'rgba(240, 249, 255, 0.7)',
            border: '1px solid var(--border-light)',
            fontSize: 13
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--navy-primary)', fontSize: 14 }}>
            {employee.name}
          </div>
          <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
            <strong>ID:</strong> {employee.id} • <strong>Dept:</strong> {employee.department}
          </div>
          <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
            <strong>Office:</strong> {employee.office}
          </div>
        </div>
      </div>
    </Modal>
  );
}
