import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password);
        navigate('/dashboard');
      } else {
        await signUp(form.email, form.password, form.fullName);
        setSuccess('Account created! Check your email to confirm, then log in.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-logo">
            <BrainCircuit size={28} />
          </div>
          <span>StudyAI</span>
        </div>
        <div className="auth-tagline">
          <h2>Study smarter,<br />not harder.</h2>
          <p>Let AI build your perfect study schedule, track your progress, and keep you on target for every exam.</p>
        </div>
        <div className="auth-features">
          {['AI-generated study schedules', 'Progress tracking dashboard', 'Smart calendar planning', 'Daily task management'].map((f) => (
            <div key={f} className="auth-feature-item">
              <div className="feature-dot" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <div className="auth-card">
          <div className="auth-toggle">
            <button
              className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >Log In</button>
            <button
              className={`toggle-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >Sign Up</button>
          </div>

          <h3 className="auth-heading">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h3>
          <p className="auth-subheading">
            {mode === 'login'
              ? 'Sign in to continue your study session.'
              : 'Start your AI-powered study journey today.'}
          </p>

          {success && <div className="auth-alert success">{success}</div>}
          {error   && <div className="auth-alert error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  className="form-control"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-password-wrap">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPass((p) => !p)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full auth-submit"
              disabled={loading}
            >
              {loading ? <Loader size={18} className="spin" /> : null}
              {loading
                ? 'Please wait...'
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
