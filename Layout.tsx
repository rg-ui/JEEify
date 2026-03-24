import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LayoutProps } from '@/types'; // I'll create this type file

const Layout: React.FC<LayoutProps> = ({ children, title = 'JEEify' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Master the JEE with Architectural Precision" />
      </Head>
      
      <nav className="glass sticky-top">
        <div className="nav-container">
          <div className="logo">
            <Link href="/">
              <span className="logo-text">JEEify</span>
            </Link>
          </div>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/library">Library</Link>
          </div>
          <div className="nav-actions">
            <button className="btn btn-ghost">Login</button>
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">JEEify</div>
          <div className="footer-info">
            <p>© 2026 JEEify. Precision Engineered for Aspirants.</p>
          </div>
          <div className="footer-links">
            <Link href="/support">Support</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
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
