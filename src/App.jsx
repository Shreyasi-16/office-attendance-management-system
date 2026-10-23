import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import LogoutModal from './components/LogoutModal';
import { LogIn } from 'lucide-react';
import './App.css';

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItemId, setActiveItemId] = useState('dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsLoggedIn(false);
  };

  // Logged out placeholder screen with 1-click re-login
  if (!isLoggedIn) {
    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-page)',
          padding: 24,
          fontFamily: 'inherit'
        }}
      >
        <div 
          style={{
            backgroundColor: '#ffffff',
            padding: 36,
            borderRadius: 16,
            boxShadow: 'var(--shadow-dropdown)',
            textAlign: 'center',
            maxWidth: 420,
            width: '100%',
            border: '1px solid var(--border-light)'
          }}
        >
          <div 
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: 'var(--navy-subtle)',
              color: 'var(--navy-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <LogIn size={28} />
          </div>
          <h2 style={{ fontSize: 20, color: 'var(--navy-primary)', marginBottom: 8 }}>
            Logged Out Successfully
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Your session has been terminated securely. Click below to return to the dashboard.
          </p>
          <button
            type="button"
            className="filter-search-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setIsLoggedIn(true)}
          >
            Log In as System Administrator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        onToggleSidebar={handleToggleSidebar}
        onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="main-wrapper">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          activeItemId={activeItemId}
          onSelectItem={(id) => setActiveItemId(id)}
        />
        <MainContent activeItemId={activeItemId} />
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
