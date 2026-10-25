import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import LogoutModal from './components/LogoutModal';
import LoginPage from './pages/auth/LoginPage';
import './App.css';

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItemId, setActiveItemId] = useState('dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'System Administrator',
    username: 'admin@quantumit.com',
    role: 'Super Admin'
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleLoginSuccess = (userPayload) => {
    if (userPayload) {
      setCurrentUser(userPayload);
    }
    setIsLoggedIn(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsLoggedIn(false);
  };

  // Show Login Page when not authenticated
  if (!isLoggedIn) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        onToggleSidebar={handleToggleSidebar}
        onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
        isSidebarCollapsed={isSidebarCollapsed}
        currentUser={currentUser}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="main-wrapper">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          activeItemId={activeItemId}
          onSelectItem={(id) => setActiveItemId(id)}
        />
        <MainContent 
          activeItemId={activeItemId} 
          onNavigate={(id) => setActiveItemId(id)} 
        />
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
