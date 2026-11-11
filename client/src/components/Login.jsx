import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';
import { Mail, Lock, Eye, EyeOff, LogIn, CheckCircle2, XCircle } from 'lucide-react';

export default function Login({ onSwitchToRegister }) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email address is required';
      } else if (!emailRegex.test(value.trim())) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long';
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateAll()) {
      return;
    }

    setSubmitting(true);
    const result = await login(formData.email.trim(), formData.password);

    if (!result.success) {
      setServerError(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-card">
      <div className="card-header">
        <div className="card-icon-bubble">
          <LogIn size={28} />
        </div>
        <h2>Welcome Back</h2>
        <p className="card-subtitle">
          Sign in with your email and password to continue
        </p>
      </div>

      {serverError && (
        <Alert
          type="error"
          message={serverError}
          onClose={() => setServerError(null)}
        />
      )}

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        {/* Email Address */}
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            Email Address
          </label>
          <div
            className={`input-wrapper ${
              touched.email && errors.email
                ? 'has-error'
                : touched.email && !errors.email
                ? 'is-valid'
                : ''
            }`}
          >
            <Mail className="input-icon" size={18} />
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="e.g. user@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="email"
            />
            {touched.email && !errors.email && formData.email && (
              <CheckCircle2 className="valid-icon" size={18} />
            )}
            {touched.email && errors.email && (
              <XCircle className="invalid-icon" size={18} />
            )}
          </div>
          {touched.email && errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="login-password" className="form-label">
            Password
          </label>
          <div
            className={`input-wrapper ${
              touched.password && errors.password
                ? 'has-error'
                : touched.password && !errors.password
                ? 'is-valid'
                : ''
            }`}
          >
            <Lock className="input-icon" size={18} />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
        >
          {submitting ? (
            <span className="spinner-wrapper">
              <span className="spinner" /> Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="card-footer">
        <p>
          Don't have an account yet?{' '}
          <button
            type="button"
            className="link-btn"
            onClick={onSwitchToRegister}
          >
            Create one now
          </button>
        </p>
      </div>
    </div>
  );
}
