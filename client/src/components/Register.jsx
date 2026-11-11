import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validator
  const validateField = (name, value, allData = formData) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!emailRegex.test(value.trim())) {
          error = 'Please enter a valid email address (e.g. user@example.com)';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== allData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (touched[name]) {
      const err = validateField(name, value, updatedData);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }

    // Re-check confirmPassword when password changes
    if (name === 'password' && touched.confirmPassword) {
      const confirmErr = validateField('confirmPassword', formData.confirmPassword, updatedData);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
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
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateAll()) {
      return;
    }

    setSubmitting(true);
    const result = await register(
      formData.name.trim(),
      formData.email.trim(),
      formData.password
    );

    if (!result.success) {
      setServerError(result.message);
    }
    setSubmitting(false);
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: 'None', color: '#94a3b8' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, text: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 2, text: 'Medium', color: '#f59e0b' };
    return { score: 3, text: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="auth-card">
      <div className="card-header">
        <div className="card-icon-bubble">
          <UserPlus size={28} />
        </div>
        <h2>Create an Account</h2>
        <p className="card-subtitle">
          Register with your email to access the system
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
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="reg-name" className="form-label">
            Full Name
          </label>
          <div className={`input-wrapper ${touched.name && errors.name ? 'has-error' : touched.name && !errors.name ? 'is-valid' : ''}`}>
            <User className="input-icon" size={18} />
            <input
              id="reg-name"
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="name"
            />
            {touched.name && !errors.name && formData.name && (
              <CheckCircle2 className="valid-icon" size={18} />
            )}
            {touched.name && errors.name && (
              <XCircle className="invalid-icon" size={18} />
            )}
          </div>
          {touched.name && errors.name && (
            <p className="error-message">{errors.name}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label htmlFor="reg-email" className="form-label">
            Email Address
          </label>
          <div className={`input-wrapper ${touched.email && errors.email ? 'has-error' : touched.email && !errors.email ? 'is-valid' : ''}`}>
            <Mail className="input-icon" size={18} />
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="e.g. john@example.com"
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
          <label htmlFor="reg-password" className="form-label">
            Password
          </label>
          <div className={`input-wrapper ${touched.password && errors.password ? 'has-error' : touched.password && !errors.password ? 'is-valid' : ''}`}>
            <Lock className="input-icon" size={18} />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="new-password"
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

          {/* Password strength indicator */}
          {formData.password && (
            <div className="strength-meter">
              <div className="strength-bars">
                <div
                  className={`bar ${strength.score >= 1 ? 'active' : ''}`}
                  style={{ backgroundColor: strength.score >= 1 ? strength.color : '' }}
                />
                <div
                  className={`bar ${strength.score >= 2 ? 'active' : ''}`}
                  style={{ backgroundColor: strength.score >= 2 ? strength.color : '' }}
                />
                <div
                  className={`bar ${strength.score >= 3 ? 'active' : ''}`}
                  style={{ backgroundColor: strength.score >= 3 ? strength.color : '' }}
                />
              </div>
              <span className="strength-text" style={{ color: strength.color }}>
                Strength: {strength.text}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="reg-confirm-password" className="form-label">
            Confirm Password
          </label>
          <div className={`input-wrapper ${touched.confirmPassword && errors.confirmPassword ? 'has-error' : touched.confirmPassword && !errors.confirmPassword ? 'is-valid' : ''}`}>
            <Lock className="input-icon" size={18} />
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
        >
          {submitting ? (
            <span className="spinner-wrapper">
              <span className="spinner" /> Creating Account...
            </span>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className="card-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="link-btn"
            onClick={onSwitchToLogin}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}
