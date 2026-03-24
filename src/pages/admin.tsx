import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Users, FileText, Video, Plus, LogOut, Shield, ChevronRight, Upload } from 'lucide-react';
import { databases, ID } from '@/lib/appwrite';
import Logo from '@/components/Logo';

const tabs = ['Overview', 'Users', 'Tests', 'Videos'];

const AdminPage = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeTestTab, setActiveTestTab] = useState('Mock Tests');
  const [uploadingTest, setUploadingTest] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testProvider, setTestProvider] = useState('');
  const [testPrice, setTestPrice] = useState('');
  const [showJsonGuide, setShowJsonGuide] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [addingVideo, setAddingVideo] = useState(false);
  const [dbTests, setDbTests] = useState<any[]>([]);
  const [dbVideos, setDbVideos] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const testsRes = await databases.listDocuments('jeeify_db', 'tests');
      const videosRes = await databases.listDocuments('jeeify_db', 'videos');
      setDbTests(testsRes.documents);
      setDbVideos(videosRes.documents);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleTestUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingTest(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        await databases.createDocument('jeeify_db', 'tests', ID.unique(), {
          title: testTitle || json.title || file.name.replace('.json', ''),
          subtitle: json.subtitle || `${json.questions?.length || 0} Questions`,
          provider: testProvider || json.provider || 'JEEify',
          price: testPrice || json.price || 'Free',
          status: json.status || 'LIVE NOW',
          type: activeTestTab === 'Mock Tests' ? 'MOCK' : 'PYQ',
          questionsData: JSON.stringify(json.questions || [])
        });
        
        alert('✅ Test uploaded successfully!');
        setTestTitle(''); setTestProvider(''); setTestPrice('');
        fetchData();
      } catch (error: any) {
        console.error('Upload error:', error);
        alert('❌ Failed to upload test: ' + error.message);
      } finally {
        setUploadingTest(false);
        event.target.value = ''; // clear input
      }
    };
    reader.readAsText(file);
  };

  const handleAddVideo = async () => {
    if (!videoUrl) return;
    setAddingVideo(true);
    try {
      await databases.createDocument('jeeify_db', 'videos', ID.unique(), {
        title: 'Uploaded Video',
        url: videoUrl,
        subject: 'General'
      });
      alert('✅ Video added successfully!');
      setVideoUrl('');
      fetchData();
    } catch (error: any) {
      console.error('Video error:', error);
      alert('❌ Failed to add video: ' + error.message);
    } finally {
      setAddingVideo(false);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    try {
      await databases.deleteDocument('jeeify_db', 'tests', testId);
      alert('✅ Test deleted successfully!');
      fetchData();
    } catch (error: any) {
      alert('❌ Delete failed: ' + error.message);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to remove this video?')) return;
    try {
      await databases.deleteDocument('jeeify_db', 'videos', videoId);
      alert('✅ Video removed successfully!');
      fetchData();
    } catch (error: any) {
      alert('❌ Removal failed: ' + error.message);
    }
  };

  const openEditModal = (doc: any) => {
    setEditingDoc(doc);
    setTestTitle(doc.title);
    setTestProvider(doc.provider || '');
    setTestPrice(doc.price || '');
    setIsEditModalOpen(true);
  };

  const handleUpdateTest = async () => {
    if (!editingDoc) return;
    try {
      await databases.updateDocument('jeeify_db', 'tests', editingDoc.$id, {
        title: testTitle,
        provider: testProvider,
        price: testPrice
      });
      alert('✅ Test updated successfully!');
      setIsEditModalOpen(false);
      setEditingDoc(null);
      setTestTitle(''); setTestProvider(''); setTestPrice('');
      fetchData();
    } catch (error: any) {
      alert('❌ Update failed: ' + error.message);
    }
  };

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0F172A' }}>
      <div className="loader" />
      <style jsx>{`.loader { width:40px;height:40px;border:3px solid rgba(249,115,22,0.2);border-top-color:#F97316;border-radius:50%;animation:spin 0.8s linear infinite;} @keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!user) return null;

  const handleLogout = async () => { await logout(); router.push('/'); };

  return (
    <div className="admin-page">
      <Head><title>Admin Panel | JEEify</title></Head>

      <button className="admin-mobile-toggle" onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
        <Shield size={20} />
      </button>

      <aside className={`admin-sidebar ${showMobileSidebar ? 'show' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setShowMobileSidebar(false)}>
            <Logo height={32} />
          </Link>
          <div className="admin-badge"><Shield size={12} /> Admin</div>
          <button className="close-sidebar mobile-only" onClick={() => setShowMobileSidebar(false)}>&times;</button>
        </div>
        <nav className="sidebar-nav">
          {tabs.map(t => (
            <button key={t} className={`nav-item ${activeTab === t ? 'active' : ''}`} onClick={() => { setActiveTab(t); setShowMobileSidebar(false); }}>
              {t === 'Overview' && <FileText size={18} />}
              {t === 'Users' && <Users size={18} />}
              {t === 'Tests' && <FileText size={18} />}
              {t === 'Videos' && <Video size={18} />}
              {t}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'A'}</div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}><LogOut size={16} /></button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="breadcrumb">Admin Panel</span>
            <h1>{activeTab}</h1>
          </div>
          <button className="btn-add"><Plus size={16} /> Add New</button>
        </header>

        {activeTab === 'Overview' && (
          <div className="overview-grid">
            {[
              { label: 'Total Users', value: '1', delta: 'Just Now', color: '#3B82F6' },
              { label: 'Active Tests', value: '0', delta: '', color: '#F97316' },
              { label: 'Videos', value: '0', delta: '', color: '#10B981' },
              { label: 'Revenue', value: '₹0', delta: '', color: '#8B5CF6' },
            ].map(stat => (
              <div key={stat.label} className="stat-card" style={{ borderTop: `3px solid ${stat.color}` }}>
                <span className="stat-label">{stat.label}</span>
                <strong className="stat-value">{stat.value}</strong>
                <span className="stat-delta">{stat.delta}</span>
              </div>
            ))}
            <div className="quick-actions card">
              <h3>Quick Actions</h3>
              {['Upload New Test JSON', 'Add YouTube Video', 'Send Announcement', 'View Reports'].map(a => (
                <button key={a} className="action-row">
                  {a} <ChevronRight size={14} />
                </button>
              ))}
            </div>
            <div className="recent-activity card">
              <h3>Recent Activity</h3>
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94A3B8', fontSize: '0.9rem' }}>
                No recent activity to show.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Tests' && (
          <div className="tests-section">
            <div className="test-tabs">
              {['PYQ Tests', 'Mock Tests'].map(t => (
                <button 
                  key={t} 
                  className={`test-tab ${activeTestTab === t ? 'active-test-tab' : ''}`}
                  onClick={() => setActiveTestTab(t)}
                  style={{ borderColor: activeTestTab === t ? '#F97316' : '', color: activeTestTab === t ? '#F97316' : '' }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="upload-form card">
              <div className="form-grid">
                <div className="form-group">
                  <label>Mock Name</label>
                  <input type="text" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} placeholder="e.g. JEE Main Full Test #1" />
                </div>
                <div className="form-group">
                  <label>Provider</label>
                  <input type="text" value={testProvider} onChange={(e) => setTestProvider(e.target.value)} placeholder="e.g. Mathongo, PW, Allen" />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input type="text" value={testPrice} onChange={(e) => setTestPrice(e.target.value)} placeholder="e.g. ₹10 or Free" />
                </div>
              </div>

              <div className="upload-area">
                <Upload size={36} color="#F97316" />
                <h3>{uploadingTest ? 'Uploading...' : 'Upload Test JSON'}</h3>
                <p>Select the JSON file containing questions</p>
                <input type="file" accept=".json" id="test-upload" style={{ display: 'none' }} onChange={handleTestUpload} disabled={uploadingTest} />
                <label htmlFor="test-upload" className="upload-btn" style={{ opacity: uploadingTest ? 0.7 : 1 }}>
                  {uploadingTest ? 'Uploading...' : 'Choose File & Upload'}
                </label>
              </div>

              <button className="guide-toggle" onClick={() => setShowJsonGuide(!showJsonGuide)}>
                {showJsonGuide ? 'Hide' : 'Show'} JSON Format Guide
              </button>

              {showJsonGuide && (
                <div className="json-guide">
                  <h4>Required JSON Format</h4>
                  <pre>{`{
  "title": "Test Name",
  "questions": [
    {
      "id": 1,
      "text": "What is the hybridisation of CH4?",
      "options": ["sp", "sp2", "sp3", "dsp2"],
      "correctAnswer": 2,
      "subject": "Chemistry"
    }
  ]
}`}</pre>
                </div>
              )}
            </div>
            <div className="tests-list card">
              <h3>Existing Tests</h3>
              {loadingData ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
              ) : dbTests.length > 0 ? (
                dbTests.map((t) => (
                  <div key={t.$id} className="test-row">
                    <div>
                      <span style={{ fontWeight: 600 }}>{t.title}</span>
                      <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                        {t.type} • {t.subtitle} • {t.provider || 'JEEify'}
                      </span>
                    </div>
                    <div className="row-actions">
                      <button className="pill-btn" onClick={() => openEditModal(t)}>Edit</button>
                      <button className="pill-btn danger" onClick={() => handleDeleteTest(t.$id)}>Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94A3B8', fontSize: '0.9rem' }}>
                  No tests uploaded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Videos' && (
          <div className="videos-section">
            <div className="upload-card card">
              <Video size={36} color="#3B82F6" />
              <h3>Add YouTube Video</h3>
              <p>Paste a YouTube URL to add to the library</p>
              <div className="url-input-row">
                <input 
                  type="text" 
                  placeholder="https://youtube.com/watch?v=..." 
                  className="url-input" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={addingVideo}
                />
                <button className="submit-url-btn" onClick={handleAddVideo} disabled={addingVideo}>
                  {addingVideo ? 'Adding...' : 'Add Video'}
                </button>
              </div>
            </div>
            <div className="videos-list card">
              <h3>Video Library</h3>
              {loadingData ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
              ) : dbVideos.length > 0 ? (
                dbVideos.map((v) => (
                  <div key={v.$id} className="test-row">
                    <div>
                      <span style={{ fontWeight: 600 }}>{v.title}</span>
                      <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                        {v.subject}
                      </span>
                    </div>
                    <div className="row-actions">
                      <button className="pill-btn danger" onClick={() => handleDeleteVideo(v.$id)}>Remove</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94A3B8', fontSize: '0.9rem' }}>
                  No videos added yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Users' && (
          <div className="users-section card">
            <h3>All Users</h3>
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Tests Taken</th><th>Joined</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>0</td>
                  <td>Today</td>
                  <td><span className="status-pill active">Admin</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {isEditModalOpen && (
          <div className="modal-overlay">
            <div className="modal card">
              <h3>Edit Mock Test</h3>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Mock Name</label>
                <input type="text" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Provider</label>
                <input type="text" value={testProvider} onChange={(e) => setTestProvider(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Price</label>
                <input type="text" value={testPrice} onChange={(e) => setTestPrice(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button className="pill-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button className="upload-btn" onClick={handleUpdateTest}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-page { display: flex; min-height: 100vh; background: #F7F9FB; font-family: 'Inter', sans-serif; }
        
        /* Sidebar */
        .admin-sidebar { width: 260px; background: #0F172A; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; }
        .sidebar-header { padding: 1.75rem 1.5rem 1rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.4rem; font-weight: 800; color: white; text-decoration: none; }
        .admin-badge { display: flex; align-items: center; gap: 0.3rem; background: rgba(249,115,22,0.15); color: #FB923C; padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.7rem; font-weight: 700; }
        .sidebar-nav { padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 0.75rem; width: 100%; background: transparent; border: none; color: #94A3B8; padding: 0.75rem 1rem; border-radius: 0.6rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; text-align: left; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
        .nav-item.active { background: rgba(249,115,22,0.15); color: #FB923C; }
        .sidebar-footer { padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 0.75rem; }
        .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #F97316, #EA580C); color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .user-info { flex: 1; min-width: 0; }
        .user-info strong { display: block; color: white; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-info span { display: block; color: #64748B; font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .logout-btn { background: none; border: none; color: #64748B; cursor: pointer; display: flex; padding: 0.3rem; border-radius: 0.4rem; transition: color 0.2s; }
        .logout-btn:hover { color: #EF4444; }

        /* Main */
        .admin-main { margin-left: 260px; flex: 1; padding: 2rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .breadcrumb { font-size: 0.75rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; display: block; margin-bottom: 0.25rem; }
        .admin-header h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2rem; color: #0F172A; }
        .btn-add { display: flex; align-items: center; gap: 0.5rem; background: #F97316; color: white; border: none; padding: 0.7rem 1.25rem; border-radius: 0.6rem; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: transform 0.15s; }
        .btn-add:hover { transform: translateY(-1px); }

        /* Card */
        .card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 20px rgba(15,23,42,0.05); }
        .card h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; margin-bottom: 1.25rem; color: #0F172A; }

        /* Overview */
        .overview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .stat-card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 20px rgba(15,23,42,0.05); display: flex; flex-direction: column; gap: 0.25rem; }
        .stat-label { font-size: 0.75rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .stat-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.75rem; color: #0F172A; }
        .stat-delta { font-size: 0.8rem; color: #10B981; font-weight: 500; }
        .quick-actions { grid-column: 1 / 3; }
        .action-row { display: flex; justify-content: space-between; align-items: center; width: 100%; background: none; border: none; border-bottom: 1px solid #F1F5F9; padding: 0.9rem 0; font-size: 0.9rem; cursor: pointer; color: #374151; transition: color 0.2s; }
        .action-row:hover { color: #F97316; }
        .action-row:last-child { border-bottom: none; }
        .recent-activity { grid-column: 3 / 5; }
        .activity-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid #F1F5F9; }
        .activity-item:last-child { border-bottom: none; }
        .activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
        .activity-item p { font-size: 0.875rem; color: #374151; margin-bottom: 0.1rem; }
        .activity-item span { font-size: 0.75rem; color: #94A3B8; }

        /* Tests & Videos */
        .tests-section, .videos-section { display: flex; flex-direction: column; gap: 1.5rem; }
        .test-tabs { display: flex; gap: 0.75rem; }
        .test-tab { padding: 0.6rem 1.25rem; border: 1.5px solid #E2E8F0; border-radius: 0.5rem; background: white; font-weight: 600; cursor: pointer; font-size: 0.875rem; color: #374151; transition: all 0.2s; }
        .test-tab:hover { border-color: #F97316; color: #F97316; }
        .upload-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; text-align: left; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #64748B; }
        .form-group input { padding: 0.6rem 0.8rem; border: 1.5px solid #E2E8F0; border-radius: 0.5rem; font-size: 0.9rem; outline: none; }
        .form-group input:focus { border-color: #F97316; }
        .upload-area { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2rem; border: 2px dashed #E2E8F0; text-align: center; border-radius: 0.8rem; }
        .upload-area:hover { border-color: #F97316; }
        .guide-toggle { background: none; border: none; color: #3B82F6; font-size: 0.85rem; font-weight: 600; cursor: pointer; text-align: left; padding: 0.5rem 0; width: fit-content; }
        .json-guide { background: #F8FAFC; padding: 1rem; border-radius: 0.6rem; text-align: left; }
        .json-guide h4 { margin-top: 0; font-size: 0.9rem; color: #0F172A; }
        .json-guide pre { font-size: 0.75rem; color: #334155; overflow-x: auto; font-family: 'JetBrains Mono', monospace; }
        .upload-btn { background: #F97316; color: white; padding: 0.6rem 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; font-size: 0.875rem; border: none; }
        .url-input-row { display: flex; gap: 0.75rem; width: 100%; max-width: 600px; }
        .url-input { flex: 1; padding: 0.7rem 1rem; border: 1.5px solid #E2E8F0; border-radius: 0.6rem; font-size: 0.9rem; outline: none; }
        .url-input:focus { border-color: #F97316; }
        .submit-url-btn { background: #3B82F6; color: white; border: none; padding: 0.7rem 1.25rem; border-radius: 0.6rem; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .test-row { display: flex; justify-content: space-between; align-items: center; padding: 0.9rem 0; border-bottom: 1px solid #F1F5F9; font-size: 0.9rem; color: #374151; }
        .test-row:last-child { border-bottom: none; }
        .row-actions { display: flex; gap: 0.5rem; }
        .pill-btn { padding: 0.3rem 0.75rem; border-radius: 0.4rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid #E2E8F0; background: white; color: #374151; }
        .pill-btn.danger { border-color: #FECACA; color: #EF4444; }
        .pill-btn:hover { opacity: 0.8; }

        /* Users Table */
        .users-section table { width: 100%; border-collapse: collapse; }
        .users-section th { text-align: left; font-size: 0.75rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.75rem; border-bottom: 1px solid #F1F5F9; font-weight: 600; }
        .users-section td { padding: 1rem 0.75rem; font-size: 0.9rem; color: #374151; border-bottom: 1px solid #F1F5F9; }
        .status-pill { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 1rem; }
        .status-pill.active { background: #DCFCE7; color: #16A34A; }
        .status-pill.new { background: #DBEAFE; color: #2563EB; }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { width: 400px; max-width: 90%; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }

        .admin-mobile-toggle { display: none; position: fixed; bottom: 1.5rem; right: 1.5rem; width: 56px; height: 56px; border-radius: 50%; background: #F97316; color: white; border: none; box-shadow: 0 4px 15px rgba(249,115,22,0.4); z-index: 999; cursor: pointer; justify-content: center; align-items: center; }
        .mobile-only { display: none; }
        .close-sidebar { background: none; border: none; color: white; font-size: 2rem; padding: 0.5rem; }

        @media (max-width: 1024px) {
          .admin-sidebar { left: -100%; transition: left 0.3s ease; z-index: 1001; }
          .admin-sidebar.show { left: 0; width: 280px; }
          .admin-main { margin-left: 0; padding: 1rem; }
          .admin-mobile-toggle { display: flex; }
          .mobile-only { display: block; }
          
          .overview-grid { grid-template-columns: 1fr 1fr; }
          .quick-actions, .recent-activity { grid-column: span 2; }
          .form-grid { grid-template-columns: 1fr; }
          
          .admin-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .admin-header h1 { font-size: 1.5rem; }
          
          .test-row { flex-direction: column; align-items: flex-start; gap: 1rem; border-bottom: 2px solid #F1F5F9; padding-bottom: 1.5rem; }
          .row-actions { width: 100%; }
          .pill-btn { flex: 1; text-align: center; padding: 0.6rem; }
          
          .users-section { overflow-x: auto; }
          table { min-width: 600px; }
        }

        @media (max-width: 640px) {
          .overview-grid { grid-template-columns: 1fr; }
          .quick-actions, .recent-activity { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
