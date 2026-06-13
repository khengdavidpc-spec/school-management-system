import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/student/dashboard',  icon: '▦',  label: 'Dashboard'  },
  { to: '/student/attendance', icon: '📋', label: 'Attendance' },
  { to: '/student/grades',     icon: '📊', label: 'My Grades'  },
  { to: '/student/profile',    icon: '👤', label: 'Profile'    },
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.brandIcon}>🏫</div>
          <div>
            <div style={s.brandName}>School System</div>
            <div style={s.brandRole}>Student Portal</div>
          </div>
        </div>
        <nav style={s.nav}>
          <div style={s.navLabel}>MENU</div>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}
              style={({ isActive }) => ({ ...s.navItem, ...(isActive ? s.navActive : {}) })}>
              <span style={s.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div style={s.bottom}>
          <div style={s.divider}/>
          <div style={s.userBox}>
            <div style={{ ...s.avatar, background: 'linear-gradient(135deg,#10b981,#34d399)' }}>{user.name?.charAt(0)?.toUpperCase()}</div>
            <div style={s.userInfo}>
              <div style={s.userName}>{user.name}</div>
              <div style={s.userRole}>Student</div>
            </div>
            <button style={s.logoutBtn} onClick={logout}>⎋</button>
          </div>
        </div>
      </aside>
      <main style={s.main}><Outlet /></main>
    </div>
  );
}

const s = {
  root:      { display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  sidebar:   { width: '230px', background: '#1e293b', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  brand:     { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  brandIcon: { width: '40px', height: '40px', background: 'linear-gradient(135deg,#10b981,#34d399)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 },
  brandName: { fontWeight: '800', fontSize: '0.9rem', color: '#fff' },
  brandRole: { fontSize: '0.62rem', color: '#34d399', marginTop: '1px', fontWeight: '600' },
  nav:       { flex: 1, padding: '1.25rem 0.75rem' },
  navLabel:  { fontSize: '0.6rem', fontWeight: '700', color: '#475569', letterSpacing: '0.12em', padding: '0 0.75rem', marginBottom: '0.5rem' },
  navItem:   { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '10px', color: '#94a3b8', fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.2rem', textDecoration: 'none' },
  navActive: { background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: '600' },
  navIcon:   { fontSize: '1rem', width: '18px', textAlign: 'center', flexShrink: 0 },
  bottom:    { padding: '0.75rem' },
  divider:   { height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '0.75rem' },
  userBox:   { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' },
  avatar:    { width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.82rem', flexShrink: 0 },
  userInfo:  { flex: 1, minWidth: 0 },
  userName:  { fontSize: '0.82rem', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole:  { fontSize: '0.65rem', color: '#64748b' },
  logoutBtn: { background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  main:      { flex: 1, background: '#f0f2f8', overflowY: 'auto' },
};