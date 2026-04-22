'use client';

import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#faf7f2' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 72, height: 72, borderRadius: 16, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <WifiOff style={{ width: 32, height: 32, color: '#9ca3af' }} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 8 }}>You&apos;re Offline</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
          It looks like you&apos;ve lost your internet connection. Some features may be unavailable until you reconnect.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#0271BC,#1E90FF)', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw style={{ width: 16, height: 16 }} />
          Try Again
        </button>
      </div>
    </div>
  );
}
