import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function TeacherClasses() {
  const [classes, setClasses]   = useState([]);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);

useEffect(() => {
    const load = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const [rc, rs] = await Promise.all([api.get('/classes'), api.get('/students')]);
      const allClasses = rc.data;
      const myClasses = rc.data.filter((c) => {
      const teacherName = `${c.teacher?.firstName || ''} ${c.teacher?.lastName || ''}`.trim();
      const userName = user.name || '';
      return c.teacherId && teacherName && userName && 
      teacherName.toLowerCase() === userName.toLowerCase();
});
      setClasses(myClasses);
      setStudents(rs.data);
    };
    load();
  }, []);

  const COLORS = ['#8b5cf6','#f97316','#22d3ee','#10b981','#ef4444','#f59e0b'];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div><h1 style={s.title}>My Classes</h1><p style={s.sub}>{classes.length} classes assigned</p></div>
      </div>

      <div style={s.twoCol}>
        <div style={s.grid}>
          {classes.length === 0
            ? <div style={s.empty}>No classes assigned yet.</div>
            : classes.map((c, i) => {
              const count = c.students?.length || 0;
              const color = COLORS[i % COLORS.length];
              return (
                <div key={c.id} style={{ ...s.card, borderTop: `4px solid ${color}`, ...(selected?.id === c.id ? s.cardSelected : {}) }}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}>
                  <div style={{ ...s.cardIcon, background: color + '18', color }}>{c.subject?.charAt(0) || '📚'}</div>
                  <div style={s.cardName}>{c.name}</div>
                  <div style={s.cardGrade}>{c.grade} • {c.subject}</div>
                  <div style={s.cardStats}>
                    <div style={s.stat}><span style={{ ...s.statNum, color }}>{count}</span><span style={s.statLabel}>Students</span></div>
                    <div style={s.statDiv}/>
                    <div style={s.stat}><span style={{ ...s.statNum, color }}>{c.capacity}</span><span style={s.statLabel}>Capacity</span></div>
                  </div>
                  <div style={s.progressBg}><div style={{ ...s.progressFill, width: `${Math.min((count/(c.capacity||1))*100,100)}%`, background: color }}/></div>
                </div>
              );
            })}
        </div>

        {selected && (
          <div style={s.detail}>
            <div style={s.detailHeader}>
              <div style={s.detailTitle}>{selected.name}</div>
              <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={s.detailInfo}>
              <div style={s.dRow}><span style={s.dKey}>Grade</span><span style={s.dVal}>{selected.grade}</span></div>
              <div style={s.dRow}><span style={s.dKey}>Subject</span><span style={s.dVal}>{selected.subject}</span></div>
              <div style={s.dRow}><span style={s.dKey}>Students</span><span style={s.dVal}>{selected.students?.length || 0}</span></div>
              <div style={s.dRow}><span style={s.dKey}>Capacity</span><span style={s.dVal}>{selected.capacity}</span></div>
            </div>
            <div style={s.detailSec}>Enrolled Students</div>
            <div style={s.studentList}>
              {!selected.students || selected.students.length === 0
                ? <div style={s.noData}>No students enrolled</div>
                : selected.students.map((st, i) => (
                  <div key={st.id} style={s.studentRow}>
                    <div style={{ ...s.sAvatar, background: COLORS[i % COLORS.length] }}>{st.firstName?.charAt(0)}{st.lastName?.charAt(0)}</div>
                    <div><div style={s.sName}>{st.firstName} {st.lastName}</div><div style={s.sGrade}>{st.grade} {st.sex ? `• ${st.sex}` : ''}</div></div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page:      { padding: '2rem 2.5rem' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title:     { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub:       { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  twoCol:    { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '1rem', flex: 1 },
  card:      { background: '#fff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', cursor: 'pointer', border: '2px solid transparent' },
  cardSelected: { boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '2px solid #8b5cf6' },
  cardIcon:  { width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.85rem' },
  cardName:  { fontWeight: '700', fontSize: '1rem', color: '#1e293b', marginBottom: '0.2rem' },
  cardGrade: { fontSize: '0.8rem', color: '#64748b', marginBottom: '0.85rem' },
  cardStats: { display: 'flex', alignItems: 'center', marginBottom: '0.85rem' },
  stat:      { flex: 1, textAlign: 'center' },
  statNum:   { display: 'block', fontSize: '1.3rem', fontWeight: '800', lineHeight: 1 },
  statLabel: { fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' },
  statDiv:   { width: '1px', height: '30px', background: '#f1f5f9' },
  progressBg: { height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '3px' },
  empty:     { gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#fff', borderRadius: '16px' },
  detail:    { width: '280px', flexShrink: 0, background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', position: 'sticky', top: '1rem' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  detailTitle: { fontWeight: '700', fontSize: '1rem', color: '#1e293b' },
  closeBtn:  { background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#64748b' },
  detailInfo: { background: '#f8fafc', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' },
  dRow:      { display: 'flex', justifyContent: 'space-between' },
  dKey:      { fontSize: '0.78rem', color: '#94a3b8' },
  dVal:      { fontSize: '0.82rem', color: '#1e293b', fontWeight: '600' },
  detailSec: { fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' },
  studentList: { display: 'flex', flexDirection: 'column', gap: '0.55rem', maxHeight: '300px', overflowY: 'auto' },
  studentRow: { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', background: '#f8fafc', borderRadius: '8px' },
  sAvatar:   { width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.7rem', flexShrink: 0 },
  sName:     { fontSize: '0.82rem', fontWeight: '600', color: '#1e293b' },
  sGrade:    { fontSize: '0.72rem', color: '#94a3b8' },
  noData:    { textAlign: 'center', color: '#94a3b8', padding: '1.5rem', fontSize: '0.85rem' },
};