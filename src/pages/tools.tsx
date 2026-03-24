import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Calculator, Map, GraduationCap, FileText, Zap, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { databases, Query } from '@/lib/appwrite';

const ToolsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [latestSubmission, setLatestSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [predictedRank, setPredictedRank] = useState<number | null>(null);
  const [predictedColleges, setPredictedColleges] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const res = await databases.listDocuments('jeeify_db', 'submissions', [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(1)
        ]);
        if (res.documents.length > 0) {
          const sub = res.documents[0];
          setLatestSubmission(sub);
          
          // Calculate Rank: (1 - P/100) * 1,200,000
          const p = sub.percentile || 95;
          const rank = Math.round((1 - p / 100) * 1200000);
          setPredictedRank(rank);

          // Predict Colleges
          const colleges = [];
          if (rank < 5000) colleges.push('IIT Bombay', 'IIT Delhi', 'IIT Madras');
          else if (rank < 15000) colleges.push('IIT Roorkee', 'IIT Kanpur', 'IIT Kharagpur');
          else if (rank < 30000) colleges.push('NIT Trichy', 'NIT Surathkal', 'BITS Pilani');
          else if (rank < 60000) colleges.push('NIT Warangal', 'DTU', 'NSUT');
          else colleges.push('Top State Govt Colleges', 'VIT', 'Manipal');
          setPredictedColleges(colleges);
        }
      } catch (error) {
        console.error('Tools data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const tools = [
    {
      title: 'AIR Rank Predictor',
      description: latestSubmission 
        ? `Based on your ${latestSubmission.percentile}%ile in ${latestSubmission.testName}.` 
        : 'Estimate your All India Rank based on your recent mock test performance.',
      icon: <Calculator size={24} color="#F97316" />,
      tag: 'CALCULATED',
      color: '#FFF7ED',
      value: predictedRank ? `~ ${predictedRank.toLocaleString()}` : null,
      action: 'Refresh Estimate'
    },
    {
      title: 'College Predictor',
      description: predictedColleges.length > 0 
        ? `Possible: ${predictedColleges.join(', ')}`
        : 'Discover which IITs, NITs, and IIITs you can get into based on your predicted rank.',
      icon: <GraduationCap size={24} color="#3B82F6" />,
      tag: 'NEW',
      color: '#EFF6FF',
      value: predictedColleges.length > 0 ? predictedColleges[0] : null,
      action: 'View All Options'
    },
    {
      title: 'Mastery Heatmap',
      description: 'A visual breakdown of your strength and weaknesses across all JEE subjects.',
      icon: <Map size={24} color="#10B981" />,
      tag: 'INSIGHT',
      color: '#ECFDF5',
      action: 'View Analysis'
    },
    {
      title: 'Formula Cheat Sheets',
      description: 'Quick-access interactive formula sheets for Physics, Chemistry, and Math.',
      icon: <FileText size={24} color="#8B5CF6" />,
      tag: 'RESOURCE',
      color: '#F5F3FF',
      action: 'Open Sheets'
    },
    {
      title: 'Speed Tracker',
      description: 'Analyze your time spent per question to optimize your exam strategy.',
      icon: <Zap size={24} color="#EAB308" />,
      tag: 'STRATEGY',
      color: '#FEFCE8',
      action: 'Track Speed'
    }
  ];

  if (authLoading) return null;

  return (
    <Layout title="Student Tools | JEEify">
      <div className="tools-container">
        {!user && (
          <div className="login-prompt card">
             <Lock size={32} color="#F97316" />
             <h2>Login Required</h2>
             <p>Please log in to access these personalized estimation and tracking tools.</p>
             <button className="tool-btn" onClick={() => window.location.href='/login'}>Sign In</button>
          </div>
        )}

        <header className="tools-header">
          <h1>Student <span className="accent">Toolkit</span></h1>
          <p>Everything you need to analyze, predict, and optimize your JEE preparation.</p>
        </header>

        <div className="tools-grid">
          {tools.map((tool, index) => (
            <div key={index} className="tool-card" style={{ background: tool.color, opacity: !user && index < 2 ? 0.6 : 1 }}>
              <div className="tool-icon-wrap">
                {tool.icon}
                <span className="tool-tag">{tool.tag}</span>
              </div>
              <h3>{tool.title}</h3>
              {tool.value && <div className="tool-value">{tool.value}</div>}
              <p>{tool.description}</p>
              <button className="tool-btn" disabled={!user && index < 2}>
                {tool.action} <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>

        <section className="coming-soon">
          <h3>More Tools Coming Soon</h3>
          <p>We're brewing more precision tools to help you ace the JEE.</p>
        </section>
      </div>

      <style jsx>{`
        .tools-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .tools-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .tools-header h1 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #0F172A;
        }
        .accent {
          color: #F97316;
        }
        .login-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          background: #FFFBEB;
          border: 1px solid #FEF3C7;
          text-align: center;
        }
        .login-prompt h2 { font-size: 1.5rem; color: #92400E; }
        .login-prompt p { color: #B45309; }
        .tool-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1E293B;
          margin-bottom: 0.5rem;
        }
        .tools-header p {
          color: #64748B;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }
        .tool-card {
          padding: 2.5rem;
          border-radius: 1.5rem;
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .tool-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .tool-icon-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 1.5rem;
        }
        .tool-tag {
          font-size: 0.65rem;
          font-weight: 800;
          background: rgba(255,255,255,0.8);
          padding: 0.25rem 0.6rem;
          border-radius: 1rem;
          color: #475569;
          letter-spacing: 0.05em;
        }
        .tool-card h3 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          color: #0F172A;
        }
        .tool-card p {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          flex: 1;
        }
        .tool-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #E2E8F0;
          padding: 0.6rem 1.25rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.85rem;
          color: #0F172A;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tool-btn:hover {
          border-color: #F97316;
          color: #F97316;
        }
        .coming-soon {
          margin-top: 6rem;
          text-align: center;
          padding: 4rem;
          background: #F8FAFC;
          border-radius: 2rem;
          border: 1px dashed #E2E8F0;
        }
        .coming-soon h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .coming-soon p {
          color: #64748B;
        }

        @media (max-width: 768px) {
          .tools-header h1 { font-size: 2.25rem; }
          .tools-grid { grid-template-columns: 1fr; }
          .tool-card { padding: 2rem; }
        }
      `}</style>
    </Layout>
  );
};

export default ToolsPage;
