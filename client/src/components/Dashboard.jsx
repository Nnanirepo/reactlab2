import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../api/auth';
import {
  ShieldCheck,
  User,
  Mail,
  Calendar,
  Key,
  LogOut,
  RefreshCw,
  Database,
  CheckCircle,
} from 'lucide-react';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [apiData, setApiData] = useState(null);
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  const testAuthApi = async () => {
    setTestingEndpoint(true);
    setTestSuccess(false);
    try {
      const data = await getCurrentUser();
      setApiData(data.user);
      setTestSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setTestingEndpoint(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="badge badge-success">
            <CheckCircle size={14} />
            <span>Authenticated Session</span>
          </div>
          <h1 className="welcome-title">Welcome back, {user?.name}!</h1>
          <p className="welcome-subtitle">
            You are securely authenticated using JSON Web Tokens (JWT) and your
            record is stored in MongoDB.
          </p>
        </div>

        <button
          onClick={logout}
          className="btn btn-danger logout-btn-lg"
          title="Sign out of system"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="dashboard-grid">
        {/* User Profile Card */}
        <div className="info-card">
          <div className="card-top">
            <div className="card-top-icon">
              <User size={22} />
            </div>
            <h3>User Information</h3>
          </div>

          <div className="profile-details-list">
            <div className="detail-row">
              <span className="detail-label">
                <User size={16} /> Full Name
              </span>
              <span className="detail-value">{user?.name}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <Mail size={16} /> Email Address
              </span>
              <span className="detail-value">{user?.email}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <Database size={16} /> MongoDB User ID
              </span>
              <span className="detail-value code-font">
                {user?._id || user?.id || 'N/A'}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <Calendar size={16} /> Account Created
              </span>
              <span className="detail-value">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Security & Token Info */}
        <div className="info-card">
          <div className="card-top">
            <div className="card-top-icon security">
              <ShieldCheck size={22} />
            </div>
            <h3>Security & Token</h3>
          </div>

          <p className="card-desc">
            Your credentials are validated and securely managed:
          </p>

          <ul className="security-features-list">
            <li>
              <strong>Bcrypt Hashing:</strong> Passwords are never stored in
              plain text. Salted with 10 rounds before storing in MongoDB.
            </li>
            <li>
              <strong>JWT Authentication:</strong> Session is verified using a
              signed JWT Bearer token with expiration.
            </li>
            <li>
              <strong>Server-Side Validation:</strong> Email syntax and password
              lengths are strictly validated on both client & backend.
            </li>
          </ul>

          <div className="token-preview">
            <div className="token-preview-header">
              <Key size={14} />
              <span>JWT Bearer Token Preview</span>
            </div>
            <p className="token-text">
              {token ? `${token.substring(0, 48)}...` : 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Verification Section */}
      <div className="info-card api-tester-card">
        <div className="api-tester-header">
          <div>
            <h3>Verify Protected Route</h3>
            <p className="card-desc">
              Test request to <code>GET /api/auth/me</code> using your active JWT header.
            </p>
          </div>
          <button
            onClick={testAuthApi}
            className="btn btn-secondary"
            disabled={testingEndpoint}
          >
            <RefreshCw
              size={16}
              className={testingEndpoint ? 'spin' : ''}
            />
            <span>{testingEndpoint ? 'Verifying...' : 'Test Protected Route'}</span>
          </button>
        </div>

        {testSuccess && apiData && (
          <div className="api-response-box">
            <div className="response-status">
              <CheckCircle size={16} className="text-success" />
              <span>200 OK — Token valid and user retrieved from MongoDB!</span>
            </div>
            <pre>{JSON.stringify(apiData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
