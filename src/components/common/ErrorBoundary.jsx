import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    // Clear any stale local keys that might cause re-crash
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
      }
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F172A',
          color: '#F8FAFC',
          padding: '24px',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '480px',
            background: '#1E293B',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '36px 28px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <img src="/logo.png" alt="JanSahayak" style={{ height: '40px', width: 'auto', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 10px 0' }}>
              JanSahayak System Recovery
            </h2>
            <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              A temporary display error occurred. Click below to refresh your connection to the Delhi Municipal Grievance Gateway.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #0E5E3A 0%, #10B981 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
              }}
            >
              Refresh Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
