'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Only block render when we truly have no user data yet (no cache + awaiting network)
  if (isLoading && !user) {
    return (
      <div style={{ background: 'var(--deep-navy)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '44px', height: '44px', margin: '0 auto',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--gold)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontFamily: "'Kanit', sans-serif", fontSize: '0.85rem' }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
