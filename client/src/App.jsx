import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5001/api/auth';

export default function App() {
  // Navigation / View State: 'login', 'register', or 'profile'
  const [view, setView] = useState('login');

  // Authenticated user state
  const [user, setUser] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Messages and UI states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already logged in (token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setView('profile');
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  // Validation function
  const validateForm = (isRegister = false) => {
    // 1. Check required fields
    if (isRegister && !name.trim()) {
      setError('Please enter your name.');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return false;
    }

    // 3. Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm(true)) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccess('Registration successful! Stored in MongoDB Atlas.');
      // Auto login user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setName('');
      setEmail('');
      setPassword('');
      setView('profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm(false)) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email: email.trim(),
        password,
      });

      setSuccess('Logged in successfully!');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setEmail('');
      setPassword('');
      setView('profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (e) {
      // ignore server logout errors
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
    setSuccess('You have been logged out.');
    setError('');
  };

  const switchTab = (tab) => {
    setView(tab);
    setError('');
    setSuccess('');
  };

  return (
    <div className="page-container">
      <div className="auth-box">
        <h1 className="page-title">User Authentication</h1>
        <p className="page-subtitle">React &bull; Node.js &bull; MongoDB Atlas</p>

        {/* Success & Error Alerts */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* LOGGED IN VIEW */}
        {view === 'profile' && user ? (
          <div className="profile-card">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2>Welcome, {user.name}!</h2>
            <div className="profile-details">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Database:</strong> MongoDB Atlas</p>
              {user.createdAt && (
                <p>
                  <strong>Joined:</strong>{' '}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <button onClick={handleLogout} className="btn btn-logout">
              Log Out
            </button>
          </div>
        ) : (
          /* NOT LOGGED IN: TABS + FORMS */
          <>
            <div className="tab-buttons">
              <button
                className={`tab-btn ${view === 'login' ? 'active' : ''}`}
                onClick={() => switchTab('login')}
              >
                Login
              </button>
              <button
                className={`tab-btn ${view === 'register' ? 'active' : ''}`}
                onClick={() => switchTab('register')}
              >
                Register
              </button>
            </div>

            {view === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="form">
                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Log In'}
                </button>

                <p className="switch-text">
                  Don't have an account?{' '}
                  <span onClick={() => switchTab('register')}>Register here</span>
                </p>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegister} className="form">
                <div className="form-group">
                  <label htmlFor="reg-name">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-email">Email Address</label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-password">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating account...' : 'Register'}
                </button>

                <p className="switch-text">
                  Already have an account?{' '}
                  <span onClick={() => switchTab('login')}>Log in here</span>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
