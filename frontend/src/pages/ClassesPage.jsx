import { useEffect, useState } from 'react';
import api from '../services/api';

const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'];
const empty = { name: '', grade: '', teacherId: '', capacity: 30, description: '' };

export default function ClassesPage() {
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
      setClasses(rc.data);
      setTeachers(rt.data);
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
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Classes</h1>
          <p style={s.sub}>{classes.length} classes registered</p>
        </div>
        <button style={s.addBtn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); setSelected(null); }}>
          {showForm ? '✕ Cancel' : '+ Add Class'}
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editId ? '✏️ Edit Class' : '📚 Create New Class'}</h2>
              <button style={s.closeBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>✕</button>
            </div>

            {error && <div style={s.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={s.formGrid}>
                <div style={{ ...s.field, gridColumn: '1 / -1' }}>
                  <label style={s.label}>Class Name <span style={s.req}>*</span></label>
                  <input style={s.input} placeholder="e.g. Morning Class A" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Grade Level <span style={s.req}>*</span></label>
                  <select style={s.input} value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} required>
                    <option value="">Select grade</option>
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Total Capacity</label>
                  <input style={s.input} type="number" min="1" max="100" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="30" />
                </div>
                <div style={{ ...s.field, gridColumn: '1 / -1' }}>
                  <label style={s.label}>Assign Teacher</label>
                  <select style={s.input} value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
                    <option value="">Select teacher (optional)</option>
                    {teachers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName} — {t.subject}</option>)}
                  </select>
                  {form.teacherId && (
                    <div style={s.teacherPreview}>
                      👨‍🏫 {(() => { const t = getTeacher(form.teacherId); return t ? `${t.firstName} ${t.lastName} • ${t.subject}` : ''; })()}
                    </div>
                  )}
                </div>
                <div style={{ ...s.field, gridColumn: '1 / -1' }}>
                  <label style={s.label}>Description</label>
                  <input style={s.input} placeholder="Optional class description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>Cancel</button>
                <button type="submit" style={s.submitBtn}>{editId ? 'Update Class' : 'Create Class'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={s.twoCol}>
        <div style={s.classGrid}>
          {classes.length === 0
            ? <div style={s.empty}>No classes yet. Create your first class!</div>
            : classes.map((c, i) => {
              const teacher = getTeacher(c.teacherId);
              const count = c.students?.length || 0;
              const color = COLORS[i % COLORS.length];
              const pct = Math.round((count / (c.capacity || 1)) * 100);
              return (
                <div key={c.id} style={{ ...s.classCard, borderTop: `4px solid ${color}`, ...(selected?.id === c.id ? { ...s.classCardSelected, borderColor: color } : {}) }}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}>
                  <div style={s.classCardTop}>
                    <div style={{ ...s.classIconBox, background: color + '18', color }}>
                      <span style={{ fontSize: '1.4rem' }}>📚</span>
                    </div>
                    <div style={s.classActions}>
                      <button style={s.iconBtn} onClick={(e) => { e.stopPropagation(); handleEdit(c); }}>✏️</button>
                      <button style={s.iconBtnRed} onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}>🗑️</button>
                    </div>
                  </div>

                  <div style={s.className}>{c.name}</div>
                  <div style={s.classGrade}>{c.grade}</div>
                  {teacher && <div style={s.classTeacher}>👨‍🏫 {teacher.firstName} {teacher.lastName}</div>}

                  <div style={s.classStats}>
                    <div style={s.classStat}>
                      <span style={{ ...s.classStatNum, color }}>{count}</span>
                      <span style={s.classStatLabel}>Students</span>
                    </div>
                    <div style={s.statDivider}/>
                    <div style={s.classStat}>
                      <span style={{ ...s.classStatNum, color }}>{c.capacity}</span>
                      <span style={s.classStatLabel}>Capacity</span>
                    </div>
                    <div style={s.statDivider}/>
                    <div style={s.classStat}>
                      <span style={{ ...s.classStatNum, color }}>{pct}%</span>
                      <span style={s.classStatLabel}>Filled</span>
                    </div>
                  </div>

                  <div style={s.progressBg}>
                    <div style={{ ...s.progressFill, width: `${Math.min(pct, 100)}%`, background: color }}/>
                  </div>
                  <div style={s.progressLabel}>{count}/{c.capacity} students enrolled</div>
                </div>
              );
            })}
        </div>

        {selected && (
          <div style={s.detailPanel}>
            <div style={s.detailHeader}>
              <div style={s.detailTitle}>{selected.name}</div>
              <button style={s.detailClose} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={s.detailInfo}>
              <div style={s.detailRow}><span style={s.detailKey}>Grade</span><span style={s.detailVal}>{selected.grade}</span></div>
              <div style={s.detailRow}><span style={s.detailKey}>Teacher</span><span style={s.detailVal}>{(() => { const t = getTeacher(selected.teacherId); return t ? `${t.firstName} ${t.lastName}` : 'Not assigned'; })()}</span></div>
              <div style={s.detailRow}><span style={s.detailKey}>Capacity</span><span style={s.detailVal}>{selected.capacity}</span></div>
              <div style={s.detailRow}><span style={s.detailKey}>Enrolled</span><span style={s.detailVal}>{selected.students?.length || 0}</span></div>
              {selected.description && <div style={s.detailRow}><span style={s.detailKey}>Note</span><span style={s.detailVal}>{selected.description}</span></div>}
            </div>

            <div style={s.detailSectionTitle}>Enrolled Students ({selected.students?.length || 0})</div>
            <div style={s.enrolledList}>
              {!selected.students || selected.students.length === 0
                ? <div style={s.noStudents}>No students enrolled yet</div>
                : selected.students.map((st, i) => (
                  <div key={st.id} style={s.enrolledRow}>
                    <div style={{ ...s.eAvatar, background: COLORS[i % COLORS.length] }}>{st.firstName?.charAt(0)}{st.lastName?.charAt(0)}</div>
                    <div>
                      <div style={s.eName}>{st.firstName} {st.lastName}</div>
                      <div style={s.ePhone}>{st.phone || st.email || '—'}</div>
                    </div>
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
  page:        { padding: '2rem 2.5rem' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title:       { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub:         { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  addBtn:      { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  overlay:     { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:       { background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle:  { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' },
  closeBtn:    { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b' },
  formGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  field:       { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label:       { fontSize: '0.82rem', fontWeight: '600', color: '#475569' },
  req:         { color: '#ef4444' },
  input:       { padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', color: '#1e293b', outline: 'none', background: '#fff' },
  teacherPreview: { marginTop: '0.4rem', fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '6px' },
  modalFooter: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  cancelBtn:   { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  submitBtn:   { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', padding: '0.7rem 1.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  error:       { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid #fecaca' },
  twoCol:      { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
  classGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', flex: 1 },
  classCard:   { background: '#fff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', cursor: 'pointer', border: '2px solid transparent', transition: 'box-shadow 0.2s' },
  classCardSelected: { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' },
  classCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' },
  classIconBox: { width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  classActions: { display: 'flex', gap: '0.35rem' },
  iconBtn:     { background: '#f1f5f9', border: 'none', padding: '0.3rem 0.4rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' },
  iconBtnRed:  { background: '#fef2f2', border: 'none', padding: '0.3rem 0.4rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' },
  className:   { fontWeight: '700', fontSize: '1rem', color: '#1e293b', marginBottom: '0.2rem' },
  classGrade:  { fontSize: '0.8rem', color: '#64748b', marginBottom: '0.35rem' },
  classTeacher: { fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.85rem' },
  classStats:  { display: 'flex', alignItems: 'center', marginBottom: '0.85rem' },
  classStat:   { flex: 1, textAlign: 'center' },
  classStatNum: { display: 'block', fontSize: '1.3rem', fontWeight: '800', lineHeight: 1 },
  classStatLabel: { fontSize: '0.68rem', color: '#94a3b8', fontWeight: '500', marginTop: '2px' },
  statDivider: { width: '1px', height: '30px', background: '#f1f5f9' },
  progressBg:  { height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.4rem' },
  progressFill: { height: '100%', borderRadius: '3px' },
  progressLabel: { fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' },
  empty:       { gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#fff', borderRadius: '16px' },
  detailPanel: { width: '280px', flexShrink: 0, background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', position: 'sticky', top: '1rem' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  detailTitle: { fontWeight: '700', fontSize: '1rem', color: '#1e293b' },
  detailClose: { background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#64748b' },
  detailInfo:  { background: '#f8fafc', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  detailRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailKey:   { fontSize: '0.78rem', color: '#94a3b8', fontWeight: '500' },
  detailVal:   { fontSize: '0.82rem', color: '#1e293b', fontWeight: '600' },
  detailSectionTitle: { fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' },
  enrolledList: { display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '320px', overflowY: 'auto' },
  enrolledRow: { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', background: '#f8fafc', borderRadius: '8px' },
  eAvatar:     { width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.7rem', flexShrink: 0 },
  eName:       { fontSize: '0.82rem', fontWeight: '600', color: '#1e293b' },
  ePhone:      { fontSize: '0.72rem', color: '#94a3b8' },
  noStudents:  { textAlign: 'center', color: '#94a3b8', padding: '1.5rem', fontSize: '0.85rem' },
};