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
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      {/* Left side - Form */}
      <div style={s.left}>
        <div style={s.leftInner}>
          <div style={s.logo}>
            <div style={s.logoIcon}>🏫</div>
            <span style={s.logoText}>School Management System</span>
          </div>

          <h1 style={s.title}>Login</h1>
          <p style={s.subtitle}>Welcome back, Please login to your account</p>
          <div style={s.titleLine}/>

          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={handleLogin} style={s.form}>
            <div style={s.inputGroup}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div style={s.inputGroup}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div style={s.btnRow}>
              <button type="submit" style={s.loginBtn} disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </form>

          <div style={s.hint}>
            <div style={s.hintTitle}>Demo Accounts</div>
            <div style={s.hintRow}><span style={s.hintRole}>Admin:</span> admin@school.com / admin123</div>
            <div style={s.hintRow}><span style={s.hintRole}>Teacher:</span> email / teacher123</div>
            <div style={s.hintRow}><span style={s.hintRole}>Student:</span> email / student123</div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={s.right}>
        <div style={s.rightContent}>
          <img
            src="/src/assets/school_management.jpeg"
            alt="School"
            style={{ width: '100%', maxWidth: '520px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', marginBottom: '2rem' }}
          />
          <h2 style={s.rightTitle}>School Management System</h2>
          <p style={s.rightDesc}>Manage students, teachers, classes and attendance all in one place</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:       { display: 'flex', minHeight: '100vh', fontFamily: 'Inter, -apple-system, sans-serif' },
  left:       { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: '#fff' },
  leftInner:  { width: '100%', maxWidth: '420px' },
  logo:       { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' },
  logoIcon:   { fontSize: '1.8rem' },
  logoText:   { fontWeight: '800', fontSize: '1rem', color: '#1e293b' },
  title:      { fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' },
  subtitle:   { color: '#64748b', fontSize: '0.95rem', marginBottom: '0.75rem' },
  titleLine:  { width: '50px', height: '3px', background: '#3b82f6', borderRadius: '2px', marginBottom: '2rem' },
  error:      { background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid #fecaca' },
  form:       { marginBottom: '1.5rem' },
  inputGroup: { marginBottom: '1rem' },
  label:      { display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem' },
  input:      { width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', outline: 'none', boxSizing: 'border-box', background: '#fff' },
  btnRow:     { marginTop: '1.5rem' },
  loginBtn:   { width: '100%', padding: '0.85rem', background: '#3b82f6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', fontSize: '1rem', cursor: 'pointer' },
  hint:       { background: '#f8fafc', borderRadius: '10px', padding: '1rem', border: '1px solid #f1f5f9' },
  hintTitle:  { fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' },
  hintRow:    { fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' },
  hintRole:   { fontWeight: '700', color: '#1e293b' },
  right:      { flex: 1, background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' },
  rightContent: { textAlign: 'center', color: '#fff' },
  rightTitle: { fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' },
  rightDesc:  { fontSize: '0.95rem', opacity: 0.85, maxWidth: '320px', margin: '0 auto', lineHeight: 1.6 },
};  