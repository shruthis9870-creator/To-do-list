import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotMsg('');

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Incorrect email or password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@taskflow.com');
    setPassword('TaskFlow123!');
    setError('');
    setForgotMsg('');

    try {
      setLoading(true);
      const res = await login('demo@taskflow.com', 'TaskFlow123!');
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Default user not yet found. Please run database/schema.sql in your Supabase SQL Editor first.');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in with demo user.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotMsg('Password reset instructions can be sent to your registered email address through Supabase Authentication.');
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px', 
                backgroundColor: 'var(--primary-subtle)', 
                display: 'grid', 
                placeContent: 'center',
                color: 'var(--primary)'
              }}>
                <CheckSquare size={26} strokeWidth={2.4} />
              </div>
            </div>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Sign in to your TaskFlow dashboard.</p>
          </div>

          {/* Quick Demo Credentials Box */}
          <div style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Default Demo Account
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Instant Access</span>
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              <strong>Email:</strong> <code>demo@taskflow.com</code><br />
              <strong>Password:</strong> <code>TaskFlow123!</code>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn btn-outline"
              style={{
                width: '100%',
                padding: '0.45rem',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                borderColor: 'var(--primary-border)',
                color: 'var(--primary)',
                marginTop: '0.25rem'
              }}
              disabled={loading}
            >
              <Sparkles size={15} />
              <span>Sign in with Demo Account</span>
            </button>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {forgotMsg && (
            <div className="alert alert-success">
              <span>{forgotMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">Password</label>
                <a 
                  href="#forgot" 
                  onClick={handleForgotPassword} 
                  style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 500 }}
                >
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  className="btn-icon"
                  style={{ position: 'absolute', right: '0.4rem', top: '50%', transform: 'translateY(-50%)' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.7rem' }}
              disabled={loading}
            >
              <LogIn size={18} />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
