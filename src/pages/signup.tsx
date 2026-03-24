import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const SignupPage = () => {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', '#EF4444', '#F59E0B', '#10B981'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setSubmitting(true);
    setError('');
    const result = await register(name, email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Head>
        <title>Sign Up | JEEify</title>
        <meta name="description" content="Create your JEEify account and start preparing for JEE" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="auth-left">
        <div className="brand">
          <Link href="/"><span className="logo">JEEify</span></Link>
        </div>
        <div className="left-content">
          <div className="stat-chip">₹10 per Mock Test</div>
          <h2>Precision Analytics. IIT-Level Preparation. Accessible to All.</h2>
          <p>Built for underprivileged students who deserve a fair shot at the top IITs.</p>
          <div className="features">
            {['NTA-Pattern Mock Tests', 'Deep Performance Analytics', 'Curated Video Library', 'Instant Result Reports'].map(f => (
              <div key={f} className="feature-item">
                <CheckCircle2 size={16} color="#10B981" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="form-card">
          <div className="form-header">
            <h1>Create Account</h1>
            <p>Start your journey to an IIT seat today</p>
          </div>

          {error && (
            <div className="error-box">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Aryan Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={submitting}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="strength-row">
                  <div className="strength-bars">
                    {[1, 2, 3].map(l => (
                      <div key={l} className="bar" style={{ background: passwordStrength >= l ? strengthColors[passwordStrength] : '#E2E8F0' }} />
                    ))}
                  </div>
                  <span style={{ color: strengthColors[passwordStrength] }}>{strengthLabels[passwordStrength]}</span>
                </div>
              )}
            </div>
            <button type="submit" className="submit-btn" disabled={submitting || loading}>
              {submitting ? <span className="spinner" /> : 'Create Free Account'}
            </button>
          </form>

          <p className="switch-link">Already have an account? <Link href="/login">Sign in</Link></p>
        </div>
      </div>

      <style jsx>{`
        .auth-page { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .auth-left {
          flex: 1;
          background: linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #0F172A 100%);
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .auth-left::before {
          content: '';
          position: absolute;
          bottom: -100px; left: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%);
        }
        .brand { margin-bottom: auto; }
        .logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.75rem; font-weight: 800; color: white; text-decoration: none; }
        .left-content { padding: 3rem 0; position: relative; z-index: 1; }
        .stat-chip {
          display: inline-flex;
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          color: #34D399;
          padding: 0.4rem 1rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .left-content h2 { color: white; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2rem; line-height: 1.25; margin-bottom: 1rem; }
        .left-content p { color: #94A3B8; font-size: 1rem; margin-bottom: 2.5rem; }
        .features { display: flex; flex-direction: column; gap: 1rem; }
        .feature-item { display: flex; align-items: center; gap: 0.75rem; color: #CBD5E0; font-size: 0.95rem; }

        .auth-right {
          width: 540px;
          background: #F7F9FB;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .form-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem;
          width: 100%;
          box-shadow: 0 20px 60px rgba(15,23,42,0.08);
        }
        .form-header { margin-bottom: 2rem; }
        .form-header h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.75rem; color: #0F172A; margin-bottom: 0.4rem; }
        .form-header p { color: #64748B; font-size: 0.95rem; }

        .error-box {
          display: flex; align-items: center; gap: 0.6rem;
          background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626;
          padding: 0.75rem 1rem; border-radius: 0.75rem; font-size: 0.875rem; margin-bottom: 1.5rem;
        }

        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-group label { font-size: 0.875rem; font-weight: 600; color: #374151; }
        .field-group input {
          padding: 0.8rem 1rem; border: 1.5px solid #E2E8F0; border-radius: 0.75rem;
          font-size: 0.95rem; font-family: 'Inter', sans-serif; color: #0F172A;
          transition: border-color 0.2s, box-shadow 0.2s; background: #FAFAFA; outline: none; width: 100%;
        }
        .field-group input:focus { border-color: #F97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); background: white; }
        .field-group input:disabled { opacity: 0.6; cursor: not-allowed; }
        .password-wrap { position: relative; }
        .password-wrap input { padding-right: 3rem; }
        .eye-btn { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9CA3AF; display: flex; align-items: center; padding: 0.25rem; }
        .strength-row { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; }
        .strength-bars { display: flex; gap: 0.35rem; flex: 1; }
        .bar { height: 4px; flex: 1; border-radius: 2px; transition: background 0.3s; }
        .strength-row span { font-size: 0.75rem; font-weight: 600; min-width: 40px; }

        .submit-btn {
          background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
          color: white; border: none; border-radius: 0.75rem; padding: 0.9rem;
          font-size: 1rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center;
          margin-top: 0.5rem; transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 15px rgba(249,115,22,0.3);
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(249,115,22,0.4); }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .switch-link { text-align: center; font-size: 0.9rem; color: #64748B; margin-top: 1.5rem; }
        .switch-link :global(a) { color: #F97316; font-weight: 600; text-decoration: none; }

        @media (max-width: 768px) { .auth-left { display: none; } .auth-right { width: 100%; padding: 1rem; } }
      `}</style>
    </div>
  );
};

export default SignupPage;
