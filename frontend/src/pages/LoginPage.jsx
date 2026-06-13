import { useState } from 'react';
import api from '../services/api';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logoBox}>🏫</div>
          <h1 style={styles.brandTitle}>SchoolMS</h1>
          <p style={styles.brandDesc}>Modern School Management System</p>
          <div style={styles.features}>
            {['Student Management', 'Teacher Management', 'Attendance Tracking', 'Real-time Monitoring'].map((f) => (
              <div key={f} style={styles.feature}>
                <span style={styles.featureIcon}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your account to continue</p>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleLogin}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={styles.hint}>Default: admin@school.com / admin123</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:        { display: 'flex', minHeight: '100vh' },
  left:        { flex: 1, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' },
  leftContent: { color: '#fff', maxWidth: '400px' },
  logoBox:     { width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1.5rem' },
  brandTitle:  { fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' },
  brandDesc:   { fontSize: '1.1rem', opacity: 0.85, marginBottom: '2rem' },
  features:    { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  feature:     { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', opacity: 0.9 },
  featureIcon: { width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 },
  right:       { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: '#f8fafc' },
  card:        { background: '#fff', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' },
  title:       { fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' },
  subtitle:    { color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem' },
  error:       { background: '#fef2f2', color: '#dc2626', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem', border: '1px solid #fecaca' },
  field:       { marginBottom: '1.25rem' },
  label:       { display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.85rem', color: '#475569' },
  input:       { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', color: '#1e293b', boxSizing: 'border-box' },
  button:      { width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600', marginTop: '0.5rem' },
  hint:        { textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '1.5rem' },
};