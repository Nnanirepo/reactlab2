import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => !user && setActiveTab('login')}>
          <div className="brand-icon">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="brand-title">AuthVault</span>
            <span className="brand-subtitle">MERN Authentication System</span>
          </div>
        </div>

        <nav className="navbar-actions">
          {user ? (
            <div className="user-profile-badge">
              <div className="user-avatar">
                <UserIcon size={16} />
              </div>
              <div className="user-info-text">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm logout-btn"
                title="Log out from your account"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="nav-tabs">
              <button
                className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button
                className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Create Account
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
