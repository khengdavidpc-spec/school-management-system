import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function StudentDashboard() {
  const [grades, setGrades]         = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [myClass, setMyClass]       = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

useEffect(() => {
    const load = async () => {
      try {
        const [rg, ra, rs, rc] = await Promise.all([
          api.get('/grades'),
          api.get('/attendance'),
          api.get('/students'),
          api.get('/classes'),
        ]);
        const me = rs.data.find((s) => s.email?.toLowerCase() === user.email?.toLowerCase());
        setGrades(rg.data.slice(0, 5));
        setAttendance(ra.data);
        if (me?.classId) {
          setMyClass(rc.data.find((c) => c.id === me.classId));
        }
      } catch {}
    };
    load();
  }, []);

  const present = attendance.filter((r) => r.status === 'present').length;
  const total   = attendance.length;
  const pct     = total > 0 ? Math.round((present / total) * 100) : 0;
  const avgScore = grades.length > 0 ? Math.round(grades.reduce((a, g) => a + g.score, 0) / grades.length) : 0;

  const getGL = (score) => {
    if (score >= 90) return { l: 'A', c: '#10b981', bg: '#d1fae5' };
    if (score >= 80) return { l: 'B', c: '#3b82f6', bg: '#dbeafe' };
    if (score >= 70) return { l: 'C', c: '#f59e0b', bg: '#fef3c7' };
    if (score >= 60) return { l: 'D', c: '#f97316', bg: '#fff7ed' };
    return { l: 'F', c: '#ef4444', bg: '#fef2f2' };
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>My Dashboard</h1>
          <p style={s.sub}>Welcome back, <strong>{user.name}</strong> 👋</p>
        </div>
        <div style={s.dateBox}>
          <div style={s.dateDay}>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
          <div style={s.dateVal}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      <div style={s.cardGrid}>
        {/* Attendance card */}
        <div style={s.attCard}>
          <div style={s.attTop}>
            <div>
              <div style={s.attPct}>{pct}%</div>
              <div style={s.attLabel}>Attendance Rate</div>
            </div>
            <div style={s.attCircle}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8"/>
                <circle cx="40" cy="40" r="34" fill="none" stroke="#fff" strokeWidth="8"
                  strokeDasharray={`${pct * 2.136} 213.6`} strokeLinecap="round" transform="rotate(-90 40 40)"/>
              </svg>
              <div style={s.attCircleText}>{pct}%</div>
            </div>
          </div>
          <div style={s.attStats}>
            <div><span style={s.attStatNum}>{present}</span><span style={s.attStatLabel}>Present</span></div>
            <div><span style={s.attStatNum}>{attendance.filter((r) => r.status === 'absent').length}</span><span style={s.attStatLabel}>Absent</span></div>
            <div><span style={s.attStatNum}>{attendance.filter((r) => r.status === 'late').length}</span><span style={s.attStatLabel}>Late</span></div>
          </div>
        </div>

        {/* Grade card */}
        <div style={s.gradeCard}>
          <div style={s.gradeTop}>
            <div style={s.gradeAvg}>{avgScore}</div>
            <div style={s.gradeLabel}>Average Score</div>
            {avgScore > 0 && (() => { const g = getGL(avgScore); return <span style={{ ...s.gradeB, background: g.bg, color: g.c }}>{g.l}</span>; })()}
          </div>
          <div style={s.gradeInfo}>
            <div style={s.gradeInfoRow}><span>Total Grades</span><span style={s.gradeInfoVal}>{grades.length}</span></div>
            <div style={s.gradeInfoRow}><span>Best Score</span><span style={s.gradeInfoVal}>{grades.length > 0 ? Math.max(...grades.map((g) => g.score)) : '—'}</span></div>
          </div>
        </div>

        {/* Class card */}
        <div style={s.classCard}>
          <div style={s.classIcon}>📚</div>
          <div style={s.className}>{myClass?.name || 'No Class Assigned'}</div>
          {myClass && (
            <>
              <div style={s.classGrade}>{myClass.grade}</div>
              <div style={s.classSubject}>{myClass.subject}</div>
            </>
          )}
          <a href="/student/attendance" style={s.classBtn}>View Attendance →</a>
        </div>

        {/* Quick links */}
        <div style={s.linksCard}>
          <div style={s.linksTitle}>Quick Links</div>
          {[
            { href: '/student/attendance', icon: '📋', label: 'My Attendance', color: '#10b981' },
            { href: '/student/grades',     icon: '📊', label: 'My Grades',     color: '#8b5cf6' },
            { href: '/student/profile',    icon: '👤', label: 'My Profile',    color: '#f97316' },
          ].map((l) => (
            <a key={l.label} href={l.href} style={s.linkItem}>
              <span style={{ ...s.linkIcon, color: l.color }}>{l.icon}</span>
              <span style={s.linkLabel}>{l.label}</span>
              <span style={{ color: '#94a3b8' }}>→</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent grades */}
      {grades.length > 0 && (
        <div style={s.panel}>
          <div style={s.panelHeader}>
            <div style={s.panelTitle}>📊 Recent Grades</div>
            <a href="/student/grades" style={s.viewAll}>View all →</a>
          </div>
          <div style={s.gradeList}>
            {grades.map((g) => { const gl = getGL(g.score); return (
              <div key={g.id} style={s.gradeRow}>
                <div style={s.gradeSubject}>{g.subject}</div>
                <div style={s.gradeTerm}>{g.term}</div>
                <div style={s.gradeScore}>{g.score}/100</div>
                <span style={{ ...s.gradeB, background: gl.bg, color: gl.c }}>{gl.l}</span>
              </div>
            ); })}
          </div>
        </div>
      )}
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
  attCard:      { background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '18px', padding: '1.5rem', color: '#fff', gridColumn: '1 / 2' },
  attTop:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  attPct:       { fontSize: '2.5rem', fontWeight: '900', lineHeight: 1 },
  attLabel:     { fontSize: '0.85rem', opacity: 0.9 },
  attCircle:    { position: 'relative', width: '80px', height: '80px' },
  attCircleText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '0.78rem', fontWeight: '700', color: '#fff' },
  attStats:     { display: 'flex', justifyContent: 'space-between' },
  attStatNum:   { display: 'block', fontSize: '1.2rem', fontWeight: '700' },
  attStatLabel: { display: 'block', fontSize: '0.72rem', opacity: 0.85 },
  gradeCard:    { background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', borderRadius: '18px', padding: '1.5rem', color: '#fff' },
  gradeTop:     { marginBottom: '1rem' },
  gradeAvg:     { fontSize: '2.5rem', fontWeight: '900', lineHeight: 1, marginBottom: '0.3rem' },
  gradeLabel:   { fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' },
  gradeB:       { padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700', display: 'inline-block' },
  gradeInfo:    { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  gradeInfoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', opacity: 0.9 },
  gradeInfoVal: { fontWeight: '700' },
  classCard:    { background: '#fff', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.4rem' },
  classIcon:    { fontSize: '2.5rem' },
  className:    { fontWeight: '700', fontSize: '1rem', color: '#1e293b' },
  classGrade:   { fontSize: '0.85rem', color: '#64748b' },
  classSubject: { fontSize: '0.82rem', color: '#94a3b8' },
  classBtn:     { marginTop: '0.5rem', color: '#f97316', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none' },
  linksCard:    { background: '#fff', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
  linksTitle:   { fontWeight: '700', color: '#1e293b', marginBottom: '1rem', fontSize: '0.95rem' },
  linkItem:     { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', background: '#f8fafc', borderRadius: '10px', textDecoration: 'none', marginBottom: '0.5rem' },
  linkIcon:     { fontSize: '1.1rem' },
  linkLabel:    { flex: 1, fontWeight: '500', color: '#1e293b', fontSize: '0.875rem' },
  panel:        { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  panelHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  panelTitle:   { fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' },
  viewAll:      { fontSize: '0.8rem', color: '#8b5cf6', fontWeight: '600', textDecoration: 'none' },
  gradeList:    { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  gradeRow:     { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.65rem 0.75rem', background: '#f8fafc', borderRadius: '8px' },
  gradeSubject: { flex: 1, fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' },
  gradeTerm:    { fontSize: '0.78rem', color: '#94a3b8' },
  gradeScore:   { fontWeight: '700', color: '#1e293b' },
};
