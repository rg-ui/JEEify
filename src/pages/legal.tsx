import React from 'react';
import Layout from '@/components/Layout';

const LegalPage = () => {
  return (
    <Layout title="Legal | JEEify">
      <div className="legal-container">
        <header className="legal-header">
          <h1>Terms & <span className="accent">Privacy Policy</span></h1>
          <p>Last Updated: March 2026</p>
        </header>

        <section className="legal-content">
          <div className="card">
            <h2>1. Terms of Service</h2>
            <p>By using JEEify, you agree to follow the rules and regulations for mock test integrity. Sharing of test IDs or unauthorized distribution of platform content is strictly prohibited.</p>
            
            <h2>2. Privacy Policy</h2>
            <p>Your performance data (scores, analysis) is used solely to provide personal feedback and improve our prediction algorithms. We do not sell your personal information to third parties.</p>

            <h2>3. Refund Policy</h2>
            <p>Due to the digital nature of mock tests (₹10 entry fee), refunds are generally not provided unless there is a confirmed technical failure during the test session.</p>
          </div>
        </section>
      </div>
      <style jsx>{`
        .legal-container { max-width: 800px; margin: 0 auto; padding: 6rem 2rem; }
        .legal-header { margin-bottom: 4rem; text-align: center; }
        .legal-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .accent { color: var(--tertiary); }
        .legal-content .card { background: white; padding: 4rem; border-radius: 1.5rem; box-shadow: var(--shadow-ambient); }
        h2 { font-size: 1.5rem; margin: 2.5rem 0 1rem; color: var(--primary); }
        p { color: var(--secondary); line-height: 1.8; font-size: 1rem; }
        @media (max-width: 640px) { .legal-content .card { padding: 2rem; } }
      `}</style>
    </Layout>
  );
};

export default LegalPage;
