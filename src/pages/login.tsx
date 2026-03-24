import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setSubmitting(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Head>
        <title>Login | JEEify</title>
        <meta name="description" content="Log in to your JEEify account" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="auth-left">
        <div className="brand">
          <Link href="/"><span className="logo">JEEify</span></Link>
        </div>
        <div className="left-content">
          <div className="stat-chip">99.94 Percentile Achieved</div>
          <h2>Your Seat in an IIT is a Calculation, Not a Wish.</h2>
          <p>Precision mock tests · Deep analytics · Affordable at ₹10</p>
          <div className="testimonial">
            <div className="avatar-row">
              {['A', 'R', 'S', 'P'].map((l, i) => (
                <div key={i} className="avt" style={{ background: ['#3B82F6','#F97316','#10B981','#8B5CF6'][i] }}>{l}</div>
              ))}
            </div>
            <span>Join <strong>50,000+</strong> aspirants already preparing</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="form-card">
          <div className="form-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your JEE preparation</p>
          </div>

          {error && (
            <div className="error-box">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link href="/forgot-password" className="forgot">Forgot password?</Link>
              </div>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={submitting}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={submitting || loading}>
              {submitting ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>

          <p className="switch-link">Don't have an account? <Link href="/signup">Create one free</Link></p>
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
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%);
        }
        .brand { margin-bottom: auto; }
        .logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.75rem; font-weight: 800; color: white; text-decoration: none; }
        .left-content { padding: 3rem 0; position: relative; z-index: 1; }
        .stat-chip {
          display: inline-flex;
          background: rgba(249,115,22,0.15);
          border: 1px solid rgba(249,115,22,0.3);
          color: #FB923C;
          padding: 0.4rem 1rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .left-content h2 { color: white; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2.2rem; line-height: 1.2; margin-bottom: 1rem; }
        .left-content p { color: #94A3B8; font-size: 1rem; margin-bottom: 2.5rem; }
        .testimonial { display: flex; align-items: center; gap: 1rem; }
        .avatar-row { display: flex; }
        .avt { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #0F172A; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.8rem; margin-left: -8px; }
        .avt:first-child { margin-left: 0; }
        .testimonial span { color: #CBD5E0; font-size: 0.9rem; }
        .testimonial strong { color: white; }

        .auth-right {
          width: 520px;
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
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-group label { font-size: 0.875rem; font-weight: 600; color: #374151; }
        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .forgot { font-size: 0.8rem; color: #F97316; text-decoration: none; font-weight: 500; }
        .field-group input {
          padding: 0.8rem 1rem;
          border: 1.5px solid #E2E8F0;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          color: #0F172A;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #FAFAFA;
          outline: none;
          width: 100%;
        }
        .field-group input:focus { border-color: #F97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); background: white; }
        .field-group input:disabled { opacity: 0.6; cursor: not-allowed; }
        .password-wrap { position: relative; }
        .password-wrap input { padding-right: 3rem; }
        .eye-btn { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9CA3AF; display: flex; align-items: center; padding: 0.25rem; }
        .eye-btn:hover { color: #374151; }

        .submit-btn {
          background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          padding: 0.9rem;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 15px rgba(249,115,22,0.3);
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(249,115,22,0.4); }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .switch-link { text-align: center; font-size: 0.9rem; color: #64748B; margin-top: 1.5rem; }
        .switch-link :global(a) { color: #F97316; font-weight: 600; text-decoration: none; }

        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { width: 100%; padding: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
