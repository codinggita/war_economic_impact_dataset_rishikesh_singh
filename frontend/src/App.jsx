import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import { LogOut, Shield } from 'lucide-react';

function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 242, 254, 0.2)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: '500' }}>
          Loading user profile session...
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {user ? (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '80px auto' }} className="glass-panel animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Shield size={32} style={{ color: 'var(--primary)' }} />
            <h2>Session Established</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Logged in as <strong>{user.name}</strong> ({user.email}) with role: <span className="badge badge-info">{user.role}</span>.
          </p>
          <button onClick={logout} className="btn btn-secondary" style={{ display: 'inline-flex', gap: '8px' }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
