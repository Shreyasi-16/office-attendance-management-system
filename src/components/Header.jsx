import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, User, Building2 } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

export default function Header({ 
  onToggleSidebar, 
  onOpenLogoutModal,
  isSidebarCollapsed 
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);

  return (
    <header className="top-header">
      {/* Left: Hamburger + Brand */}
      <div className="header-left">
        <button 
          type="button" 
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={22} />
        </button>

        <div className="brand-container">
          <div className="brand-logo-badge">
            <Building2 size={22} strokeWidth={2.2} />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">ATTENDANCE PRO</span>
            <span className="brand-subtitle">Office Attendance Management</span>
          </div>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="header-right">
        {/* Notification Bell */}
        <button 
          type="button" 
          className="notification-btn"
          aria-label="Notifications"
          title={`${notificationsCount} unread attendance alerts`}
          onClick={() => {
            alert('Notifications: 3 pending regularization requests await your approval.');
          }}
        >
          <Bell size={18} />
          {notificationsCount > 0 && <span className="notification-badge" />}
        </button>

        {/* User Profile Trigger */}
        <button
          type="button"
          className={`user-profile-trigger ${isProfileOpen ? 'active' : ''}`}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          aria-expanded={isProfileOpen}
          aria-haspopup="true"
        >
          <div className="profile-avatar-circle">
            <User size={16} strokeWidth={2.5} />
          </div>
          <span className="profile-name">System Administrator</span>
          <ChevronDown 
            size={16} 
            className={`profile-chevron ${isProfileOpen ? 'rotated' : ''}`} 
          />
        </button>

        {/* Profile Dropdown Menu */}
        <ProfileDropdown 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          onLogout={onOpenLogoutModal}
        />
      </div>
    </header>
  );
}
