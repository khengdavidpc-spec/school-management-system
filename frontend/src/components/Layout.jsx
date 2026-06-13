import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard',  icon: '▦',  label: 'Dashboard'  },
  { to: '/students',   icon: '🎓', label: 'Students'   },
  { to: '/teachers',   icon: '👨‍🏫', label: 'Teachers'   },
  { to: '/classes',    icon: '📚', label: 'Classes'    },
  { to: '/attendance', icon: '📋', label: 'Attendance' },
  { to: '/payroll',    icon: '💰', label: 'Payroll'    },
  { to: '/reports',    icon: '📈', label: 'Reports'    },
];

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const logout = () => { localStorage.clear(); navigate('/login'); };

  const filteredNavItems = user.role === 'admin'
    ? navItems
    : navItems.filter(item => !item.to.includes('/payroll') && !item.to.includes('/reports'));

  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.brandIcon}>🏫</div>
          <div>
            <div style={s.brandName}>School System</div>
            <div style={s.brandSub}>Management Portal</div>
          </div>
        </div>

        <div style={s.navSection}>
          <div style={s.navLabel}>MAIN MENU</div>
          {filteredNavItems.map((item) => (
            <NavLink key={item.to} to={item.to}
              style={({ isActive }) => ({ ...s.navItem, ...(isActive ? s.navActive : {}) })}>
              <span style={s.navIcon}>{item.icon}</span>
              <span style={s.navText}>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div style={s.sidebarBottom}>
          <div style={s.divider}/>
          <div style={s.userBox}>
            <div style={s.userAvatar}>{user.name?.charAt(0)?.toUpperCase()}</div>
            <div style={s.userInfo}>
              <div style={s.userName}>{user.name}</div>
              <div style={s.userRole}>{user.role}</div>
            </div>
            <button style={s.logoutBtn} onClick={logout} title="Logout">⎋</button>
          </div>
        </div>
      </aside>

      <div style={s.content}>
        <Outlet />
      </div>
    </div>
  );
}

const s = {
  root:        { display: 'flex', minHeight: '100vh', background: '#f0f2f8' },
  sidebar:     { width: '230px', background: '#1e293b', display: 'flex', flexDirection: 'column', padding: '0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  brand:       { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  brandIcon:   { width: '40px', height: '40px', background: 'linear-gradient(135deg, #f97316, #fb923c)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 },
  brandName:   { fontWeight: '800', fontSize: '0.95rem', color: '#fff' },
  brandSub:    { fontSize: '0.62rem', color: '#64748b', marginTop: '1px' },
  navSection:  { flex: 1, padding: '1.25rem 0.75rem', overflowY: 'auto' },
  navLabel:    { fontSize: '0.6rem', fontWeight: '700', color: '#475569', letterSpacing: '0.12em', padding: '0 0.75rem', marginBottom: '0.5rem' },
  navItem:     { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.85rem', borderRadius: '10px', color: '#94a3b8', fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.2rem', transition: 'all 0.15s' },
  navActive:   { background: 'rgba(249,115,22,0.15)', color: '#f97316', fontWeight: '600' },
  navIcon:     { fontSize: '1rem', width: '18px', textAlign: 'center', flexShrink: 0 },
  navText:     {},
  sidebarBottom: { padding: '0.75rem' },
  divider:     { height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '0.75rem' },
  userBox:     { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' },
  userAvatar:  { width: '34px', height: '34px', background: 'linear-gradient(135deg, #f97316, #fb923c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.82rem', flexShrink: 0 },
  userInfo:    { flex: 1, minWidth: 0 },
  userName:    { fontSize: '0.82rem', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole:    { fontSize: '0.65rem', color: '#64748b', textTransform: 'capitalize' },
  logoutBtn:   { background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  content:     { flex: 1, overflow: 'auto', minHeight: '100vh' },
};