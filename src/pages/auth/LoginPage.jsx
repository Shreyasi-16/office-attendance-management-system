import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ShieldCheck, MapPin, QrCode, AlertCircle, ArrowRight, Hexagon, Sparkles, Cpu } from 'lucide-react';
import CursorLineCanvas from './CursorLineCanvas';
import './LoginPage.css';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin@quantumit.com');
  const [password, setPassword] = useState('Admin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [cursorEffect, setCursorEffect] = useState('hex');

  // Demo accounts for quick testing
  const demoAccounts = [
    {
      role: 'admin',
      label: 'Super Admin',
      username: 'admin@quantumit.com',
      password: 'Admin@2026',
      name: 'System Administrator'
    },
    {
      role: 'manager',
      label: 'HR Manager',
      username: 'manager@quantumit.com',
      password: 'Manager@2026',
      name: 'Ananya Gupta'
    },
    {
      role: 'employee',
      label: 'Employee',
      username: 'shreyasi@quantumit.com',
      password: 'Employee@2026',
      name: 'Shreyasi Sharma'
    }
  ];

  const handleSelectRole = (acc) => {
    setSelectedRole(acc.role);
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your Username or Email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay for smooth UX
    setTimeout(() => {
      setIsLoading(false);
      const matched = demoAccounts.find(
        (a) => a.username.toLowerCase() === username.trim().toLowerCase()
      );
      
      const userPayload = matched
        ? { username: matched.username, name: matched.name, role: matched.label }
        : { username: username.trim(), name: username.split('@')[0], role: 'Employee' };

      if (onLoginSuccess) {
        onLoginSuccess(userPayload);
      }
    }, 650);
  };

  return (
    <div className="login-screen-container">
      {/* Background Decorative Ambient Layers */}
      <div className="login-ambient-glow" />

      {/* Dynamic Interactive Cursor Line Pattern Canvas */}
      <CursorLineCanvas mode={cursorEffect} />

      {/* Main Login Card / Column */}
      <div className="login-card-wrapper">
        {/* Top Avatar Circle from Mockup */}
        <div className="login-avatar-container">
          <div className="login-avatar-ring">
            <img 
              src="/assets/avatar.png" 
              alt="User Avatar" 
              className="login-avatar-img"
              onError={(e) => {
                // Graceful fallback to icon if image cannot load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }} 
            />
            <div className="login-avatar-fallback" style={{ display: 'none' }}>
              <User size={38} strokeWidth={2.2} />
            </div>
          </div>
          <span className="login-avatar-status-dot" title="Office Geofence Active" />
        </div>

        {/* Heading */}
        <h1 className="login-title">Welcome Back!</h1>
        <p className="login-subtitle">
          Office Attendance &amp; Location Management System
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="login-error-alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Username / Email Input */}
          <div className="login-input-pill">
            <span className="login-input-icon">
              <User size={18} strokeWidth={2.2} />
            </span>
            <input
              type="text"
              className="login-input-field"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage('');
              }}
              autoComplete="username"
              aria-label="Username or Email"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="login-input-pill">
            <span className="login-input-icon">
              <Lock size={18} strokeWidth={2.2} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="login-input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
              autoComplete="current-password"
              aria-label="Password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="login-password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {/* Role Quick Selector Pills */}
          <div className="login-quick-roles">
            <span className="quick-roles-label">Quick Sign-In As:</span>
            <div className="quick-roles-pills">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  className={`role-pill-btn ${selectedRole === acc.role ? 'active' : ''}`}
                  onClick={() => handleSelectRole(acc)}
                  title={`Fill as ${acc.label}`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-btn-spinner-wrap">
                <span className="login-btn-spinner" />
                <span>VERIFYING...</span>
              </span>
            ) : (
              <span>LOGIN</span>
            )}
          </button>

          {/* Forgot Password Link */}
          <div className="login-forgot-wrap">
            <button
              type="button"
              className="login-forgot-link"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Username or Password?
            </button>
          </div>
        </form>

        {/* Geofence & QR Verification Trust Bar */}
        <div className="login-security-badge">
          <div className="security-badge-item">
            <MapPin size={14} className="security-icon" />
            <span>Office GPS Geofence Active</span>
          </div>
          <span className="security-divider">•</span>
          <div className="security-badge-item">
            <QrCode size={14} className="security-icon" />
            <span>Encrypted Dynamic QR</span>
          </div>
        </div>
      </div>

      {/* Forgot Credentials Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-dialog forgot-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-icon" style={{ backgroundColor: 'rgba(2, 132, 199, 0.12)', color: 'var(--cyan-primary)' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 className="modal-title">Reset Credentials</h3>
            <p className="modal-description">
              For security compliance under the Office Attendance System policy, credential resets require verification against your registered corporate email ID or HR authorization.
            </p>

            <div className="forgot-options-list">
              <div className="forgot-option-box">
                <div className="forgot-option-title">Self-Service Reset</div>
                <div className="forgot-option-desc">
                  An encrypted recovery link will be sent to <strong>{username || 'your corporate email'}</strong>.
                </div>
                <button
                  type="button"
                  className="forgot-action-btn"
                  onClick={() => {
                    alert(`Password reset instructions have been dispatched to: ${username || 'your corporate email'}`);
                    setShowForgotModal(false);
                  }}
                >
                  Send Recovery Link <ArrowRight size={14} />
                </button>
              </div>

              <div className="forgot-option-box">
                <div className="forgot-option-title">Contact HR Administrator</div>
                <div className="forgot-option-desc">
                  Email: <code>admin@quantumit.com</code> • Extension: <code>#4021</code>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => setShowForgotModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Cursor Effect Switcher */}
      <div className="login-effect-switcher" aria-label="Cursor Effect Switcher">
        <span className="effect-switcher-label">Effect:</span>
        <button
          type="button"
          className={`effect-pill-btn ${cursorEffect === 'hex' ? 'active' : ''}`}
          onClick={() => setCursorEffect('hex')}
          title="Hexagonal Radar & Laser Tracer (Matches Background)"
        >
          <Hexagon size={13} />
          <span>Hex Grid</span>
        </button>
        <button
          type="button"
          className={`effect-pill-btn ${cursorEffect === 'ribbon' ? 'active' : ''}`}
          onClick={() => setCursorEffect('ribbon')}
          title="Neon Fluid Silk Ribbon Trail"
        >
          <Sparkles size={13} />
          <span>Neon Ribbon</span>
        </button>
        <button
          type="button"
          className={`effect-pill-btn ${cursorEffect === 'circuit' ? 'active' : ''}`}
          onClick={() => setCursorEffect('circuit')}
          title="Cyber Circuit Matrix Traces"
        >
          <Cpu size={13} />
          <span>Circuit Web</span>
        </button>
      </div>
    </div>
  );
}
