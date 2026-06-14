import { useEffect, useState } from 'react';
import api from '../../services/api';

const SUBJECTS = ['Math', 'Khmer', 'English', 'Chinese', 'Computer'];
const TERMS = ['Term 1', 'Term 2', 'Term 3', 'Final'];
const empty = { studentId: '', subject: '', score: '', term: 'Term 1', notes: '' };

export default function TeacherGrades() {
  const [grades, setGrades]     = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');

  const load = async () => {
    const [rg, rs] = await Promise.all([api.get('/grades'), api.get('/students')]);
    setGrades(rg.data); setStudents(rs.data);
  };

  useEffect(() => {
  const load = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [rg, rs, rc, rt] = await Promise.all([
      api.get('/grades'), api.get('/students'),
      api.get('/classes'), api.get('/teachers'),
    ]);
    
    const me = rt.data.find((t) => t.firstName + ' ' + t.lastName === user.name);
    const myClasses = rc.data.filter((c) => me && c.teacherId === me.id);
    const myClassIds = myClasses.map((c) => c.id);
    const myStudentIds = rs.data.filter((s) => myClassIds.includes(s.classId)).map((s) => s.id);
    
    setStudents(rs.data.filter((s) => myClassIds.includes(s.classId)));
    setGrades(rg.data.filter((g) => myStudentIds.includes(g.studentId)));
  };
  load();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/grades/${editId}`, form);
      else await api.post('/grades', form);
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch (err) { setError(err.response?.data?.message || 'Error saving'); }
  };

  const handleEdit = (g) => { setForm({ studentId: g.studentId, subject: g.subject, score: g.score, term: g.term, notes: g.notes || '' }); setEditId(g.id); setShowForm(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/grades/${id}`); load(); };

  const getGL = (score) => {
    if (score >= 90) return { l: 'A', c: '#10b981', bg: '#d1fae5' };
    if (score >= 80) return { l: 'B', c: '#3b82f6', bg: '#dbeafe' };
    if (score >= 70) return { l: 'C', c: '#f59e0b', bg: '#fef3c7' };
    if (score >= 60) return { l: 'D', c: '#f97316', bg: '#fff7ed' };
    return { l: 'F', c: '#ef4444', bg: '#fef2f2' };
  };

  const filtered = grades.filter((g) => {
    const st = students.find((s) => s.id === g.studentId);
    return st ? `${st.firstName} ${st.lastName} ${g.subject}`.toLowerCase().includes(search.toLowerCase()) : true;
  });

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div><h1 style={s.title}>Grade Entry</h1><p style={s.sub}>{grades.length} grade records</p></div>
        <button style={s.addBtn} onClick={() => { setShowForm(true); setForm(empty); setEditId(null); }}>+ Add Grade</button>
      </div>

      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editId ? '✏️ Edit Grade' : '📊 Enter Grade'}</h2>
              <button style={s.closeBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>✕</button>
            </div>
            {error && <div style={s.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={s.formGrid}>
                <div style={{ ...s.field, gridColumn: '1 / -1' }}>
                  <label style={s.label}>Student <span style={s.req}>*</span></label>
                  <select style={s.input} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                    <option value="">Select student</option>
                    {students.map((st) => <option key={st.id} value={st.id}>{st.firstName} {st.lastName} — {st.grade || 'No grade'}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Subject <span style={s.req}>*</span></label>
                  <select style={s.input} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                    <option value="">Select subject</option>
                    {SUBJECTS.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Term</label>
                  <select style={s.input} value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })}>
                    {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Score (0-100) <span style={s.req}>*</span></label>
                  <input style={s.input} type="number" min="0" max="100" placeholder="85" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Grade</label>
                  <div style={{ ...s.input, background: '#f8fafc' }}>
                    {form.score ? (() => { const g = getGL(Number(form.score)); return <span style={{ color: g.c, fontWeight: '700' }}>{g.l}</span>; })() : <span style={{ color: '#94a3b8' }}>Auto</span>}
                  </div>
                </div>
                <div style={{ ...s.field, gridColumn: '1 / -1' }}>
                  <label style={s.label}>Notes</label>
                  <input style={s.input} placeholder="Optional..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>Cancel</button>
                <button type="submit" style={s.submitBtn}>{editId ? 'Update' : 'Save Grade'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={s.tableCard}>
        <div style={s.tableTop}>
          <span style={s.tableTitle}>Grade Records</span>
          <input style={s.search} placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <table style={s.table}>
          <thead><tr style={s.thead}><th style={s.th}>#</th><th style={s.th}>Student</th><th style={s.th}>Subject</th><th style={s.th}>Term</th><th style={s.th}>Score</th><th style={s.th}>Grade</th><th style={s.th}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan="7" style={s.empty}>No grades yet</td></tr>
              : filtered.map((g, i) => { const st = students.find((s) => s.id === g.studentId); const gl = getGL(g.score);
                return (<tr key={g.id} style={s.tr}><td style={{ ...s.td, color: '#94a3b8', fontSize: '0.78rem' }}>{i + 1}</td><td style={s.td}><span style={s.name}>{st ? `${st.firstName} ${st.lastName}` : '—'}</span></td><td style={s.td}><span style={s.subBadge}>{g.subject}</span></td><td style={s.td}>{g.term}</td><td style={s.td}><strong>{g.score}</strong></td><td style={s.td}><span style={{ ...s.gradeB, background: gl.bg, color: gl.c }}>{gl.l}</span></td><td style={s.td}><button style={s.editBtn} onClick={() => handleEdit(g)}>Edit</button><button style={s.deleteBtn} onClick={() => handleDelete(g.id)}>Delete</button></td></tr>);
              })}
          </tbody>
        </table>
        <div style={s.tableFooter}>Showing {filtered.length} of {grades.length} records</div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '2rem 2.5rem' }, header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }, sub: { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  addBtn: { background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' },
  closeBtn: { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' }, label: { fontSize: '0.82rem', fontWeight: '600', color: '#475569' }, req: { color: '#ef4444' },
  input: { padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', color: '#1e293b', outline: 'none', background: '#fff' },
  modalFooter: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  cancelBtn: { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  submitBtn: { background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', color: '#fff', border: 'none', padding: '0.7rem 1.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid #fecaca' },
  tableCard: { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' },
  tableTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' },
  tableTitle: { fontWeight: '700', color: '#1e293b', fontSize: '1rem' },
  search: { padding: '0.5rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', width: '220px', outline: 'none' },
  table: { width: '100%', borderCollapse: 'collapse' }, thead: { background: '#f8fafc' },
  th: { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tr: { borderBottom: '1px solid #f8fafc' }, td: { padding: '0.9rem 1.25rem', fontSize: '0.875rem', color: '#374151' },
  name: { fontWeight: '600', color: '#1e293b' },
  subBadge: { background: '#ede9fe', color: '#7c3aed', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  gradeB: { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700' },
  editBtn: { background: '#ede9fe', color: '#7c3aed', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', marginRight: '0.4rem', cursor: 'pointer' },
  deleteBtn: { background: '#fef2f2', color: '#dc2626', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.9rem' },
  tableFooter: { padding: '0.85rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
};