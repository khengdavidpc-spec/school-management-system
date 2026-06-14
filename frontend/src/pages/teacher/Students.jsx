import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses]   = useState([]);
  const [search, setSearch]     = useState('');
  const [classFilter, setClassFilter] = useState('all');

  useEffect(() => {
  const load = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [rs, rc, rt] = await Promise.all([api.get('/students'), api.get('/classes'), api.get('/teachers')]);
    
    // Find this teacher
    const me = rt.data.find((t) => t.firstName + ' ' + t.lastName === user.name);
    
    // Find my classes
    const myClasses = rc.data.filter((c) => me && c.teacherId === me.id);
    const myClassIds = myClasses.map((c) => c.id);
    
    // Only show students in my classes
    const myStudents = rs.data.filter((s) => myClassIds.includes(s.classId));
    
    setStudents(myStudents);
    setClasses(myClasses);
  };
  load();
}, []);

  const filtered = students
    .filter((s) => classFilter === 'all' || s.classId === classFilter)
    .filter((s) => `${s.firstName} ${s.lastName} ${s.grade}`.toLowerCase().includes(search.toLowerCase()));

  const getClass = (id) => classes.find((c) => c.id === id);
  const COLORS = ['#8b5cf6','#f97316','#22d3ee','#10b981','#ef4444','#f59e0b'];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div><h1 style={s.title}>Students</h1><p style={s.sub}>{students.length} total students</p></div>
      </div>

      <div style={s.tableCard}>
        <div style={s.tableTop}>
          <div>
            <span style={s.tableTitle}>Student List</span>
            <div style={s.filterRow}>
              <button style={{ ...s.chip, ...(classFilter === 'all' ? s.chipActive : {}) }} onClick={() => setClassFilter('all')}>All Classes</button>
              {classes.map((c) => <button key={c.id} style={{ ...s.chip, ...(classFilter === c.id ? s.chipActive : {}) }} onClick={() => setClassFilter(c.id)}>{c.name}</button>)}
            </div>
          </div>
          <input style={s.search} placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <table style={s.table}>
          <thead><tr style={s.thead}>
            <th style={s.th}>#</th><th style={s.th}>Student</th><th style={s.th}>Sex</th><th style={s.th}>Grade</th><th style={s.th}>Class</th><th style={s.th}>Phone</th><th style={s.th}>Status</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan="7" style={s.empty}>No students found</td></tr>
              : filtered.map((st, i) => {
                const cls = getClass(st.classId);
                return (
                  <tr key={st.id} style={s.tr}>
                    <td style={{ ...s.td, color: '#94a3b8', fontSize: '0.78rem' }}>{i + 1}</td>
                    <td style={s.td}>
                      <div style={s.nameCell}>
                        <div style={{ ...s.avatar, background: COLORS[i % COLORS.length] }}>{st.firstName?.charAt(0)}{st.lastName?.charAt(0)}</div>
                        <div><div style={s.name}>{st.firstName} {st.lastName}</div><div style={s.nameId}>ID: {st.id?.slice(0,8)}...</div></div>
                      </div>
                    </td>
                    <td style={s.td}>{st.sex || '—'}</td>
                    <td style={s.td}><span style={s.gradeBadge}>{st.grade || 'N/A'}</span></td>
                    <td style={s.td}>{cls ? <span style={s.classBadge}>{cls.name}</span> : '—'}</td>
                    <td style={s.td}>{st.phone || '—'}</td>
                    <td style={s.td}><span style={st.status === 'active' ? s.badgeGreen : s.badgeGray}>{st.status}</span></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div style={s.tableFooter}>Showing {filtered.length} of {students.length} students</div>
      </div>
    </div>
  );
}

const s = {
  page:       { padding: '2rem 2.5rem' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  title:      { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub:        { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  tableCard:  { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' },
  tableTop:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', gap: '1rem' },
  tableTitle: { fontWeight: '700', color: '#1e293b', fontSize: '1rem', display: 'block', marginBottom: '0.75rem' },
  filterRow:  { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  chip:       { background: '#f1f5f9', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', color: '#64748b', fontWeight: '500', cursor: 'pointer' },
  chipActive: { background: '#8b5cf6', color: '#fff', fontWeight: '600' },
  search:     { padding: '0.5rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', width: '220px', outline: 'none', flexShrink: 0 },
  table:      { width: '100%', borderCollapse: 'collapse' },
  thead:      { background: '#f8fafc' },
  th:         { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tr:         { borderBottom: '1px solid #f8fafc' },
  td:         { padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#374151' },
  nameCell:   { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar:     { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 },
  name:       { fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' },
  nameId:     { fontSize: '0.72rem', color: '#94a3b8' },
  gradeBadge: { background: '#fff7ed', color: '#f97316', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  classBadge: { background: '#ede9fe', color: '#7c3aed', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  badgeGreen: { background: '#d1fae5', color: '#065f46', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  badgeGray:  { background: '#f1f5f9', color: '#64748b', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  empty:      { textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.9rem' },
  tableFooter: { padding: '0.85rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
};