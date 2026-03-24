import React from 'react';
import Layout from '@/components/Layout';
import { Mail, MessageCircle, HelpCircle } from 'lucide-react';

const SupportPage = () => {
  return (
    <Layout title="Support | JEEify">
      <div className="support-container">
        <header className="support-header">
          <h1>How can we <span className="accent">help?</span></h1>
          <p>Get in touch with the JEEify team for any technical or academic queries.</p>
        </header>

        <div className="support-grid">
          <div className="support-card">
            <Mail size={32} color="var(--tertiary)" />
            <h3>Email Support</h3>
            <p>For regarding test content or billing issues.</p>
            <strong>support@jeeify.com</strong>
          </div>
          <div className="support-card">
            <MessageCircle size={32} color="var(--tertiary)" />
            <h3>Telegram Support</h3>
            <p>Join our active community for instant help.</p>
            <a href="https://t.me/jeeify" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '1rem' }}>Join Telegram</a>
          </div>
          <div className="support-card">
            <HelpCircle size={32} color="var(--tertiary)" />
            <h3>FAQs</h3>
            <p>Quick answers to common questions about mock tests.</p>
            <button className="btn btn-ghost" style={{ marginTop: '1rem' }}>Read FAQs</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .support-container { max-width: 1000px; margin: 0 auto; padding: 6rem 2rem; text-align: center; }
        .support-header { margin-bottom: 4rem; }
        .support-header h1 { font-size: 3rem; margin-bottom: 1rem; }
        .accent { color: var(--tertiary); }
        .support-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .support-card { background: white; padding: 3rem 2rem; border-radius: 1.5rem; box-shadow: var(--shadow-ambient); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .support-card h3 { font-size: 1.25rem; }
        .support-card p { color: var(--secondary); font-size: 0.9rem; }
        @media (max-width: 768px) { .support-grid { grid-template-columns: 1fr; } }
      `}</style>
    </Layout>
  );
};

export default SupportPage;
