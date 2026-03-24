import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, Play, Clock, Eye, Filter, ChevronRight, FileText, Video as VideoIcon, BookOpen, Star } from 'lucide-react';
import { databases } from '@/lib/appwrite';

const UnifiedLibrary = () => {
  const router = useRouter();
  const { subject } = router.query;
  
  const [videos, setVideos] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<'tests' | 'videos'>('tests');
  const [activeSubject, setActiveSubject] = useState('All');

  useEffect(() => {
    if (subject && typeof subject === 'string') {
      setActiveSubject(subject);
    }
  }, [subject]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [videoRes, testRes] = await Promise.all([
          databases.listDocuments('jeeify_db', 'videos'),
          databases.listDocuments('jeeify_db', 'tests')
        ]);
        setVideos(videoRes.documents);
        setTests(testRes.documents);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTests = tests.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = activeSubject === 'All' || t.title.toLowerCase().includes(activeSubject.toLowerCase()) || (t.type && t.type === activeSubject.toUpperCase());
    return matchesSearch && matchesSubject;
  });

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = activeSubject === 'All' || v.subject === activeSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'PYQ', 'Strategy'];

  return (
    <Layout title="JEEify Library | Best Mock Tests & Video Lessons">
      <div className="library-container">
        <header className="library-header">
          <div className="header-top">
            <div className="title-area">
              <span>EXPLORE & PREPARE</span>
              <h1>JEEify Library</h1>
              <p>Curated mock tests and masterclasses precision-engineered for the JEE 2026/27 attempt.</p>
            </div>
            <div className="search-bar">
              <Search size={18} color="#94A3B8" />
              <input 
                type="text" 
                placeholder={`Search ${activeType}...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="type-toggle">
            <button className={`type-btn ${activeType === 'tests' ? 'active' : ''}`} onClick={() => setActiveType('tests')}>
              <FileText size={18} /> Mock Tests
            </button>
            <button className={`type-btn ${activeType === 'videos' ? 'active' : ''}`} onClick={() => setActiveType('videos')}>
              <VideoIcon size={18} /> Video Lessons
            </button>
          </div>

          <div className="filter-tabs">
            {subjects.map(sub => (
              <button 
                key={sub} 
                className={`tab ${activeSubject === sub ? 'active' : ''}`}
                onClick={() => setActiveSubject(sub)}
              >
                {sub}
              </button>
            ))}
            <div className="filter-icon"><Filter size={18} /></div>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="loader" />
            <p>Syncing Library Data...</p>
          </div>
        ) : (
          <div className="library-content">
            {activeType === 'tests' ? (
              <div className="test-grid">
                {filteredTests.length > 0 ? filteredTests.map(test => (
                  <TestLibraryCard 
                    key={test.$id}
                    title={test.title}
                    subtitle={test.subtitle}
                    price={test.price}
                    status={test.status}
                    testId={test.$id}
                    type={test.type}
                  />
                )) : (
                  <div className="empty-state card">
                    <p>No mock tests found for this selection.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="video-grid">
                {filteredVideos.length > 0 ? filteredVideos.map((video, idx) => (
                  <VideoCard 
                    key={video.$id}
                    title={video.title}
                    views={Math.floor(Math.random() * 5000) + 100}
                    duration="45:00" 
                    url={video.url}
                    gradient={`linear-gradient(135deg, ${['#1e3a8a', '#064e3b', '#4c1d95', '#7c2d12', '#0f172a'][idx % 5]} 0%, #1e293b 100%)`} 
                  />
                )) : (
                  <div className="empty-state card">
                    <p>No video lessons found for this selection.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .library-container { max-width: 1280px; margin: 0 auto; padding: 2rem; min-height: 80vh; }
        .library-header { margin-bottom: 3rem; }
        .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .title-area span { font-size: 0.75rem; color: var(--tertiary); letter-spacing: 0.15em; font-weight: 700; }
        .title-area h1 { font-size: 2.75rem; margin-bottom: 0.5rem; color: #0F172A; }
        .title-area p { color: #64748B; max-width: 600px; font-size: 1.1rem; }
        
        .search-bar { background: white; border: 1.5px solid #E2E8F0; padding: 0.75rem 1.25rem; border-radius: 2rem; display: flex; align-items: center; gap: 0.75rem; width: 350px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .search-bar input { border: none; outline: none; font-size: 0.95rem; width: 100%; background: transparent; }
        
        .type-toggle { display: flex; gap: 1rem; margin-bottom: 2rem; background: #EDF2F7; padding: 0.4rem; border-radius: 0.75rem; width: fit-content; }
        .type-btn { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1.25rem; border-radius: 0.5rem; border: none; font-weight: 600; cursor: pointer; color: #64748B; transition: all 0.2s; background: transparent; }
        .type-btn.active { background: white; color: var(--primary); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        
        .filter-tabs { display: flex; gap: 1rem; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.5rem; }
        .tab { background: transparent; border: none; font-size: 0.95rem; font-weight: 500; color: #64748B; cursor: pointer; padding: 0.75rem 1.25rem; position: relative; }
        .tab.active { color: var(--tertiary); font-weight: 700; }
        .tab.active::after { content: ''; position: absolute; bottom: -0.5rem; left: 0; width: 100%; height: 3px; background: var(--tertiary); border-radius: 10px; }
        .filter-icon { margin-left: auto; color: #64748B; cursor: pointer; }

        .test-grid, .video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem; gap: 1.5rem; }
        .loader { width: 40px; height: 40px; border: 3px solid rgba(249,115,22,0.1); border-top-color: var(--tertiary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .empty-state { grid-column: 1 / -1; padding: 5rem; text-align: center; color: #94A3B8; background: white; border-radius: 1rem; border: 2px dashed #E2E8F0; }

        @media (max-width: 968px) {
          .header-top { flex-direction: column; gap: 1.5rem; }
          .search-bar { width: 100%; }
          .test-grid, .video-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </Layout>
  );
};

const TestLibraryCard = ({ title, subtitle, price, status, testId, type }: any) => {
  return (
    <div className="test-card">
      <div className="card-top">
         <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
         {type && <span className="type-badge">{type}</span>}
      </div>
      <div className="card-info">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <div className="card-price">
          <div className="price-tag">
            <span>Entry Fee</span>
            <strong>{price}</strong>
          </div>
          <Link href={`/test?id=${testId}`}>
            <button className="btn btn-primary buy-btn">
              {status === 'UPCOMING' ? 'Notify Me' : 'Start Mock Test'}
            </button>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .test-card {
          background: white;
          border-radius: 1.25rem;
          padding: 1.75rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06);
          border: 1px solid #F1F5F9;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .test-card:hover { transform: translateY(-6px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); border-color: var(--tertiary); }
        .card-top { display: flex; justify-content: space-between; margin-bottom: 1.25rem; }
        .status-badge { font-size: 0.65rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 1rem; text-transform: uppercase; }
        .live-now { background: #DCFCE7; color: #166534; }
        .upcoming { background: #FEF9C3; color: #854D0E; }
        .completed { background: #F1F5F9; color: #475569; }
        .type-badge { font-size: 0.65rem; font-weight: 700; background: #E0E7FF; color: #3730A3; padding: 0.25rem 0.6rem; border-radius: 0.5rem; }
        
        h3 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #1E293B; font-weight: 700; }
        p { font-size: 0.9rem; color: #64748B; margin-bottom: 2rem; line-height: 1.5; }
        .card-price { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F1F5F9; padding-top: 1.25rem; }
        .price-tag { display: flex; flex-direction: column; }
        .price-tag span { font-size: 0.7rem; color: #94A3B8; text-transform: uppercase; font-weight: 600; }
        .price-tag strong { font-size: 1.4rem; color: #0F172A; }
        .buy-btn { font-size: 0.85rem; padding: 0.7rem 1.25rem; border-radius: 0.75rem; }
      `}</style>
    </div>
  )
}

const VideoCard = ({ title, views, duration, gradient, url }: any) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="video-card">
      <div className="video-thumbnail" style={{ background: gradient }}>
        <div className="duration-tag">{duration}</div>
        <div className="play-overlay"><Play size={32} fill="white" /></div>
      </div>
      <div className="video-info">
        <h4>{title}</h4>
        <div className="video-meta">
          <span><Eye size={12} /> {views} Views</span>
          <span><Clock size={12} /> {duration}</span>
        </div>
      </div>
      <style jsx>{`
        .video-card { cursor: pointer; transition: transform 0.2s; text-decoration: none; color: inherit; display: block; }
        .video-card:hover { transform: translateY(-4px); }
        .video-thumbnail { height: 200px; border-radius: var(--radius-lg); position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .duration-tag { position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.9); color: white; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; z-index: 2; }
        .play-overlay { opacity: 0; transition: opacity 0.2s; background: rgba(0,0,0,0.4); width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
        .video-card:hover .play-overlay { opacity: 1; }
        .video-info { margin-top: 1.25rem; }
        h4 { font-size: 1.1rem; margin-bottom: 0.5rem; font-weight: 700; color: #1E293B; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .video-meta { display: flex; gap: 1.25rem; color: #64748B; font-size: 0.8rem; font-weight: 600; }
        .video-meta span { display: flex; align-items: center; gap: 0.4rem; }
      `}</style>
    </a>
  )
}

export default UnifiedLibrary;
