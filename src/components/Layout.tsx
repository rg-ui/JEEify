import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LayoutProps } from '@/types'; 
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import Logo from './Logo';
import AdBanner from './AdBanner';

console.log("Checking Layout imports:", { Head, Link, LogOut });

const Layout: React.FC<LayoutProps> = ({ children, title = 'JEEify' }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Master the JEE with Architectural Precision" />
      </Head>
      
      <nav className="glass sticky-top">
        <div className="nav-container">
          <div className="logo">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Logo height={32} />
            </Link>
          </div>
          <div className="nav-links desktop-only">
            <Link href="/">Home</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/library">Library</Link>
          </div>
          <div className="nav-actions desktop-only">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
                <button className="btn btn-ghost" onClick={logout} style={{ padding: '0.5rem' }} title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost" style={{ textDecoration: 'none' }}>Login</Link>
                <Link href="/signup" className="btn btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
              </>
            )}
          </div>
          <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span><span></span><span></span>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu glass">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/tools" onClick={() => setIsMenuOpen(false)}>Tools</Link>
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link href="/library" onClick={() => setIsMenuOpen(false)}>Library</Link>
            {user ? (
              <button className="btn btn-ghost" onClick={() => { logout(); setIsMenuOpen(false); }} style={{ textAlign: 'left', padding: '1rem 0' }}>
                Logout ({user.name})
              </button>
            ) : (
              <div className="mobile-actions">
                <Link href="/login" className="btn btn-ghost" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link href="/signup" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <AdBanner />
      <main>{children}</main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">JEEify</div>
          <div className="footer-info">
            <p>© 2026 JEEify. Precision Engineered for Aspirants.</p>
          </div>
          <div className="footer-links">
            <Link href="/tools">Tools</Link>
            <Link href="/support">Support</Link>
            <Link href="/legal">Terms</Link>
            <Link href="/legal">Privacy</Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .sticky-top {
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid var(--outline-variant);
        }
        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
        }
        .logo-text {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-links :global(a) {
          text-decoration: none;
          color: var(--secondary);
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .nav-links :global(a:hover) {
          color: var(--primary);
        }
        .nav-actions {
          display: flex;
          gap: 1rem;
        }

        .mobile-menu-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; }
        .hamburger { width: 24px; height: 18px; position: relative; display: flex; flex-direction: column; justify-content: space-between; }
        .hamburger span { display: block; height: 2px; width: 100%; background: var(--primary); border-radius: 2px; transition: all 0.3s; }
        .hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        .mobile-menu { position: absolute; top: 100%; left: 0; width: 100%; background: var(--surface); flex-direction: column; padding: 2rem; border-bottom: 1px solid var(--outline-variant); z-index: 999; display: flex; gap: 1.5rem; }
        .mobile-menu :global(a) { text-decoration: none; color: var(--primary); font-weight: 600; font-size: 1.1rem; }
        .mobile-actions { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-menu-toggle { display: block; }
          .nav-container { padding: 1rem; }
          .footer-container { flex-direction: column; gap: 2rem; text-align: center; }
          .footer-links { flex-direction: column; gap: 1rem; }
        }

        .footer {
          margin-top: var(--spacing-12);
          border-top: 1px solid var(--outline-variant);
          padding: 3rem 2rem;
          color: var(--secondary);
        }
        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-logo {
          font-weight: 700;
          color: var(--primary);
        }
        .footer-links {
          display: flex;
          gap: 1.5rem;
        }
        .footer-links :global(a) {
          text-decoration: none;
          color: var(--secondary);
          font-size: 0.85rem;
        }
      `}</style>
    </>
  );
};

export default Layout;
