import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    { icon: '🎓', title: 'Student Management', desc: 'Enroll students, track grades, and monitor attendance all in one place.' },
    { icon: '👨‍🏫', title: 'Teacher Portal', desc: 'Teachers can manage classes, mark attendance, and enter grades easily.' },
    { icon: '📚', title: 'Class Management', desc: 'Organize classes by grade, assign teachers, and track student enrollment.' },
    { icon: '📋', title: 'Attendance Tracking', desc: 'Real-time attendance marking with detailed reports and analytics.' },
    { icon: '📊', title: 'Grade Management', desc: 'Input and track student scores with automatic grade calculation.' },
    { icon: '📈', title: 'Reports & Analytics', desc: 'Comprehensive dashboards with charts and performance insights.' },
  ];

  const stats = [
    { value: '1+', label: 'Students Enrolled' },
    { value: '2+',  label: 'Teachers' },
    { value: '2+',  label: 'Classes' },
    { value: '100%',  label: 'Satisfaction Rate' },
  ];

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navLogo}>🏫</div>
          <span style={s.navName}>School System</span>
        </div>
        <div style={s.navLinks}>
          <a href="#features" style={s.navLink}>Features</a>
          <a href="#about"    style={s.navLink}>About</a>
          <a href="#contact"  style={s.navLink}>Contact</a>
          <button style={s.loginBtn} onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>🎓 Modern School Management</div>
          <h1 style={s.heroTitle}>
            Manage Your School<br />
            <span style={s.heroHighlight}>Smarter & Faster</span>
          </h1>
          <p style={s.heroDesc}>
            A complete school management system for administrators, teachers, and students.
            Track attendance, manage grades, and monitor performance all in one platform.
          </p>
          <div style={s.heroBtns}>
            <button style={s.heroBtnPrimary} onClick={() => navigate('/login')}>
              Get Started →
            </button>
            <a href="#features" style={s.heroBtnSecondary}>Learn More</a>
          </div>
        </div>
        <div style={s.heroImage}>
          <div style={s.heroCard}>
            <div style={s.heroCardHeader}>📊 School Overview</div>
            {[
              { label: 'Total Students',   val: '1', color: '#f97316' },
              { label: 'Active Teachers',  val: '2',  color: '#8b5cf6' },
              { label: 'Classes Today',    val: '2',  color: '#22d3ee' },
              { label: 'Attendance Rate',  val: '100%', color: '#10b981' },
            ].map((item) => (
              <div key={item.label} style={s.heroStat}>
                <span style={s.heroStatLabel}>{item.label}</span>
                <span style={{ ...s.heroStatVal, color: item.color }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={s.statsBar}>
        {stats.map((st) => (
          <div key={st.label} style={s.statItem}>
            <div style={s.statValue}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.sectionBadge}>Features</div>
          <h2 style={s.sectionTitle}>Everything You Need</h2>
          <p style={s.sectionDesc}>Built for modern schools with powerful tools for every role.</p>
        </div>
        <div style={s.featGrid}>
          {features.map((f) => (
            <div key={f.title} style={s.featCard}>
              <div style={s.featIcon}>{f.icon}</div>
              <h3 style={s.featTitle}>{f.title}</h3>
              <p style={s.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles section */}
      <section id="about" style={{ ...s.section, background: '#f8fafc' }}>
        <div style={s.sectionHeader}>
          <div style={s.sectionBadge}>Who Is It For?</div>
          <h2 style={s.sectionTitle}>Built for Every Role</h2>
        </div>
        <div style={s.rolesGrid}>
          {[
            { icon: '⚙️', role: 'Admin', color: '#f97316', bg: '#fff7ed', desc: 'Full control over the entire system. Manage users, classes, reports, and settings.', perks: ['Manage all students & teachers', 'Create and assign classes', 'View all reports', 'Export data'] },
            { icon: '👨‍🏫', role: 'Teacher', color: '#8b5cf6', bg: '#f5f3ff', desc: 'Manage your classes, mark attendance, and enter student grades easily.', perks: ['View assigned classes', 'Mark attendance', 'Enter grades', 'View student list'] },
            { icon: '🎓', role: 'Student', color: '#10b981', bg: '#ecfdf5', desc: 'Track your own attendance, view grades, and stay updated on your progress.', perks: ['View my attendance', 'Check my grades', 'My subject list', 'Update profile'] },
          ].map((r) => (
            <div key={r.role} style={{ ...s.roleCard, background: r.bg, borderTop: `4px solid ${r.color}` }}>
              <div style={{ ...s.roleIcon, color: r.color }}>{r.icon}</div>
              <h3 style={{ ...s.roleTitle, color: r.color }}>{r.role}</h3>
              <p style={s.roleDesc}>{r.desc}</p>
              <ul style={s.rolePerks}>
                {r.perks.map((p) => <li key={p} style={{ ...s.rolePerk, color: r.color }}>✓ <span style={{ color: '#374151' }}>{p}</span></li>)}
              </ul>
              <button style={{ ...s.roleBtn, background: r.color }} onClick={() => navigate('/login')}>
                Login as {r.role}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.sectionBadge}>Contact</div>
          <h2 style={s.sectionTitle}>Get In Touch</h2>
          <p style={s.sectionDesc}>Have questions? We're here to help.</p>
        </div>
        <div style={s.contactGrid}>
          {[
            { icon: '📧', label: 'Email',    val: 'info@schoolsystem.edu' },
            { icon: '📱', label: 'Phone',    val: '+855 12 345 678' },
            { icon: '📍', label: 'Address',  val: 'Phnom Penh, Cambodia' },
            { icon: '🕐', label: 'Hours',    val: 'Mon-Fri, 7AM - 5PM' },
          ].map((c) => (
            <div key={c.label} style={s.contactCard}>
              <div style={s.contactIcon}>{c.icon}</div>
              <div style={s.contactLabel}>{c.label}</div>
              <div style={s.contactVal}>{c.val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerContent}>
          <div style={s.footerBrand}>
            <span style={s.footerLogo}>🏫</span>
            <span style={s.footerName}>School System</span>
          </div>
          <div style={s.footerText}>© 2026 School Management System. Built with ❤️ for education.</div>
        </div>
      </footer>
    </div>
  );
}

const s = {
  page:          { fontFamily: 'Inter, -apple-system, sans-serif', color: '#1e293b' },
  nav:           { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 4rem', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 },
  navBrand:      { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  navLogo:       { width: '36px', height: '36px', background: 'linear-gradient(135deg,#f97316,#fb923c)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' },
  navName:       { fontWeight: '800', fontSize: '1.1rem', color: '#1e293b' },
  navLinks:      { display: 'flex', alignItems: 'center', gap: '2rem' },
  navLink:       { color: '#64748b', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' },
  loginBtn:      { background: 'linear-gradient(135deg,#f97316,#fb923c)', color: '#fff', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  hero:          { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5rem 4rem', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', gap: '3rem' },
  heroContent:   { flex: 1, maxWidth: '560px' },
  heroBadge:     { display: 'inline-block', background: 'rgba(249,115,22,0.2)', color: '#fb923c', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' },
  heroTitle:     { fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' },
  heroHighlight: { color: '#f97316' },
  heroDesc:      { color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' },
  heroBtns:      { display: 'flex', gap: '1rem', alignItems: 'center' },
  heroBtnPrimary: { background: 'linear-gradient(135deg,#f97316,#fb923c)', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: '10px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' },
  heroBtnSecondary: { color: '#94a3b8', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' },
  heroImage:     { flex: 1, display: 'flex', justifyContent: 'center' },
  heroCard:      { background: '#fff', borderRadius: '20px', padding: '1.75rem', width: '280px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  heroCardHeader: { fontWeight: '700', fontSize: '0.95rem', color: '#1e293b', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' },
  heroStat:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid #f8fafc' },
  heroStatLabel: { fontSize: '0.85rem', color: '#64748b' },
  heroStatVal:   { fontSize: '1.1rem', fontWeight: '800' },
  statsBar:      { display: 'flex', justifyContent: 'center', gap: '4rem', padding: '2.5rem', background: '#f97316' },
  statItem:      { textAlign: 'center', color: '#fff' },
  statValue:     { fontSize: '2rem', fontWeight: '900' },
  statLabel:     { fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' },
  section:       { padding: '5rem 4rem' },
  sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
  sectionBadge:  { display: 'inline-block', background: '#fff7ed', color: '#f97316', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.75rem' },
  sectionTitle:  { fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.75rem' },
  sectionDesc:   { color: '#64748b', fontSize: '1rem' },
  featGrid:      { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },
  featCard:      { background: '#fff', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9' },
  featIcon:      { fontSize: '2rem', marginBottom: '1rem' },
  featTitle:     { fontWeight: '700', fontSize: '1rem', color: '#1e293b', marginBottom: '0.5rem' },
  featDesc:      { color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 },
  rolesGrid:     { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },
  roleCard:      { borderRadius: '16px', padding: '2rem' },
  roleIcon:      { fontSize: '2.5rem', marginBottom: '0.75rem' },
  roleTitle:     { fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' },
  roleDesc:      { color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' },
  rolePerks:     { listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  rolePerk:      { fontSize: '0.875rem', fontWeight: '600', display: 'flex', gap: '0.4rem' },
  roleBtn:       { color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', width: '100%' },
  contactGrid:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' },
  contactCard:   { background: '#fff', borderRadius: '16px', padding: '1.75rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
  contactIcon:   { fontSize: '2rem', marginBottom: '0.75rem' },
  contactLabel:  { fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' },
  contactVal:    { fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' },
  footer:        { background: '#1e293b', padding: '2rem 4rem' },
  footerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerBrand:   { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  footerLogo:    { fontSize: '1.3rem' },
  footerName:    { fontWeight: '700', color: '#fff', fontSize: '0.95rem' },
  footerText:    { color: '#64748b', fontSize: '0.85rem' },
};