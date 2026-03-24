import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Download, TrendingUp, Clock, Target, ChevronRight, FileX } from 'lucide-react';
import Link from 'next/link';
import { databases, Query } from '@/lib/appwrite';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [hasTakenTests, setHasTakenTests] = useState(false);
  const [dbTests, setDbTests] = useState<any[]>([]);
  const [dbSubmissions, setDbSubmissions] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      // Fetch Available Tests
      const testsRes = await databases.listDocuments('jeeify_db', 'tests');
      setDbTests(testsRes.documents);
      
      // Fetch user submissions
      const subsRes = await databases.listDocuments('jeeify_db', 'submissions', [
        Query.equal('userId', user.$id),
        Query.orderDesc('$createdAt'),
        Query.limit(5)
      ]);
      setDbSubmissions(subsRes.documents);
      setHasTakenTests(subsRes.total > 0);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoadingTests(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && user) fetchDashboardData();
  }, [user, loading, fetchDashboardData]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  // Calculate Analytics from Submissions
  const latestSub = dbSubmissions[0];
  const allSubmissions = [...dbSubmissions].reverse(); // Oldest to newest
  
  const avgAccuracy = dbSubmissions.length > 0 
    ? Math.round(dbSubmissions.reduce((acc, s) => acc + (s.score / s.totalMarks) * 100, 0) / dbSubmissions.length)
    : 0;

  const totalCorrect = dbSubmissions.reduce((acc, s) => acc + Math.max(0, Math.floor(s.score / 4)), 0);
  const totalIncorrect = dbSubmissions.reduce((acc, s) => acc + Math.max(0, Math.floor((s.totalMarks - Math.max(0, s.score)) / 4)), 0);

  // Dynamic SVG Trend
  const generateTrendPath = () => {
    if (dbSubmissions.length < 2) return "M0,150 L800,150";
    const points = allSubmissions.map((s, i) => {
      const x = (i / (allSubmissions.length - 1)) * 800;
      const ratio = s.totalMarks > 0 ? (s.score / s.totalMarks) : 0;
      const y = 180 - (Math.max(0, ratio) * 150);
      return `${x},${y}`;
    });
    return `M${points.join(' L')}`;
  };

  // Parse Subject Analysis
  const latestAnalysis = latestSub?.subjectAnalysis ? JSON.parse(latestSub.subjectAnalysis) : null;
  const subjects = latestAnalysis ? Object.keys(latestAnalysis) : ['Mathematics', 'Physics', 'Chemistry'];

  return (
    <Layout title="Aspirant Analytics | JEEify">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-left">
            <span>PERFORMANCE OVERVIEW</span>
            <h1>Welcome, {user.name.split(' ')[0]}</h1>
          </div>
          {hasTakenTests && (
            <div className="header-actions">
              <button className="btn-date">
                <Clock size={16} /> Last {dbSubmissions.length} Tests
              </button>
            </div>
          )}
        </header>

        <section className="dashboard-main-flow">
          <div className="recommended-tests">
            <div className="section-header-row">
              <h3>Available Mock Tests</h3>
              <Link href="/library" className="view-link"><span className="view-all">View Library <ChevronRight size={14} /></span></Link>
            </div>
            <div className="test-grid">
              {loadingTests ? (
                <div className="loading-placeholder">Loading Tests...</div>
              ) : dbTests.length > 0 ? (
                dbTests.slice(0, 2).map(test => (
                  <TestCard 
                    key={test.$id}
                    title={test.title}
                    subtitle={test.subtitle}
                    price={test.price}
                    status={test.status}
                    testId={test.$id}
                  />
                ))
              ) : (
                <div className="no-tests-placeholder card">
                   <p>No tests available at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {!hasTakenTests ? (
            <div className="empty-state-card card">
              <div className="empty-icon-wrapper">
                <FileX size={48} color="#94A3B8" />
              </div>
              <h2>No Performance Analytics Yet</h2>
              <p>Take your first mock test to unlock detailed insights into your accuracy, time management, and subject-wise rank predictor.</p>
              <Link href="/library" style={{ marginTop: '2rem' }} className="btn btn-primary">Go to Library</Link>
            </div>
          ) : (
            <div className="analytics-sections">
              <div className="stats-row">
                <div className="card main-chart-card">
                  <div className="card-header">
                    <h3>Score Trend</h3>
                    <p>Performance progression over recent tests</p>
                  </div>
                  <div className="chart-placeholder">
                    <svg viewBox="0 0 800 200" className="trend-svg" preserveAspectRatio="none">
                      <path d={generateTrendPath()} 
                            fill="none" stroke="var(--tertiary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      {allSubmissions.map((s, i) => {
                        const x = (i / (allSubmissions.length - 1)) * 800;
                        const y = 180 - (Math.max(0, s.score / s.totalMarks) * 150);
                        return <circle key={i} cx={x} cy={y} r="6" fill="var(--tertiary)" stroke="white" strokeWidth="2" />;
                      })}
                    </svg>
                  </div>
                </div>
                <Link href="#history" className="card accuracy-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card-header">
                    <h3>Accuracy</h3>
                    <p>Average accuracy across all tests</p>
                  </div>
                  <div className="accuracy-visual">
                    <div className="circle-progress">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#EDF2F7" strokeWidth="8" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="var(--tertiary)" strokeWidth="8" 
                                fill="none" strokeDasharray={`${avgAccuracy * 2.51}, 251`} 
                                style={{ transition: 'stroke-dasharray 0.5s ease' }} />
                      </svg>
                      <div className="circle-text">
                        <strong>{avgAccuracy}%</strong>
                        <span>Overall</span>
                      </div>
                    </div>
                  </div>
                  <div className="accuracy-stats">
                    <div className="stat-item"><strong>{totalCorrect}</strong><span>Est. Correct</span></div>
                    <div className="stat-item"><strong>{totalIncorrect}</strong><span>Est. Incorrect</span></div>
                  </div>
                </Link>
              </div>

              <div className="topic-analysis">
                <div className="card">
                  <div className="card-header">
                    <h3>Performance by Subject</h3>
                    <p>Breakdown based on your latest: {latestSub.testName}</p>
                  </div>
                  <div className="topic-grid">
                     {subjects.map(sub => {
                       const data = latestAnalysis ? latestAnalysis[sub] : { score: 0, total: 0 };
                       const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                       return (
                         <Link href={`/library?subject=${sub}`} key={sub} style={{ textDecoration: 'none' }}>
                           <TopicBlock label={sub} effort={acc > 70 ? 'low' : acc > 40 ? 'medium' : 'high'} accuracy={acc} />
                         </Link>
                       );
                     })}
                  </div>
                </div>
              </div>

              <section className="subject-breakdown">
                {subjects.map((sub, i) => {
                  const data = latestAnalysis ? latestAnalysis[sub] : null;
                  const acc = data ? Math.round((data.correct / data.total) * 100) : 0;
                  const colors = ['#3182CE', '#E53E3E', '#DD6B20'];
                  return (
                    <Link href={`/library?subject=${sub}`} key={sub} style={{ textDecoration: 'none' }}>
                      <SubjectCard 
                        name={sub} 
                        accuracy={acc || (80 - i * 15)} 
                        trend={acc > 70 ? 'rising' : acc > 40 ? 'steady' : 'falling'} 
                        color={colors[i % 3]} 
                      />
                    </Link>
                  );
                })}
              </section>

              <section className="performance-table" id="history">
                <div className="card">
                   <div className="card-header">
                     <h3>Recent Mock Performance</h3>
                   </div>
                   <table>
                     <thead>
                       <tr>
                         <th>Test Name</th>
                         <th>Score</th>
                         <th>Percentile</th>
                         <th>Date</th>
                         <th></th>
                       </tr>
                     </thead>
                     <tbody>
                       {dbSubmissions.length > 0 ? dbSubmissions.map(sub => (
                         <TableRow 
                           key={sub.$id}
                           name={sub.testName || 'Mock Test'}
                           score={`${sub.score}/${sub.totalMarks}`}
                           percentile={sub.percentile ? `${sub.percentile}%` : 'N/A'}
                           status={new Date(sub.completedAt || sub.$createdAt).toLocaleDateString()}
                         />
                       )) : (
                         <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>No recent performance data available.</td></tr>
                       )}
                     </tbody>
                   </table>
                </div>
              </section>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }
        .header-left span { font-size: 0.75rem; color: var(--secondary); letter-spacing: 0.1em; font-weight: 600; }
        .header-left h1 { font-size: 2.5rem; }
        .header-actions { display: flex; gap: 1rem; align-items: center; }
        .btn-date { 
          background: var(--surface);
          border: 1px solid var(--outline-variant);
          padding: 0.6rem 1rem; 
          border-radius: var(--radius-md); 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          font-weight: 500; 
          cursor: pointer;
        }

        .dashboard-main-flow {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .view-all { 
          font-size: 0.85rem; 
          color: var(--tertiary); 
          font-weight: 600; 
          display: flex; 
          align-items: center; 
          gap: 0.25rem; 
          cursor: pointer; 
        }

        .stats-row { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .card-header { margin-bottom: 1.5rem; }
        .card-header h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
        .card-header p { font-size: 0.85rem; color: var(--secondary); }

        .main-chart-card { height: 350px; display: flex; flex-direction: column; }
        .chart-placeholder { flex: 1; display: flex; align-items: flex-end; padding-bottom: 1rem; }
        .trend-svg { width: 100%; height: auto; }

        .accuracy-card { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .circle-progress { position: relative; width: 150px; height: 150px; margin-bottom: 1.5rem; }
        .circle-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; }
        .circle-text strong { font-size: 1.5rem; color: var(--primary); }
        .circle-text span { font-size: 0.7rem; color: var(--secondary); text-transform: uppercase; }
        .accuracy-stats { display: flex; gap: 2rem; border-top: 1px solid var(--surface-container-low); width: 100%; pt: 1rem; justify-content: center; margin-top: auto; }
        .stat-item { display: flex; flex-direction: column; }
        .stat-item strong { font-size: 1.1rem; }
        .stat-item span { font-size: 0.7rem; color: var(--secondary); }

        .topic-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; }
        
        .subject-breakdown { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3rem; }
        
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 0.75rem; color: var(--secondary); text-transform: uppercase; padding: 1rem; border-bottom: 1px solid var(--surface-container-low); }
        td { padding: 1.5rem 1rem; border-bottom: 1px solid var(--surface-container-low); font-size: 0.95rem; }

        .empty-state-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 6rem 2rem;
        }
        .empty-icon-wrapper {
          width: 96px;
          height: 96px;
          background: #F1F5F9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .empty-state-card h2 { font-size: 1.75rem; margin-bottom: 0.75rem; color: var(--primary); }
        .empty-state-card p { color: var(--secondary); max-width: 500px; line-height: 1.6; }

        .test-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .loading-placeholder, .no-tests-placeholder { grid-column: 1 / -1; min-height: 200px; display: flex; align-items: center; justify-content: center; color: var(--secondary); }

        @media (max-width: 1024px) {
          .stats-row { grid-template-columns: 1fr; }
          .topic-grid { grid-template-columns: repeat(3, 1fr); }
          .subject-breakdown { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .dashboard-container { padding: 1rem; }
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; }
          .header-left h1 { font-size: 1.75rem; }
          .header-actions { width: 100%; justify-content: space-between; gap: 0.5rem; }
          .btn-date, .header-actions .btn { flex: 1; font-size: 0.8rem; padding: 0.5rem; }
          
          .test-grid { grid-template-columns: 1fr; }
          .topic-grid { grid-template-columns: repeat(2, 1fr); }
          .subject-breakdown { grid-template-columns: 1fr; }
          
          .performance-table .card { padding: 0; overflow: hidden; }
          .performance-table { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          table { min-width: 600px; }
          
          .empty-state-card { padding: 4rem 1rem; }
          .empty-state-card h2 { font-size: 1.5rem; }
        }
      `}</style>
    </Layout>
  );
};

const TopicBlock = ({ label, effort, accuracy }: { label: string; effort: 'high' | 'medium' | 'low'; accuracy: number }) => {
  const colors = { high: '#F97316', medium: '#FB923C', low: '#BBF7D0' };
  return (
    <div className="topic-block" style={{ backgroundColor: colors[effort] }}>
      <div className="topic-content">
        <span className="topic-label">{label}</span>
        <span className="topic-acc">{accuracy}% Acc.</span>
      </div>
      <style jsx>{`
        .topic-block {
          height: 100px;
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          align-items: flex-end;
          color: ${effort === 'low' ? '#065F46' : 'white'};
          font-weight: 600;
          transition: transform 0.2s;
          cursor: pointer;
        }
        .topic-content { display: flex; flex-direction: column; gap: 0.25rem; }
        .topic-label { font-size: 0.8rem; }
        .topic-acc { font-size: 0.65rem; opacity: 0.9; }
        .topic-block:hover { transform: scale(1.05); z-index: 10; }
      `}</style>
    </div>
  );
};

const SubjectCard = ({ name, accuracy, trend, color }: any) => {
  return (
    <div className="subject-card">
      <div className="subject-info">
        <strong>{name}</strong>
        <span className={`trend ${trend}`}>{trend === 'rising' ? 'Strong' : trend === 'falling' ? 'At Risk' : 'Average'}</span>
      </div>
      <div className="subject-accuracy">
        <div className="bar-bg"><div className="bar-fill" style={{ width: `${accuracy}%`, backgroundColor: color }}></div></div>
        <span>{accuracy}% Accuracy</span>
      </div>
      <style jsx>{`
        .subject-card { 
          background: var(--surface); 
          padding: 1.5rem; 
          border-radius: var(--radius-md); 
          box-shadow: var(--shadow-ambient);
          border-left: 4px solid ${color};
        }
        .subject-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .trend { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 1rem; }
        .rising { background: #F0FFF4; color: #38A169; }
        .steady { background: #EBF8FF; color: #3182CE; }
        .falling { background: #FFF5F5; color: #E53E3E; }
        .subject-accuracy span { display: block; margin-top: 0.5rem; font-size: 0.8rem; font-weight: 500; }
        .bar-bg { width: 100%; height: 6px; background: #EDF2F7; border-radius: 3px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 3px; }
      `}</style>
    </div>
  )
}

const TableRow = ({ name, score, percentile, status }: any) => {
  return (
    <tr>
      <td style={{ fontWeight: 600 }}>{name}</td>
      <td>{score}</td>
      <td>{percentile}</td>
      <td><span className="status-tag">{status}</span></td>
      <td style={{ textAlign: 'right' }}><ChevronRight size={16} color="var(--secondary)" /></td>
      <style jsx>{`
        .status-tag { font-size: 0.65rem; font-weight: 700; color: #38A169; background: #C6F6D5; padding: 0.2rem 0.5rem; border-radius: 0.25rem; }
      `}</style>
    </tr>
  )
}

const TestCard = ({ title, subtitle, price, status, testId }: any) => {
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
          <Link href={`/test?id=${testId}`}>
            <button className="btn btn-primary buy-btn">Take Test</button>
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

export default Dashboard;
