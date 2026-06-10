import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🏫 School Management</div>
      <div style={styles.links}>
        <Link style={styles.link} to="/students">Students</Link>
        <Link style={styles.link} to="/teachers">Teachers</Link>
        <Link style={styles.link} to="/attendance">Attendance</Link>
      </div>
      <div style={styles.user}>
        <span style={styles.username}>{user.name}</span>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#4f46e5', color: '#fff', padding: '0 1.5rem', height: '60px' },
  brand:    { fontWeight: '700', fontSize: '1.1rem' },
  links:    { display: 'flex', gap: '1.5rem' },
  link:     { color: '#fff', textDecoration: 'none', fontWeight: '500' },
  user:     { display: 'flex', alignItems: 'center', gap: '1rem' },
  username: { fontSize: '0.9rem', opacity: 0.85 },
  logout:   { background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer' },
};