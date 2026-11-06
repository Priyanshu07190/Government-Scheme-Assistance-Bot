'use client';

import React from 'react';

interface NavbarProps {
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  onTriggerCrawl: () => void;
  onClearChat: () => void;
  isCrawling: boolean;
  userName: string | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onOpenDocsLocker?: () => void;
  onOpenTracker?: () => void;
  docsCount?: number;
  totalDocs?: number;
}

export default function Navbar({ 
  language, 
  onLanguageChange, 
  onTriggerCrawl, 
  onClearChat, 
  isCrawling,
  userName,
  onLoginClick,
  onLogoutClick,
  onOpenDocsLocker,
  onOpenTracker,
  docsCount,
  totalDocs = 16
}: NavbarProps) {
  const isHindi = language === 'hi';
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    // Check initial theme from html attribute or localStorage or system
    const currentTheme = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ||
      (localStorage.getItem('theme') as 'light' | 'dark') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', nextTheme);
    } catch (e) {}
  };

  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon"></div>
        <h1 className="brand-name">
          {isHindi ? 'योजना सहायक बॉट' : 'GovScheme Assist'}
        </h1>
      </div>

      <div className="nav-actions">
        {/* Authentication State Display */}
        {userName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {isHindi ? `नमस्ते, ${userName}` : `Welcome, ${userName}`}
            </span>
            <button 
              onClick={onLogoutClick} 
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
            >
              {isHindi ? 'लॉगआउट' : 'Logout'}
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick} 
            className="btn btn-primary btn-sm"
          >
            {isHindi ? 'आधार लॉगिन' : 'Aadhaar Login'}
          </button>
        )}

        {/* Citizen Document Locker Trigger */}
        {onOpenDocsLocker && (
          <button
            onClick={onOpenDocsLocker}
            className="btn btn-outline btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-light)',
              fontWeight: 600,
              padding: '0.4rem 0.75rem'
            }}
            title={isHindi ? 'नागरिक दस्तावेज़ लॉकर खोलें' : 'Open Citizen Document Locker'}
          >
            <span>📁</span>
            <span>{isHindi ? 'दस्तावेज़ लॉकर' : 'Docs Locker'}</span>
            {typeof docsCount === 'number' && (
              <span style={{
                fontSize: '0.72rem',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                padding: '0.1rem 0.45rem',
                borderRadius: '10px',
                fontWeight: 700
              }}>
                {docsCount}/{totalDocs}
              </span>
            )}
          </button>
        )}

        {/* Application Status Tracker Trigger */}
        {onOpenTracker && (
          <button
            onClick={onOpenTracker}
            className="btn btn-outline btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              padding: '0.4rem 0.75rem'
            }}
            title={isHindi ? 'आवेदन स्थिति व डीबीटी ट्रैक करें' : 'Track Application Status & DBT'}
          >
            <span>🚚</span>
            <span>{isHindi ? 'आवेदन ट्रैकर' : 'Track Status'}</span>
          </button>
        )}

        {/* Web Crawler Control for Live Scheme Synchronization */}
        <button 
          onClick={onTriggerCrawl} 
          disabled={isCrawling}
          className="btn btn-outline btn-sm"
          title={isHindi ? 'नवीनतम योजनाओं को राष्ट्रीय पोर्टल्स से सिंक करें' : 'Synchronize schemes from national portals'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="14" 
            height="14" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={isCrawling ? 'animate-spin' : ''}
            style={{ animation: isCrawling ? 'spin 1.5s linear infinite' : 'none' }}
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          {isCrawling 
            ? (isHindi ? 'सिंक हो रहा है...' : 'Syncing...') 
            : (isHindi ? 'पोर्टल सिंक' : 'Sync Portal')
          }
        </button>

        {/* Clear Chat Button */}
        <button
          onClick={onClearChat}
          className="btn btn-outline btn-sm"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          title={isHindi ? 'चैट इतिहास साफ करें' : 'Clear Chat History'}
        >
          {isHindi ? 'चैट साफ करें' : 'Clear Chat'}
        </button>

        {/* Language Selector Toggle */}
        <div style={{ display: 'flex', gap: '2px', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
          <button
            onClick={() => onLanguageChange('en')}
            className={`btn btn-sm`}
            style={{ 
              backgroundColor: !isHindi ? 'var(--primary)' : 'transparent',
              color: !isHindi ? '#ffffff' : 'var(--text-secondary)',
              borderRadius: '0',
              padding: '0.4rem 0.8rem',
              fontWeight: !isHindi ? '700' : '500'
            }}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('hi')}
            className={`btn btn-sm`}
            style={{ 
              backgroundColor: isHindi ? 'var(--primary)' : 'transparent',
              color: isHindi ? '#ffffff' : 'var(--text-secondary)',
              borderRadius: '0',
              padding: '0.4rem 0.8rem',
              fontWeight: isHindi ? '700' : '500'
            }}
          >
            हिंदी
          </button>
        </div>

        {/* Dark / Light Mode Toggle Key */}
        <button
          onClick={toggleTheme}
          className="btn btn-outline btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)'
          }}
          title={theme === 'dark' ? (isHindi ? 'लाइट मोड चालू करें' : 'Switch to Light Mode') : (isHindi ? 'डार्क मोड चालू करें' : 'Switch to Dark Mode')}
          aria-label="Toggle dark/light mode"
        >
          {theme === 'dark' ? (
            <>
              {/* Sun icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="15" 
                height="15" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" fill="#f59e0b" fillOpacity="0.25" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                {isHindi ? 'लाइट' : 'Light'}
              </span>
            </>
          ) : (
            <>
              {/* Moon icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="15" 
                height="15" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="#6366f1" fillOpacity="0.25" />
              </svg>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                {isHindi ? 'डार्क' : 'Dark'}
              </span>
            </>
          )}
        </button>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </header>
  );
}
