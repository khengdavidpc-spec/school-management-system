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
      window.location.href = '/students';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏫 School Management</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.com"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' },
  card:      { background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title:     { margin: '0 0 0.25rem', fontSize: '1.5rem', textAlign: 'center' },
  subtitle:  { margin: '0 0 1.5rem', color: '#666', textAlign: 'center' },
  error:     { background: '#fff0f0', color: '#c0392b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  field:     { marginBottom: '1rem' },
  label:     { display: 'block', marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem' },
  input:     { width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' },
  button:    { width: '100%', padding: '0.75rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600' },
};