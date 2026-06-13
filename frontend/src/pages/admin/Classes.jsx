import { useEffect, useState } from 'react';
import api from '../../services/api';

const empty = { name: '', grade: '', teacherId: '', capacity: 30, description: ''};

export default function AdminClasses() {
  const [classes, setClasses]   = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      const [rc, rt] = await Promise.all([api.get('/classes'), api.get('/teachers')]);
      setClasses(rc.data); setTeachers(rt.data);
    } catch {}
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/classes/${editId}`, form);
      else await api.post('/classes', form);
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch (err) { setError(err.response?.data?.message || 'Error saving'); }
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, grade: c.grade, teacherId: c.teacherId || '', capacity: c.capacity || 30, description: c.description || '' });
    setEditId(c.id); setShowForm(true); setSelected(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    await api.delete(`/classes/${id}`); load(); setSelected(null);
  };

  const getTeacher = (id) => teachers.find((t) => t.id === id);
  const COLORS = ['#f97316','#8b5cf6','#22d3ee','#10b981','#ef4444','#f59e0b'];

  return (
    <div style={p.page}>
      <div style={p.header}>
        <div><h1 style={p.title}>Classes</h1><p style={p.sub}>{classes.length} classes registered</p></div>
        <button style={p.addBtn} onClick={() => { setShowForm(true); setForm(empty); setEditId(null); setSelected(null); }}>+ Add Class</button>
      </div>

      {showForm && (
        <div style={p.overlay}>
          <div style={p.modal}>
            <div style={p.modalHeader}>
              <h2 style={p.modalTitle}>{editId ? '✏️ Edit Class' : '📚 Create New Class'}</h2>
              <button style={p.closeBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>✕</button>
            </div>
            {error && <div style={p.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={p.formGrid}>
                <div style={{ ...p.field, gridColumn: '1 / -1' }}><label style={p.label}>Class Name <span style={p.req}>*</span></label><input style={p.input} placeholder="e.g. Morning Class A" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div style={p.field}><label style={p.label}>Grade Level <span style={p.req}>*</span></label><input style={p.input} placeholder="e.g. Level 1, Grade 10" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} required /></div>
                <div style={p.field}><label style={p.label}>Capacity</label><input style={p.input} type="number" min="1" max="100" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
                <div style={{ ...p.field, gridColumn: '1 / -1' }}>
                  <label style={p.label}>Assign Teacher</label>
                  <select style={p.input} value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
                    <option value="">Select teacher</option>
                    {teachers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName} — {t.subject}</option>)}
                  </select>
                  {form.teacherId && (() => { const t = getTeacher(form.teacherId); return t ? <div style={p.preview}>👨‍🏫 {t.firstName} {t.lastName} • {t.subject}</div> : null; })()}
                </div>
                <div style={{ ...p.field, gridColumn: '1 / -1' }}><label style={p.label}>Description</label><input style={p.input} placeholder="Optional..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              </div>
              <div style={p.modalFooter}>
                <button type="button" style={p.cancelBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>Cancel</button>
                <button type="submit" style={p.submitBtn}>{editId ? 'Update' : 'Create Class'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={p.twoCol}>
        <div style={p.grid}>
          {classes.length === 0 ? <div style={p.empty}>No classes yet.</div>
            : classes.map((c, i) => {
              const teacher = getTeacher(c.teacherId);
              const count = c.students?.length || 0;
              const color = COLORS[i % COLORS.length];
              const pct = Math.round((count / (c.capacity || 1)) * 100);
              return (
                <div key={c.id} style={{ ...p.card, borderTop: `4px solid ${color}`, ...(selected?.id === c.id ? p.cardSelected : {}) }}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}>
                  <div style={p.cardTop}>
                    <div style={{ ...p.cardIcon, background: color + '18', color }}><span style={{ fontSize: '1.4rem' }}>📚</span></div>
                    <div style={p.cardActions}>
                      <button style={p.iconBtn} onClick={(e) => { e.stopPropagation(); handleEdit(c); }}>✏️</button>
                      <button style={p.iconBtnRed} onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}>🗑️</button>
                    </div>
                  </div>
                  <div style={p.cardName}>{c.name}</div>
                  <div style={p.cardGrade}>{c.grade}</div>
                  {teacher && <div style={p.cardTeacher}>👨‍🏫 {teacher.firstName} {teacher.lastName}</div>}
                  <div style={p.cardStats}>
                    <div style={p.stat}><span style={{ ...p.statNum, color }}>{count}</span><span style={p.statLabel}>Students</span></div>
                    <div style={p.statDiv}/><div style={p.stat}><span style={{ ...p.statNum, color }}>{c.capacity}</span><span style={p.statLabel}>Capacity</span></div>
                    <div style={p.statDiv}/><div style={p.stat}><span style={{ ...p.statNum, color }}>{pct}%</span><span style={p.statLabel}>Filled</span></div>
                  </div>
                  <div style={p.progressBg}><div style={{ ...p.progressFill, width: `${Math.min(pct,100)}%`, background: color }}/></div>
                  <div style={p.progressLabel}>{count}/{c.capacity} enrolled</div>
                </div>
              );
            })}
        </div>

        {selected && (
          <div style={p.detail}>
            <div style={p.detailHeader}><div style={p.detailTitle}>{selected.name}</div><button style={p.closeBtn} onClick={() => setSelected(null)}>✕</button></div>
            <div style={p.detailInfo}>
              <div style={p.dRow}><span style={p.dKey}>Grade</span><span style={p.dVal}>{selected.grade}</span></div>
              <div style={p.dRow}><span style={p.dKey}>Teacher</span><span style={p.dVal}>{(() => { const t = getTeacher(selected.teacherId); return t ? `${t.firstName} ${t.lastName}` : 'Not assigned'; })()}</span></div>
              <div style={p.dRow}><span style={p.dKey}>Capacity</span><span style={p.dVal}>{selected.capacity}</span></div>
              <div style={p.dRow}><span style={p.dKey}>Enrolled</span><span style={p.dVal}>{selected.students?.length || 0}</span></div>
            </div>
            <div style={p.detailSec}>Students ({selected.students?.length || 0})</div>
            <div style={p.studentList}>
              {!selected.students || selected.students.length === 0 ? <div style={p.noData}>No students enrolled</div>
                : selected.students.map((st, i) => (
                  <div key={st.id} style={p.studentRow}>
                    <div style={{ ...p.sAvatar, background: COLORS[i % COLORS.length] }}>{st.firstName?.charAt(0)}{st.lastName?.charAt(0)}</div>
                    <div><div style={p.sName}>{st.firstName} {st.lastName}</div><div style={p.sGrade}>{st.grade} {st.sex ? `• ${st.sex}` : ''}</div></div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const p = {
  page:       { padding: '2rem 2.5rem' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title:      { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub:        { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  addBtn:     { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  overlay:    { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:      { background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' },
  closeBtn:   { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b' },
  formGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  field:      { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label:      { fontSize: '0.82rem', fontWeight: '600', color: '#475569' },
  req:        { color: '#ef4444' },
  input:      { padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', color: '#1e293b', outline: 'none', background: '#fff' },
  preview:    { marginTop: '0.4rem', fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '6px' },
  modalFooter: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  cancelBtn:  { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  submitBtn:  { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', padding: '0.7rem 1.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  error:      { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid #fecaca' },
  twoCol:     { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '1rem', flex: 1 },
  card:       { background: '#fff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', cursor: 'pointer', border: '2px solid transparent' },
  cardSelected: { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' },
  cardTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' },
  cardIcon:   { width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardActions: { display: 'flex', gap: '0.35rem' },
  iconBtn:    { background: '#f1f5f9', border: 'none', padding: '0.3rem 0.4rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' },
  iconBtnRed: { background: '#fef2f2', border: 'none', padding: '0.3rem 0.4rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' },
  cardName:   { fontWeight: '700', fontSize: '1rem', color: '#1e293b', marginBottom: '0.2rem' },
  cardGrade:  { fontSize: '0.8rem', color: '#64748b', marginBottom: '0.35rem' },
  cardTeacher: { fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.85rem' },
  cardStats:  { display: 'flex', alignItems: 'center', marginBottom: '0.85rem' },
  stat:       { flex: 1, textAlign: 'center' },
  statNum:    { display: 'block', fontSize: '1.3rem', fontWeight: '800', lineHeight: 1 },
  statLabel:  { fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' },
  statDiv:    { width: '1px', height: '30px', background: '#f1f5f9' },
  progressBg: { height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.4rem' },
  progressFill: { height: '100%', borderRadius: '3px' },
  progressLabel: { fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' },
  empty:      { gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#fff', borderRadius: '16px' },
  detail:     { width: '280px', flexShrink: 0, background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', position: 'sticky', top: '1rem' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  detailTitle: { fontWeight: '700', fontSize: '1rem', color: '#1e293b' },
  detailInfo: { background: '#f8fafc', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' },
  dRow:       { display: 'flex', justifyContent: 'space-between' },
  dKey:       { fontSize: '0.78rem', color: '#94a3b8' },
  dVal:       { fontSize: '0.82rem', color: '#1e293b', fontWeight: '600' },
  detailSec:  { fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' },
  studentList: { display: 'flex', flexDirection: 'column', gap: '0.55rem', maxHeight: '300px', overflowY: 'auto' },
  studentRow: { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', background: '#f8fafc', borderRadius: '8px' },
  sAvatar:    { width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.7rem', flexShrink: 0 },
  sName:      { fontSize: '0.82rem', fontWeight: '600', color: '#1e293b' },
  sGrade:     { fontSize: '0.72rem', color: '#94a3b8' },
  noData:     { textAlign: 'center', color: '#94a3b8', padding: '1.5rem', fontSize: '0.85rem' },
};