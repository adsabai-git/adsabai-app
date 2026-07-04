'use client';

import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LangContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const { user, logout, isLoading } = useAuth();
  const { lang, toggleLang, t } = useLang();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('adSabaiTheme');
    setIsDark(saved === 'dark');
  }, []);

  function toggleTheme() {
    const html = document.documentElement;
    const currentlyLight = html.getAttribute('data-theme') === 'light';
    if (currentlyLight) {
      html.removeAttribute('data-theme');
      localStorage.setItem('adSabaiTheme', 'dark');
      setIsDark(true);
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('adSabaiTheme', 'light');
      setIsDark(false);
    }
  }

  const logoStyle: React.CSSProperties = {
    textDecoration: 'none',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px', height: '40px',
    background: 'var(--gold)',
    color: 'var(--deep-navy)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Kanit', sans-serif",
    fontWeight: 700, fontSize: '1rem',
    flexShrink: 0,
  };

  const toggleBtnStyle: React.CSSProperties = {
    background: 'none',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: '1rem',
    width: '44px', height: '44px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    transition: 'border-color .2s, color .2s',
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 102,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 1rem',
      display: 'flex', alignItems: 'center',
      height: '52px',
    }}>
      {/* Logo — always anchored to the left, never moves */}
      <Link href="/" style={logoStyle}>
        <img src="/AdSabai_Logo_Vector.svg" alt="AdSabai" height="28" style={{ display: 'block' }} />
      </Link>

      {/* Right-side group — pushed to far right with margin-left:auto */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

        {/* Desktop auth — CSS class hides on mobile */}
        <div className="nav-auth-desktop" style={{ gap: '1.5rem' }}>
          {!isLoading && (
            user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={avatarStyle}>{user.name.charAt(0).toUpperCase()}</div>
                  <Link href="/account" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', textDecoration: 'none' }}>
                    {user.name}
                  </Link>
                </div>
                <button
                  onClick={logout}
                  style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--thai-red)'; e.currentTarget.style.color = 'var(--thai-red)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  {t('nav_logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {t('nav_login')}
                </Link>
                <Link href="/auth/register" className="thai-btn" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block' }}>
                  {t('nav_register')}
                </Link>
              </>
            )
          )}
        </div>

        {/* Lang toggle — always visible */}
        <button
          onClick={toggleLang}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: '0.7rem',
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 700,
            letterSpacing: '0.5px',
            height: '34px',
            padding: '0 0.55rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border-color .2s, color .2s, background .2s',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
          title={lang === 'en' ? 'Switch to Thai' : 'Switch to English'}
          aria-label="Toggle language"
        >
          {lang === 'en' ? 'TH' : 'EN'}
        </button>

        {/* Theme toggle — always visible */}
        <button
          onClick={toggleTheme}
          style={toggleBtnStyle}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDark ? '🌙' : '☀️'}
        </button>

        {/* Mobile auth — CSS class hides on desktop */}
        <div className="nav-auth-mobile">
          {!isLoading && (
            user ? (
              <>
                <Link href="/account" style={{ textDecoration: 'none' }}>
                  <div style={avatarStyle}>{user.name.charAt(0).toUpperCase()}</div>
                </Link>
                <button
                  onClick={logout}
                  style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.6rem 0.85rem', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {t('nav_logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                  {t('nav_login')}
                </Link>
                <Link href="/auth/register" className="thai-btn" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block' }}>
                  {t('nav_register')}
                </Link>
              </>
            )
          )}
        </div>

      </div>
    </nav>
  );
}
