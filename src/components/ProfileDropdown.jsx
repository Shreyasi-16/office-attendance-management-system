import React, { useEffect, useRef } from 'react';
import { User, Settings, Clock, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';

export default function ProfileDropdown({ isOpen, onClose, onLogout }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="profile-dropdown-card" ref={dropdownRef}>
      <div className="profile-info-header">
        <div className="profile-info-name">System Administrator</div>
        <div className="profile-info-email">admin@quantumit.com</div>
        <span className="profile-role-tag">
          <ShieldCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
          HR Super Admin
        </span>
      </div>

      <ul className="profile-menu-list">
        <li>
          <button 
            type="button" 
            className="profile-menu-item" 
            onClick={() => { alert('Opening Profile Details'); onClose(); }}
          >
            <User size={16} />
            <span>My Profile</span>
          </button>
        </li>
        <li>
          <button 
            type="button" 
            className="profile-menu-item"
            onClick={() => { alert('Opening Attendance History'); onClose(); }}
          >
            <Clock size={16} />
            <span>Attendance History</span>
          </button>
        </li>
        <li>
          <button 
            type="button" 
            className="profile-menu-item"
            onClick={() => { alert('Opening System Preferences'); onClose(); }}
          >
            <Settings size={16} />
            <span>System Settings</span>
          </button>
        </li>

        <li className="profile-menu-divider"></li>

        <li>
          <button 
            type="button" 
            className="profile-menu-item profile-menu-logout"
            onClick={() => {
              onClose();
              onLogout();
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
