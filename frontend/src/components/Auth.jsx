import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, AlertCircle, Loader } from 'lucide-react';

const Auth = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [loadingState, setLoadingState] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoadingState(true);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required inputs.');
      setLoadingState(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(name, email, password, role);
      }

      if (result.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected network error occurred.');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 160px)', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(0, 242, 254, 0.1)',
            color: 'var(--primary)',
            marginBottom: '16px'
          }}>
            {isLogin ? <LogIn size={28} /> : <UserPlus size={28} />}
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            {isLogin ? 'Sign in to access aggregate statistics and CRUD controls.' : 'Sign up to register as an API researcher.'}
          </p>
        </div>

        {error && (
          <div className="alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rishi Singh"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. research@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-role">Platform Role</label>
              <select
                id="auth-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User (Read/Write Access)</option>
                <option value="admin">Admin (Read/Write/Delete Access)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loadingState}
          >
            {loadingState ? (
              <>
                <Loader size={18} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
                Authenticating...
              </>
            ) : (
              isLogin ? 'Sign In' : 'Register'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account? " : 'Already registered? '}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="btn-text"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
