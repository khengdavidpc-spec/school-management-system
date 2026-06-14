import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function StudentGrades() {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
  const load = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const [rg, rs] = await Promise.all([api.get('/grades'), api.get('/students')]);
      const me = rs.data.find((s) => s.email?.toLowerCase() === user.email?.toLowerCase());
      if (me) {
        setGrades(rg.data.filter((g) => g.studentId === me.id));
      }
    } catch {}
  };
  load();
}, []);

  const getGL = (score) => {
    if (score >= 90) return { l: 'A', c: '#10b981', bg: '#d1fae5', label: 'Excellent' };
    if (score >= 80) return { l: 'B', c: '#3b82f6', bg: '#dbeafe', label: 'Good' };
    if (score >= 70) return { l: 'C', c: '#f59e0b', bg: '#fef3c7', label: 'Average' };
    if (score >= 60) return { l: 'D', c: '#f97316', bg: '#fff7ed', label: 'Below Avg' };
    return { l: 'F', c: '#ef4444', bg: '#fef2f2', label: 'Fail' };
  };

  const avg = grades.length > 0 ? Math.round(grades.reduce((a, g) => a + g.score, 0) / grades.length) : 0;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>My Grades</h1>
        <p style={s.sub}>{grades.length} records • Average: {avg}%</p>
      </div>

      {avg > 0 && (
        <div style={s.avgCard}>
          <div style={s.avgLeft}>
            <div style={s.avgNum}>{avg}</div>
            <div style={s.avgLabel}>Overall Average Score</div>
          </div>
          <div style={{ ...s.avgGrade, ...(() => { const g = getGL(avg); return { background: g.bg, color: g.c }; })() }}>
            {(() => { const g = getGL(avg); return `${g.l} — ${g.label}`; })()}
          </div>
        </div>
      )}

      <div style={s.tableCard}>
        <div style={s.tableTop}><span style={s.tableTitle}>My Grade Records</span></div>
        <table style={s.table}>
          <thead><tr style={s.thead}><th style={s.th}>#</th><th style={s.th}>Subject</th><th style={s.th}>Term</th><th style={s.th}>Score</th><th style={s.th}>Grade</th><th style={s.th}>Notes</th></tr></thead>
          <tbody>
            {grades.length === 0
              ? <tr><td colSpan="6" style={s.empty}>No grades recorded yet</td></tr>
              : grades.map((g, i) => { const gl = getGL(g.score); return (
                <tr key={g.id} style={s.tr}>
                  <td style={{ ...s.td, color: '#94a3b8', fontSize: '0.78rem' }}>{i + 1}</td>
                  <td style={s.td}><span style={s.subBadge}>{g.subject}</span></td>
                  <td style={s.td}>{g.term}</td>
                  <td style={s.td}><strong style={{ fontSize: '1.1rem' }}>{g.score}</strong>/100</td>
                  <td style={s.td}><span style={{ ...s.gradeB, background: gl.bg, color: gl.c }}>{gl.l} — {gl.label}</span></td>
                  <td style={s.td}>{g.notes || '—'}</td>
                </tr>
              ); })}
          </tbody>
        </table>
        <div style={s.tableFooter}>{grades.length} grade records</div>
      </div>
    </div>
  );
}

const s = {
  page:      { padding: '2rem 2.5rem' },
  header:    { marginBottom: '1.5rem' },
  title:     { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub:       { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  avgCard:   { background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', borderRadius: '16px', padding: '1.5rem 2rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  avgLeft:   {},
  avgNum:    { fontSize: '3rem', fontWeight: '900', lineHeight: 1 },
  avgLabel:  { opacity: 0.9, fontSize: '0.9rem' },
  avgGrade:  { fontSize: '1rem', fontWeight: '700', padding: '0.5rem 1.25rem', borderRadius: '20px' },
  tableCard: { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' },
  tableTop:  { padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' },
  tableTitle: { fontWeight: '700', color: '#1e293b', fontSize: '1rem' },
  table:     { width: '100%', borderCollapse: 'collapse' },
  thead:     { background: '#f8fafc' },
  th:        { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tr:        { borderBottom: '1px solid #f8fafc' },
  td:        { padding: '0.9rem 1.25rem', fontSize: '0.875rem', color: '#374151' },
  subBadge:  { background: '#ede9fe', color: '#7c3aed', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  gradeB:    { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700' },
  empty:     { textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.9rem' },
  tableFooter: { padding: '0.85rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
};
