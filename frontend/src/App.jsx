import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ConflictExplorer from './components/ConflictExplorer';

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
            {currentView === 'dashboard' && <Dashboard />}

            {currentView === 'explorer' && (
              <ConflictExplorer
                onEditConflict={(item) => console.log('Edit clicked for:', item)}
                onCreateConflict={() => console.log('Create clicked')}
              />
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
