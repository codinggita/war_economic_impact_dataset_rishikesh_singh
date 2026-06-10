import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Auth from './components/Auth';

function AppContent() {
  const { loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  // Handle switching views
  const handleViewChange = (view) => {
    setCurrentView(view);
    setShowAuthModal(false);
  };

  return (
    <div className="app-container">
      {/* Central Navigation Header */}
      <Navbar
        currentView={showAuthModal ? 'auth' : currentView}
        onViewChange={handleViewChange}
        onAuthTrigger={() => setShowAuthModal(true)}
      />

      <main className="main-content">
        {showAuthModal ? (
          <Auth onSuccess={() => setShowAuthModal(false)} />
        ) : (
          <div className="animate-fade-in">
            {currentView === 'dashboard' && (
              <div className="glass-panel" style={{ padding: '32px' }}>
                <h2 style={{ marginBottom: '12px' }}>Research Analytics Dashboard</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  This dashboard will display interactive charts, macroeconomic variables, and extreme war-cost datasets.
                </p>
                <div style={{
                  marginTop: '24px',
                  height: '200px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '8px'
                }} className="flex-center">
                  <span style={{ color: 'var(--text-muted)' }}>Dashboard metrics are placeholder. Pending PR #26 integration.</span>
                </div>
              </div>
            )}

            {currentView === 'explorer' && (
              <div className="glass-panel" style={{ padding: '32px' }}>
                <h2 style={{ marginBottom: '12px' }}>Conflict Registry Explorer</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  This grid will support real-time regex searching, multi-field filtering, sorting whitelist configurations, and data pagination.
                </p>
                <div style={{
                  marginTop: '24px',
                  height: '200px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '8px'
                }} className="flex-center">
                  <span style={{ color: 'var(--text-muted)' }}>Conflict explorer data table is placeholder. Pending PR #27 integration.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
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
