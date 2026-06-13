import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const user = res.data.user;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'admin')   navigate('/admin/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      {/* Left side */}
      <div style={s.left}>
        <div style={s.leftInner}>
          <a href="/" style={s.backLink}>← Back to Home</a>
          <div style={s.leftLogo}>🏫</div>
          <h1 style={s.leftTitle}>School System</h1>
          <p style={s.leftDesc}>Modern School Management Platform</p>
          <div style={s.leftFeatures}>
            {['Complete attendance tracking', 'Grade management system', 'Multi-role access control', 'Real-time dashboard analytics'].map((f) => (
              <div key={f} style={s.leftFeature}>
                <span style={s.leftFeatureIcon}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Welcome Back</h2>
          <p style={s.cardSub}>Sign in to your account to continue</p>
          {error && <div style={s.error}>⚠️ {error}</div>}

          <form onSubmit={handleLogin}>
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input style={s.input} type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button style={s.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={s.hint}>
            <div style={s.hintTitle}>Demo Accounts</div>
            <div style={s.hintRow}><span style={s.hintRole}>Admin:</span> admin@school.com / admin123</div>
            <div style={s.hintRow}><span style={s.hintRole}>Teacher:</span> teacher@school.com / teacher123</div>
            <div style={s.hintRow}><span style={s.hintRole}>Student:</span> student@school.com / student123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:        { display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  left:        { flex: 1, background: 'linear-gradient(135deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' },
  leftInner:   { maxWidth: '400px', color: '#fff' },
  backLink:    { color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', display: 'block', marginBottom: '2rem' },
  leftLogo:    { fontSize: '3rem', marginBottom: '1rem' },
  leftTitle:   { fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' },
  leftDesc:    { color: '#94a3b8', marginBottom: '2rem', fontSize: '1rem' },
  leftFeatures: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  leftFeature: { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#cbd5e1' },
  leftFeatureIcon: { width: '22px', height: '22px', background: 'rgba(249,115,22,0.2)', color: '#f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0 },
  right:       { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: '#f8fafc' },
  card:        { background: '#fff', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', width: '100%', maxWidth: '440px' },
  cardTitle:   { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.4rem' },
  cardSub:     { color: '#64748b', marginBottom: '1.75rem', fontSize: '0.95rem' },
  error:       { background: '#fef2f2', color: '#dc2626', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem', border: '1px solid #fecaca' },
  field:       { marginBottom: '1.1rem' },
  label:       { display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' },
  input:       { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', color: '#1e293b', outline: 'none', boxSizing: 'border-box' },
  submitBtn:   { width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem' },
  hint:        { marginTop: '1.5rem', background: '#f8fafc', borderRadius: '10px', padding: '1rem' },
  hintTitle:   { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  hintRow:     { fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' },
  hintRole:    { fontWeight: '700', color: '#1e293b' },
};