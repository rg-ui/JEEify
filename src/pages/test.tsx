import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { User, ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { databases } from '@/lib/appwrite';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/Logo';

const TestEngine = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();

  const [testData, setTestData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('ALL'); // Filters could be added later
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60);
  
  // State for user responses and status
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<Record<number, string>>({}); // 'answered', 'marked', 'unvisited'
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;
      try {
        const doc = await databases.getDocument('jeeify_db', 'tests', id as string);
        setTestData(doc);
        const qData = JSON.parse(doc.questionsData || '[]');
        setQuestions(qData);
        // Initialize status
        const initialStatus: Record<number, string> = {};
        qData.forEach((_: any, i: number) => {
          initialStatus[i] = 'unvisited';
        });
        initialStatus[0] = 'not-answered';
        setStatus(initialStatus);
      } catch (error) {
        console.error('Fetch test error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTest();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionValue: string) => {
    setResponses(prev => ({ ...prev, [currentQIndex]: optionValue }));
  };

  const handleSaveNext = () => {
    if (responses[currentQIndex]) {
      setStatus(prev => ({ ...prev, [currentQIndex]: 'answered' }));
    } else {
      setStatus(prev => ({ ...prev, [currentQIndex]: 'not-answered' }));
    }
    
    if (currentQIndex < questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      if (status[nextIdx] === 'unvisited') {
        setStatus(prev => ({ ...prev, [nextIdx]: 'not-answered' }));
      }
    }
  };

  const handleMarkReview = () => {
    setStatus(prev => ({ ...prev, [currentQIndex]: 'marked' }));
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handleClear = () => {
    const newResponses = { ...responses };
    delete newResponses[currentQIndex];
    setResponses(newResponses);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQIndex(index);
    if (status[index] === 'unvisited') {
      setStatus(prev => ({ ...prev, [index]: 'not-answered' }));
    }
  };

  const calculateResults = () => {
    let score = 0;
    const analysis: Record<string, { correct: number; total: number; score: number }> = {};

    questions.forEach((q, i) => {
      const subject = q.subject || 'General';
      if (!analysis[subject]) {
        analysis[subject] = { correct: 0, total: 0, score: 0 };
      }
      analysis[subject].total += 1;

      if (responses[i] === q.correct) {
        score += 4;
        analysis[subject].correct += 1;
        analysis[subject].score += 4;
      } else if (responses[i]) {
        score -= 1;
        analysis[subject].score -= 1;
      }
    });

    return { score, analysis };
  };

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit the test?')) return;
    
    const { score: finalScore, analysis: subjectAnalysis } = calculateResults();
    const totalMarks = questions.length * 4;
    
    // Calculate a semi-realistic percentile: (Score/Total) * 100
    const pct = totalMarks > 0 ? (Math.max(0, finalScore) / totalMarks) * 100 : 0;
    const percentile = pct.toFixed(2);

    try {
      if (!user) throw new Error('User not logged in');

      await databases.createDocument('jeeify_db', 'submissions', 'unique()', {
        userId: user.$id,
        testId: id as string,
        testName: testData.title,
        score: finalScore,
        totalMarks: totalMarks,
        percentile: percentile,
        completedAt: new Date().toISOString(),
        subjectAnalysis: JSON.stringify(subjectAnalysis)
      });

      alert(`✅ Test Submitted Successfully!\nYour Score: ${finalScore}/${totalMarks}\nPercentile: ${percentile}%`);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Submission error:', error);
      alert('❌ Failed to submit test: ' + (error.message || 'Please check your connection.'));
    }
  };

  if (loading || authLoading) return <div className="loading-screen">Preparing Test Environment...</div>;
  if (!testData) return <div className="error-screen">Test not found.</div>;

  const currentQ = questions[currentQIndex];

  return (
    <div className="test-engine-container">
      <Head>
        <title>JEEify Test Engine | {testData.title}</title>
      </Head>

      <header className="test-header">
        <div className="header-left">
          <Logo height={34} />
          <div className="divider" />
          <span className="test-name">{testData.title}</span>
        </div>
        <div className="header-right">
          <div className="timer">
            <Clock size={18} />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button className="mobile-only btn-grid" onClick={() => setShowSidebar(!showSidebar)}>Grid</button>
          <button className="btn-submit" onClick={handleSubmit}>Submit</button>
        </div>
      </header>

      <div className="main-layout">
        <div className="content-area">
          <div className="question-header">
            <div className="q-info">
              <strong>Question No. {currentQIndex + 1}</strong>
              <span className="q-type">Type: Multiple Choice (Single Correct)</span>
            </div>
            <div className="q-marking">
              <span>Marks: <span className="pos">+4</span> <span className="neg">-1</span></span>
            </div>
          </div>
          
          <div className="question-body">
            <div className="question-text">
               {currentQ?.text || 'No question text provided.'}
            </div>
            
            {currentQ?.image && (
              <div className="question-image">
                <img src={currentQ.image} alt="Question Diagram" />
              </div>
            )}

            <div className="options-list">
              {(currentQ?.options || []).map((opt: string, idx: number) => {
                const label = String.fromCharCode(65 + idx);
                return (
                  <label key={idx} className={`option-item ${responses[currentQIndex] === opt ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="option" 
                      checked={responses[currentQIndex] === opt}
                      onChange={() => handleOptionSelect(opt)}
                    />
                    <span className="radio-dot"></span>
                    <span className="option-label">{label}.</span>
                    <span className="option-text">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="action-footer">
            <button className="btn-footer outline" onClick={handleMarkReview}>Mark for Review & Next</button>
            <button className="btn-footer outline" onClick={handleClear}>Clear Response</button>
            <div className="spacer" />
            <button 
              className="btn-footer secondary" 
              onClick={() => currentQIndex > 0 && jumpToQuestion(currentQIndex - 1)}
              disabled={currentQIndex === 0}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button className="btn-footer primary" onClick={handleSaveNext}>
              Save & Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <aside className={`sidebar ${showSidebar ? 'show' : ''}`}>
          <div className="mobile-header mobile-only">
             <h3>Question Navigation</h3>
             <button onClick={() => setShowSidebar(false)}>Close</button>
          </div>
          <div className="user-profile">
            <div className="avatar">
              <User size={32} color="white" />
            </div>
            <div className="user-info">
              <strong>{user?.name.toUpperCase()}</strong>
              <span>Candidate ID: {user?.$id.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          <div className="palette-container">
            <div className="palette-tabs">
              <button className="active">ALL SECTIONS</button>
            </div>
            
            <div className="question-grid">
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={`q-num ${status[i]} ${currentQIndex === i ? 'current' : ''}`}
                  onClick={() => jumpToQuestion(i)}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="legend">
             <div className="legend-item"><span className="box answered">{Object.values(status).filter(s => s === 'answered').length}</span> Answered</div>
             <div className="legend-item"><span className="box unanswered">{Object.values(status).filter(s => s === 'not-answered').length}</span> Not Answered</div>
             <div className="legend-item"><span className="box unvisited">{Object.values(status).filter(s => s === 'unvisited').length}</span> Not Visited</div>
             <div className="legend-item"><span className="box marked">{Object.values(status).filter(s => s === 'marked').length}</span> Marked for Review</div>
             <div className="legend-item"><span className="box answered-marked">0</span> Answered & Marked for Review</div>
          </div>

          <div className="sidebar-footer">
             <button className="btn-sidebar">Question Paper</button>
             <button className="btn-sidebar">Instructions</button>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .test-engine-container { height: 100vh; display: flex; flex-direction: column; background: #F1F5F9; font-family: 'Inter', system-ui, sans-serif; color: #1E293B; }
        .loading-screen, .error-screen { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 600; color: #64748B; }
        
        .test-header { height: 64px; background: #0F172A; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; color: white; border-bottom: 4px solid #F59E0B; }
        .header-left { display: flex; align-items: center; gap: 1rem; }
        .logo { font-weight: 900; font-size: 1.5rem; letter-spacing: -0.02em; color: #F59E0B; }
        .divider { width: 1px; height: 28px; background: rgba(255,255,255,0.2); }
        .test-name { font-weight: 600; font-size: 0.95rem; opacity: 0.9; }
        .header-right { display: flex; align-items: center; gap: 2rem; }
        .timer { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 6px; font-variant-numeric: tabular-nums; font-family: monospace; font-size: 1.1rem; }
        .btn-submit { background: #E11D48; color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 6px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .btn-submit:hover { background: #BE123C; }

        .main-layout { flex: 1; display: flex; overflow: hidden; gap: 1px; background: #E2E8F0; }
        .content-area { flex: 1; display: flex; flex-direction: column; background: white; }
        .question-header { padding: 1rem 2rem; border-bottom: 2px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center; }
        .q-info { display: flex; flex-direction: column; }
        .q-type { font-size: 0.8rem; color: #64748B; font-weight: 600; text-transform: uppercase; margin-top: 0.25rem; }
        .q-marking { font-size: 0.9rem; font-weight: 700; background: #F8FAFC; padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid #E2E8F0; }
        .pos { color: #059669; }
        .neg { color: #DC2626; }

        .question-body { flex: 1; padding: 2.5rem; overflow-y: auto; line-height: 1.6; }
        .question-text { font-size: 1.2rem; font-weight: 500; margin-bottom: 2rem; color: #334155; }
        .question-image img { max-width: 100%; border-radius: 8px; margin: 1rem 0; border: 1px solid #E2E8F0; }
        
        .options-list { display: flex; flex-direction: column; gap: 1rem; max-width: 800px; }
        .option-item { display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem; border: 2px solid #E2E8F0; border-radius: 12px; cursor: pointer; transition: all 0.2s; position: relative; }
        .option-item:hover { border-color: #94A3B8; background: #F8FAFC; }
        .option-item.selected { border-color: #3B82F6; background: #EFF6FF; }
        .radio-dot { width: 22px; height: 22px; border: 2px solid #CBD5E0; border-radius: 50%; background: white; flex-shrink: 0; }
        .option-item input { display: none; }
        .option-item.selected .radio-dot { border-color: #3B82F6; background: #3B82F6; box-shadow: inset 0 0 0 4px white; }
        .option-label { font-weight: 800; color: #64748B; width: 20px; }
        .option-text { font-size: 1.1rem; font-weight: 500; color: #1E293B; }

        .action-footer { padding: 1.5rem 2rem; border-top: 2px solid #F1F5F9; display: flex; gap: 1rem; background: #F8FAFC; }
        .spacer { flex: 1; }
        .btn-footer { padding: 0.8rem 1.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; display: flex; align-items: center; gap: 0.6rem; font-size: 0.95rem; transition: all 0.2s; }
        .btn-footer.outline { background: white; border: 2px solid #CBD5E0; color: #475569; }
        .btn-footer.outline:hover { border-color: #94A3B8; }
        .btn-footer.secondary { background: #475569; color: white; }
        .btn-footer.primary { background: #0F172A; color: white; }
        .btn-footer:disabled { opacity: 0.5; cursor: not-allowed; }

        .sidebar { width: 380px; background: white; display: flex; flex-direction: column; }
        .user-profile { padding: 1.5rem; background: #F8FAFC; display: flex; align-items: center; gap: 1.25rem; border-bottom: 1px solid #E2E8F0; }
        .avatar { width: 56px; height: 56px; background: #334155; border-radius: 12px; display: flex; justify-content: center; align-items: center; }
        .user-info { display: flex; flex-direction: column; }
        .user-info strong { font-size: 1.1rem; letter-spacing: 0.02em; color: #0F172A; }
        .user-info span { font-size: 0.8rem; color: #64748B; font-weight: 600; margin-top: 0.1rem; }

        .palette-container { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 1.5rem; }
        .palette-tabs button { width: 100%; border: none; background: #F1F5F9; padding: 0.75rem; font-size: 0.8rem; font-weight: 800; cursor: pointer; color: #475569; border-radius: 6px; letter-spacing: 0.05em; margin-bottom: 1.5rem; }
        
        .question-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; overflow-y: auto; padding-right: 0.5rem; }
        .q-num { width: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center; font-size: 1rem; font-weight: 700; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .q-num.unvisited { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; }
        .q-num.not-answered { background: #EF4444; color: white; border-radius: 20px 20px 0 0; }
        .q-num.answered { background: #10B981; color: white; border-radius: 50%; }
        .q-num.marked { background: #8B5CF6; color: white; border-radius: 50%; }
        .q-num.current { ring: 3px solid #F59E0B; ring-offset: 2px; outline: 3px solid #F59E0B; outline-offset: 2px; }

        .legend { padding: 1.5rem; background: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 0.8rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .legend-item { display: flex; align-items: center; gap: 0.6rem; font-weight: 600; color: #475569; }
        .box { width: 28px; height: 28px; display: flex; justify-content: center; align-items: center; border-radius: 6px; color: white; flex-shrink: 0; }
        .box.answered { background: #10B981; border-radius: 50%; }
        .box.unanswered { background: #EF4444; border-radius: 12px 12px 0 0; }
        .box.unvisited { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; }
        .box.marked { background: #8B5CF6; border-radius: 50%; }
        .box.answered-marked { background: #8B5CF6; border-radius: 50%; position: relative; }
        .box.answered-marked::after { content: ''; position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #10B981; border: 2px solid white; border-radius: 50%; }

        .sidebar-footer { padding: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid #E2E8F0; background: #F8FAFC; }
        .btn-sidebar { padding: 0.75rem; border: 1.5px solid #CBD5E0; background: white; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; color: #475569; transition: all 0.2s; }
        .btn-sidebar:hover { border-color: #94A3B8; background: #F1F5F9; }

        .mobile-only { display: none; }

        @media (max-width: 1024px) {
          .sidebar { position: fixed; right: -100%; top: 64px; height: calc(100vh - 64px); z-index: 1000; box-shadow: -10px 0 30px rgba(0,0,0,0.1); transition: right 0.3s ease; }
          .sidebar.show { right: 0; }
          .mobile-only { display: block; }
          .btn-grid { background: #475569; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 700; }
          
          .test-header { padding: 0 1rem; }
          .logo { font-size: 1.25rem; }
          .test-name { font-size: 0.8rem; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .header-right { gap: 0.75rem; }
          .timer { font-size: 0.9rem; padding: 0.4rem 0.6rem; }
          
          .question-header { padding: 1rem; flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .q-marking { align-self: flex-end; }
          
          .question-body { padding: 1.5rem; }
          .question-text { font-size: 1.1rem; }
          .option-item { padding: 1rem; }
          
          .action-footer { flex-wrap: wrap; padding: 1rem; gap: 0.5rem; justify-content: space-between; position: sticky; bottom: 0; box-shadow: 0 -4px 10px rgba(0,0,0,0.05); }
          .btn-footer { flex: 1; padding: 0.6rem 0.8rem; font-size: 0.8rem; min-width: 45%; justify-content: center; }
          .spacer { display: none; }
          
          .mobile-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; }
          .mobile-header h3 { font-size: 1.1rem; margin: 0; }
          .mobile-header button { background: none; border: none; font-weight: 700; color: #EF4444; }
        }

        @media (max-width: 480px) {
          .header-left .divider { display: none; }
          .test-name { display: none; }
          .btn-submit { padding: 0.5rem 1rem; font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
};

export default TestEngine;
