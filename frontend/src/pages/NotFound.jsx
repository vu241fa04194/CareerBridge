import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 1.5rem', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)' }}>
      <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.5rem' }}>
        404
      </div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 2rem' }}>
        The page you are looking for doesn't exist or has been relocated in the portal.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} /> Return to Home
      </Link>
    </div>
  );
}
