import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function TeacherDashboard() {
  const [stats, setStats] = useState({ classes: 0, students: 0, attendance: 0, grades: 0 });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const load = async () => {
      try {
        const [rc, rs, ra, rg] = await Promise.all([
          api.get('/classes'), api.get('/students'),
          api.get('/attendance'), api.get('/grades'),
        ]);
        setStats({ classes: rc.data.length, students: rs.data.length, attendance: ra.data.length, grades: rg.data.length });
      } catch {}
    };
    load();
  }, []);

  const cards = [
    { label: 'My Classes',         value: stats.classes,    icon: '📚', color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Total Students',     value: stats.students,   icon: '🎓', color: '#f97316', bg: '#fff7ed' },
    { label: 'Attendance Marked',  value: stats.attendance, icon: '📋', color: '#10b981', bg: '#ecfdf5' },
    { label: 'Grades Entered',     value: stats.grades,     icon: '📊', color: '#22d3ee', bg: '#ecfeff' },
  ];

  const quickActions = [
    { label: 'Mark Attendance', icon: '✅', href: '/teacher/attendance', color: '#10b981' },
    { label: 'Enter Grades',    icon: '📊', href: '/teacher/grades',     color: '#8b5cf6' },
    { label: 'View Classes',    icon: '📚', href: '/teacher/classes',    color: '#f97316' },
    { label: 'View Students',   icon: '🎓', href: '/teacher/students',   color: '#22d3ee' },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Teacher Dashboard</h1>
          <p style={s.sub}>Welcome back, <strong>{user.name}</strong> 👋</p>
        </div>
        <div style={s.dateBox}>
          <div style={s.dateDay}>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
          <div style={s.dateVal}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      <div style={s.cardGrid}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...s.card, background: c.bg, borderLeft: `4px solid ${c.color}` }}>
            <div style={s.cardTop}>
              <div style={{ ...s.cardIcon, color: c.color }}>{c.icon}</div>
              <div style={{ ...s.cardValue, color: c.color }}>{c.value}</div>
            </div>
            <div style={s.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={s.row}>
        <div style={s.panel}>
          <div style={s.panelTitle}>⚡ Quick Actions</div>
          <div style={s.actionGrid}>
            {quickActions.map((a) => (
              <a key={a.label} href={a.href} style={{ ...s.actionCard, borderTop: `3px solid ${a.color}` }}>
                <span style={{ fontSize: '1.75rem' }}>{a.icon}</span>
                <span style={s.actionLabel}>{a.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div style={s.panel}>
          <div style={s.panelTitle}>📅 Today's Schedule</div>
          <div style={s.scheduleList}>
            {[
              { time: '7:00 AM',  subject: 'Math',     class: 'Grade 10A', status: 'done' },
              { time: '9:00 AM',  subject: 'English',  class: 'Grade 9B',  status: 'current' },
              { time: '11:00 AM', subject: 'Computer', class: 'Grade 11C', status: 'upcoming' },
              { time: '2:00 PM',  subject: 'Math',     class: 'Grade 8A',  status: 'upcoming' },
            ].map((item, i) => (
              <div key={i} style={s.scheduleItem}>
                <div style={s.scheduleTime}>{item.time}</div>
                <div style={s.scheduleDot(item.status === 'done' ? '#94a3b8' : item.status === 'current' ? '#10b981' : '#e2e8f0')}/>
                <div style={s.scheduleInfo}>
                  <div style={s.scheduleSubject}>{item.subject}</div>
                  <div style={s.scheduleClass}>{item.class}</div>
                </div>
                <span style={{ ...s.scheduleBadge, background: item.status === 'done' ? '#f1f5f9' : item.status === 'current' ? '#d1fae5' : '#f8fafc', color: item.status === 'done' ? '#64748b' : item.status === 'current' ? '#10b981' : '#94a3b8' }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:         { padding: '2rem 2.5rem' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  title:        { fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.4rem' },
  sub:          { color: '#64748b', fontSize: '0.95rem' },
  dateBox:      { background: '#fff', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'right', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  dateDay:      { fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600' },
  dateVal:      { fontSize: '0.9rem', color: '#1e293b', fontWeight: '700', marginTop: '2px' },
  cardGrid:     { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' },
  card:         { borderRadius: '14px', padding: '1.25rem 1.5rem' },
  cardTop:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  cardIcon:     { fontSize: '1.75rem' },
  cardValue:    { fontSize: '2.2rem', fontWeight: '900', lineHeight: 1 },
  cardLabel:    { fontSize: '0.85rem', color: '#64748b', fontWeight: '500' },
  row:          { display: 'flex', gap: '1.25rem' },
  panel:        { flex: 1, background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  panelTitle:   { fontWeight: '700', color: '#1e293b', fontSize: '0.95rem', marginBottom: '1.25rem' },
  actionGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' },
  actionCard:   { background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', border: '1px solid #f1f5f9' },
  actionLabel:  { fontWeight: '600', color: '#1e293b', fontSize: '0.85rem', textAlign: 'center' },
  scheduleList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  scheduleItem: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  scheduleTime: { fontSize: '0.78rem', color: '#94a3b8', width: '65px', flexShrink: 0 },
  scheduleDot:  (c) => ({ width: '10px', height: '10px', borderRadius: '50%', background: c, flexShrink: 0 }),
  scheduleInfo: { flex: 1 },
  scheduleSubject: { fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' },
  scheduleClass:   { fontSize: '0.75rem', color: '#94a3b8' },
  scheduleBadge:   { fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '20px', textTransform: 'capitalize' },
};