import React from 'react';

function App() {
  return (
    <div className="app-container">
      <header className="glass-panel" style={{ margin: '24px', padding: '24px', animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ marginBottom: '8px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          War Economic Impact Analytics Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Vite + React bootstrap completed successfully. CSS design variables, customized typography, and Axios API wrapper are registered.
        </p>
      </header>
    </div>
  );
}

export default App;
