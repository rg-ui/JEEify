import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import { ChevronRight, Play, Star, BookOpen, Users } from 'lucide-react';
import Logo from '@/components/Logo';

const students = [
  { name: 'Aryan Sharma', percentile: 99.94, m: 99.1, a: 99.8, b: 99.9, destination: 'IIT Bombay' },
  { name: 'Isha Patra', percentile: 99.85, m: 99.4, a: 99.2, b: 99.7, destination: 'IIT Delhi' },
  { name: 'Kabir Singh', percentile: 99.91, m: 99.7, a: 99.5, b: 99.8, destination: 'IIT Madras' }
];

const InteractiveSuccessCard = () => {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(90.00);
  const student = students[idx];

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % students.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCount(90.00);
    const target = student.percentile;
    const duration = 1000;
    const step = (target - 90.00) / (duration / 16);
    
    let current = 90.00;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [idx]);

  return (
    <div className="interactive-card">
      <div className="card-glow"></div>
      <div className="card-header">
        <div className="header-meta">
          <span>TOP PERFORMANCE</span>
          <div className="live-pill"><span></span> LIVE</div>
        </div>
        <strong>{student.name}</strong>
      </div>
      <div className="card-body">
        <div className="percent-wrap">
          <span className="percentile">{count.toFixed(2)}</span>
          <span className="label">PERCENTILE</span>
        </div>
        <div className="destination-badge">{student.destination}</div>
      </div>
      <div className="card-footer">
        <div className="mini-stat"><span>JEE M</span><strong>{student.m}</strong></div>
        <div className="mini-stat"><span>JEE A</span><strong>{student.a}</strong></div>
        <div className="mini-stat"><span>BITSAT</span><strong>{student.b}</strong></div>
      </div>
      <style jsx>{`
        .interactive-card {
           background: rgba(255, 255, 255, 0.75);
           backdrop-filter: blur(25px) saturate(180%);
           -webkit-backdrop-filter: blur(25px) saturate(180%);
           padding: 2.5rem;
           border-radius: 2.5rem;
           box-shadow: 
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05),
            inset 0 0 0 1px rgba(255, 255, 255, 0.5);
           width: 380px;
           position: relative;
           overflow: hidden;
           transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
           animation: float 6s ease-in-out infinite;
           transform-style: preserve-3d;
           perspective: 1000px;
        }
        .interactive-card:hover {
          transform: translateY(-15px) rotateX(4deg) rotateY(-4deg);
          box-shadow: 
            0 30px 60px -12px rgba(251, 146, 60, 0.25),
            0 18px 36px -18px rgba(0, 0, 0, 0.3);
          border-color: rgba(251, 146, 60, 0.5);
        }
        .card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(251, 146, 60, 0.15) 0%, transparent 60%);
          animation: rotateGlow 12s linear infinite;
          pointer-events: none;
        }
        @keyframes rotateGlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        .card-header { position: relative; z-index: 1; margin-bottom: 2rem; text-align: left; }
        .header-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
        .header-meta span { font-size: 0.75rem; font-weight: 800; color: #64748B; letter-spacing: 0.15em; }
        .live-pill { 
          display: flex; align-items: center; gap: 0.5rem; 
          background: #FEF2F2; color: #EF4444; font-size: 0.65rem; font-weight: 900;
          padding: 0.25rem 0.75rem; border-radius: 2rem; border: 1px solid #FEE2E2;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);
        }
        .live-pill span { 
          width: 8px; height: 8px; background: #EF4444; border-radius: 50%; 
          box-shadow: 0 0 8px #EF4444;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; filter: blur(0px); }
          50% { transform: scale(1.8); opacity: 0.4; filter: blur(2px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0px); }
        }
        .card-header strong { font-size: 1.75rem; font-weight: 900; color: #1E293B; display: block; letter-spacing: -0.02em; }
        
        .card-body { position: relative; z-index: 1; margin-bottom: 2.5rem; text-align: center; }
        .percent-wrap { display: flex; flex-direction: column; align-items: center; }
        .percentile { 
          font-size: 5.5rem; font-weight: 900; color: #F59E0B; line-height: 1; 
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 10px 10px rgba(245, 158, 11, 0.2));
        }
        .label { font-size: 0.85rem; font-weight: 800; color: #64748B; letter-spacing: 0.25em; margin-top: 0.5rem; }
        .destination-badge {
          display: inline-block; margin-top: 1.5rem; background: #FFF7ED; color: #C2410C;
          font-size: 0.8rem; font-weight: 800; padding: 0.5rem 1.5rem; border-radius: 2rem;
          border: 1px solid #FFEDD5; box-shadow: 0 4px 15px rgba(251, 146, 60, 0.15);
          transform: translateZ(20px);
        }
        
        .card-footer { 
          position: relative; z-index: 1; display: flex; justify-content: space-between; 
          padding-top: 1.5rem; border-top: 2px dashed rgba(226, 232, 240, 0.8);
        }
        .mini-stat { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
        .mini-stat span { font-size: 0.65rem; font-weight: 800; color: #94A3B8; letter-spacing: 0.05em; }
        .mini-stat strong { font-size: 1.1rem; font-weight: 900; color: #334155; }
      `}</style>
    </div>
  );
};

const LandingPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleStart = () => {
    if (user) router.push('/dashboard');
    else router.push('/signup');
  };

  return (
    <Layout>
      <Head>
        <title>JEEify | NTA Pattern Mock Tests & Analytics</title>
        <meta name="description" content="Prepare for JEE Main & Advanced with professional, NTA-style mock tests and deep performance analytics." />
      </Head>

      <div className="hero-section">
        <div className="hero-content">
          <div className="badge">
            <Logo height={16} />
            <span style={{ marginLeft: '-0.25rem' }}>2026 Admissions Open</span>
          </div>
          <h1>
            Master the JEE with <br />
            <span className="accent-text">Architectural Precision.</span>
          </h1>
          <p className="hero-subtitle">
            Tired of practicing with static Telegram PDFs? Transform those mock tests into real, NTA-style interactive exams with deep backend analytics.
          </p>
          <div className="hero-actions">
            <button className="btn btn-cta" onClick={handleStart}>
              {user ? 'Go to Dashboard' : 'Start Free Trial'}
            </button>
            <Link href="/library" className="btn btn-ghost" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              Explore Mock Tests <ChevronRight size={18} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <InteractiveSuccessCard />
        </div>
      </div>

      <section className="value-proposition">
        <div className="section-container">
          <div className="value-header">
            <span>THE JEEIFY ADVANTAGE</span>
            <h2>Stop Practicing with <span className="highlight">Static PDFs</span></h2>
            <p>We take those high-quality mock tests shared on Telegram and turn them into a professional testing environment.</p>
          </div>
          
          <div className="comparison-grid">
            <div className="comp-card pdf-card">
              <div className="card-lbl">Traditional Way</div>
              <h4>Static PDF Practice</h4>
              <ul>
                <li>❌ Manual Timer Management</li>
                <li>❌ No Instant Answer Checking</li>
                <li>❌ No Error Tracking</li>
                <li>❌ Hard to Simulate Pressure</li>
              </ul>
            </div>
            
            <div className="comp-card jeeify-card">
              <div className="card-lbl accent">The JEEify Way</div>
              <h4>Interactive Test Engine</h4>
              <ul>
                <li>✅ Auto-Timer & NTA Interface</li>
                <li>✅ Instant Marks & Percentile</li>
                <li>✅ Detailed Performance Analysis</li>
                <li>✅ Subject-wise Rank Predictor</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="active-tests">
        <div className="section-header">
          <h2>Active Mock Tests</h2>
          <p>Practice with real exam pattern problems. Updated for the 2026 JEE session syllabus.</p>
        </div>
        <div className="test-grid">
          <TestCard 
            title="JEE MAIN Full Mock - 11"
            subtitle="3 Hours | 75 Questions | NTA Pattern"
            price="₹10"
            status="LIVE NOW"
            link="/library"
          />
          <TestCard 
            title="Physics High-Yield Pack"
            subtitle="Formula Tests + 10 Questions + Advanced level"
            price="₹10"
            status="UPCOMING"
            link="/library"
          />
          <TestCard 
            title="Maths Formula Mastery"
            subtitle="Rapid Fire | Core Algebra Mock"
            price="₹10"
            status="COMPLETED"
            link="/library"
          />
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-content">
          <h2>Your Journey to an <span className="highlight-orange">IIT Seat</span> Starts Here.</h2>
          <p>Join 50,000+ students who trust JEEify's precision analytics and mock tests to sharpen their competitive edge.</p>
          <div className="banner-actions">
            <Link href="/library" className="btn btn-cta" style={{ textDecoration: 'none' }}>START ALL TESTS</Link>
            <a href="https://t.me/jeeify" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} /> JOIN COMMUNITY
            </a>
          </div>
        </div>
        <div className="cta-visual">
           {/* Image placeholder */}
           <div className="code-window">
             <div className="dots"><span></span><span></span><span></span></div>
             <pre><code>{`function solveJEE() {
  const precision = 1.0;
  const hardWork = Infinity;
  return success;
}`}</code></pre>
           </div>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          padding: var(--spacing-12) 2rem;
          align-items: center;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--surface-container-high);
          padding: 0.4rem 0.8rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary);
          width: fit-content;
        }
        .accent-text {
          color: var(--tertiary);
        }
        h1 {
          font-size: 3.5rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--secondary);
          max-width: 500px;
        }
        .hero-visual {
          position: relative;
          height: 450px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .active-tests {
          max-width: 1280px;
          margin: 4rem auto;
          padding: 0 2rem;
        }
        .section-header { margin-bottom: 3rem; }
        .section-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
        .section-header p { color: var(--secondary); }

        .test-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .cta-banner {
          max-width: 1280px;
          margin: 6rem auto;
          background: var(--primary);
          border-radius: var(--radius-xl);
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          overflow: hidden;
          padding: 4rem;
          color: white;
          gap: 2rem;
        }
        .cta-content h2 { color: white; font-size: 2.5rem; margin-bottom: 1.5rem; }
        .highlight-orange { color: var(--tertiary); }
        .cta-content p { color: #A0AEC0; font-size: 1.1rem; margin-bottom: 2rem; }
        .banner-actions { display: flex; gap: 1rem; }
        .code-window { background: #1A202C; border-radius: 0.5rem; padding: 1.5rem; font-family: monospace; border: 1px solid #2D3748; }
        .dots { display: flex; gap: 0.4rem; margin-bottom: 1rem; }
        .dots span { width: 8px; height: 8px; border-radius: 50%; display: block; }
        .dots span:nth-child(1) { background: #FF5F56; }
        .dots span:nth-child(2) { background: #FFBD2E; }
        .dots span:nth-child(3) { background: #27C93F; }

        .value-proposition { background: #F8FAFC; padding: 6rem 2rem; border-top: 1px solid var(--outline-variant); }
        .section-container { max-width: 1280px; margin: 0 auto; text-align: center; }
        .value-header { margin-bottom: 4rem; }
        .value-header span { color: var(--tertiary); font-weight: 700; font-size: 0.8rem; letter-spacing: 0.1em; }
        .value-header h2 { font-size: 2.5rem; margin: 1rem 0; }
        .value-header .highlight { color: #94A3B8; text-decoration: line-through; }
        .value-header p { color: var(--secondary); max-width: 700px; margin: 0 auto; }

        .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-top: 2rem; }
        .comp-card { background: white; padding: 3rem; border-radius: 1.5rem; text-align: left; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
        .comp-card h4 { font-size: 1.5rem; margin-bottom: 2rem; }
        .comp-card ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1.25rem; }
        .comp-card li { font-weight: 500; color: #475569; }
        .card-lbl { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1rem; color: #94A3B8; }
        .card-lbl.accent { color: var(--tertiary); }
        .jeeify-card { border: 2px solid var(--tertiary); background: #FFFBEB; }

        @media (max-width: 968px) {
          .hero-section { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
          .hero-content { align-items: center; }
          .hero-subtitle { margin: 0 auto; }
          h1 { font-size: 2.5rem; }
          .hero-visual { height: auto; margin-top: 2rem; }
          .test-grid { grid-template-columns: 1fr; }
          .cta-banner { grid-template-columns: 1fr; padding: 2rem; text-align: center; }
          .banner-actions { justify-content: center; }
          .comparison-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          h1 { font-size: 2rem; }
          .hero-actions { flex-direction: column; width: 100%; }
          .hero-actions .btn { width: 100%; }
          .banner-actions { flex-direction: column; }
        }
      `}</style>
    </Layout>
  );
};

const TestCard = ({ title, subtitle, price, status, link }: any) => {
  return (
    <div className="test-card">
      <div className="card-top">
         <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
      </div>
      <div className="card-info">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <div className="card-price">
          <strong>{price}</strong>
          <Link href={link || '/library'} className="btn btn-primary buy-btn" style={{ textDecoration: 'none' }}>
            {status === 'LIVE NOW' ? 'Start Now' : 'Details'}
          </Link>
        </div>
      </div>
      <style jsx>{`
        .test-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-ambient);
          transition: transform 0.3s ease;
        }
        .test-card:hover { transform: translateY(-8px); }
        .card-top { margin-bottom: 1rem; }
        .status-badge { font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 1rem; }
        .live-now { background: #EBF8FF; color: #2B6CB0; border: 1px solid #BEE3F8; }
        .upcoming { background: #FEFCBF; color: #B7791F; border: 1px solid #FAF089; }
        .completed { background: #F0FFF4; color: #2F855A; border: 1px solid #C6F6D5; }
        h3 { font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--primary); }
        p { font-size: 0.85rem; color: var(--secondary); margin-bottom: 1.5rem; }
        .card-price { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--surface-container-low); padding-top: 1rem; }
        .card-price strong { font-size: 1.25rem; color: var(--primary); }
        .buy-btn { font-size: 0.8rem; padding: 0.5rem 1rem; }
      `}</style>
    </div>
  )
}

export default LandingPage;
