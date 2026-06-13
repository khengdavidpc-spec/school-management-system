import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/students',  label: 'Students',  icon: '🎓' },
    { to: '/teachers',  label: 'Teachers',  icon: '👨‍🏫' },
    { to: '/attendance', label: 'Attendance', icon: '📋' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <div style={styles.logo}>🏫</div>
        <div>
          <div style={styles.brandName}>SchoolMS</div>
          <div style={styles.brandSub}>Management System</div>
        </div>
      </div>

      <div style={styles.links}>
        {links.map((link) => (
          <Link
            key={link.to}
            style={{
              ...styles.link,
              ...(location.pathname === link.to ? styles.linkActive : {}),
            }}
            to={link.to}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div style={styles.userSection}>
        <div style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user.name}</div>
          <div style={styles.userRole}>{user.role}</div>
        </div>
        <button style={styles.logout} onClick={logout}>↩</button>
      </div>
    </nav>
  );
}

const styles = {
  nav:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 2rem', height: '68px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  brand:     { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logo:      { width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' },
  brandName: { fontWeight: '700', fontSize: '1rem', color: '#1e293b' },
  brandSub:  { fontSize: '0.7rem', color: '#94a3b8' },
  links:     { display: 'flex', gap: '0.25rem' },
  link:      { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#64748b', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s' },
  linkActive: { background: '#e0e7ff', color: '#6366f1' },
  userSection: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar:    { width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.9rem' },
  userInfo:  { textAlign: 'right' },
  userName:  { fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' },
  userRole:  { fontSize: '0.7rem', color: '#94a3b8', textTransform: 'capitalize' },
  logout:    { background: '#f1f5f9', border: 'none', color: '#64748b', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
};