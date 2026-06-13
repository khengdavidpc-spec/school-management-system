import { useEffect, useState } from 'react';
import api from '../services/api';

const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'];
const empty = { firstName: '', lastName: '', sex: '', phone: '', classId: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses]   = useState([]);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');

  const load = async () => {
    const [rs, rc] = await Promise.all([
      api.get('/students'),
      api.get('/classes').catch(() => ({ data: [] })),
    ]);
    setStudents(rs.data);
    setClasses(rc.data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const selectedClass = classes.find((c) => c.id === form.classId);
      const payload = { ...form, grade: selectedClass?.grade || '' };
      if (editId) await api.put(`/students/${editId}`, payload);
      else await api.post('/students', payload);
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch (err) { setError(err.response?.data?.message || 'Error saving'); }
  };

  const handleEdit = (s) => {
    setForm({ firstName: s.firstName, lastName: s.lastName, sex: s.sex || '', phone: s.phone || '', classId: s.classId || '' });
    setEditId(s.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await api.delete(`/students/${id}`); load();
  };

  const getClass = (id) => classes.find((c) => c.id === id);

  const filtered = students
    .filter((s) => gradeFilter === 'all' || s.grade === gradeFilter)
    .filter((s) => `${s.firstName} ${s.lastName} ${s.phone}`.toLowerCase().includes(search.toLowerCase()));

  const COLORS = ['#f97316','#8b5cf6','#22d3ee','#10b981','#ef4444','#f59e0b'];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Students</h1>
          <p style={s.sub}>{students.length} students registered</p>
        </div>
        <button style={s.addBtn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}>
          {showForm ? '✕ Cancel' : '+ Register Student'}
        </button>
      </div>

      {/* Grade filter chips */}
      <div style={s.chipRow}>
        <button style={{ ...s.chip, ...(gradeFilter === 'all' ? s.chipActive : {}) }} onClick={() => setGradeFilter('all')}>
          All ({students.length})
        </button>
        {GRADES.map((g) => {
          const count = students.filter((st) => st.grade === g).length;
          if (count === 0) return null;
          return (
            <button key={g} style={{ ...s.chip, ...(gradeFilter === g ? s.chipActive : {}) }} onClick={() => setGradeFilter(g)}>
              {g} ({count})
            </button>
          );
        })}
      </div>

      {/* Modal form */}
      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editId ? '✏️ Edit Student' : '🎓 Register New Student'}</h2>
              <button style={s.closeBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>✕</button>
            </div>

            {error && <div style={s.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={s.formGrid}>
                <div style={s.field}>
                  <label style={s.label}>First Name <span style={s.req}>*</span></label>
                  <input style={s.input} placeholder="Enter first name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Last Name <span style={s.req}>*</span></label>
                  <input style={s.input} placeholder="Enter last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Sex <span style={s.req}>*</span></label>
                  <select style={s.input} value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} required>
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Phone Number</label>
                  <input style={s.input} placeholder="012 345 678" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div style={{ ...s.field, gridColumn: '1 / -1' }}>
                  <label style={s.label}>Assign to Class <span style={s.req}>*</span></label>
                  <select style={s.input} value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} required>
                    <option value="">Select class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} — {c.grade} ({c.subject})</option>
                    ))}
                  </select>
                  {form.classId && (
                    <div style={s.classPreview}>
                      📚 Grade: <strong>{classes.find((c) => c.id === form.classId)?.grade}</strong>
                      &nbsp;• Subject: <strong>{classes.find((c) => c.id === form.classId)?.subject}</strong>
                    </div>
                  )}
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>Cancel</button>
                <button type="submit" style={s.submitBtn}>{editId ? 'Update Student' : 'Enroll Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={s.tableCard}>
        <div style={s.tableTop}>
          <span style={s.tableTitle}>Student Directory</span>
          <input style={s.search} placeholder="🔍 Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>#</th>
              <th style={s.th}>Student</th>
              <th style={s.th}>Sex</th>
              <th style={s.th}>Phone</th>
              <th style={s.th}>Grade</th>
              <th style={s.th}>Class</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan="8" style={s.empty}>No students found</td></tr>
              : filtered.map((st, i) => {
                const cls = getClass(st.classId);
                return (
                  <tr key={st.id} style={s.tr}>
                    <td style={{ ...s.td, color: '#94a3b8', fontSize: '0.78rem' }}>{i + 1}</td>
                    <td style={s.td}>
                      <div style={s.nameCell}>
                        <div style={{ ...s.avatar, background: COLORS[i % COLORS.length] }}>
                          {st.firstName?.charAt(0)}{st.lastName?.charAt(0)}
                        </div>
                        <div>
                          <div style={s.name}>{st.firstName} {st.lastName}</div>
                          <div style={s.nameId}>ID: {st.id?.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.sexBadge, background: st.sex === 'Female' ? '#fce7f3' : st.sex === 'Male' ? '#e0f2fe' : '#f1f5f9', color: st.sex === 'Female' ? '#be185d' : st.sex === 'Male' ? '#0369a1' : '#64748b' }}>
                        {st.sex || '—'}
                      </span>
                    </td>
                    <td style={s.td}>{st.phone || '—'}</td>
                    <td style={s.td}><span style={s.gradeBadge}>{st.grade || 'N/A'}</span></td>
                    <td style={s.td}>{cls ? <span style={s.classBadge}>{cls.name}</span> : <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td style={s.td}><span style={st.status === 'active' ? s.badgeGreen : s.badgeGray}>{st.status}</span></td>
                    <td style={s.td}>
                      <button style={s.editBtn} onClick={() => handleEdit(st)}>Edit</button>
                      <button style={s.deleteBtn} onClick={() => handleDelete(st.id)}>Delete</button>
                    </td>
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
  page:        { padding: '2rem 2.5rem' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  title:       { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub:         { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  addBtn:      { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  chipRow:     { display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' },
  chip:        { background: '#fff', border: '1.5px solid #e2e8f0', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', color: '#64748b', fontWeight: '500', cursor: 'pointer' },
  chipActive:  { background: '#f97316', border: '1.5px solid #f97316', color: '#fff', fontWeight: '600' },
  overlay:     { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:       { background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle:  { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' },
  closeBtn:    { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  formGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  field:       { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label:       { fontSize: '0.82rem', fontWeight: '600', color: '#475569' },
  req:         { color: '#ef4444' },
  input:       { padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', color: '#1e293b', outline: 'none', background: '#fff', transition: 'border 0.2s' },
  classPreview: { marginTop: '0.4rem', fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '6px' },
  modalFooter: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  cancelBtn:   { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  submitBtn:   { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', padding: '0.7rem 1.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  error:       { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid #fecaca' },
  tableCard:   { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' },
  tableTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' },
  tableTitle:  { fontWeight: '700', color: '#1e293b', fontSize: '1rem' },
  search:      { padding: '0.5rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', width: '280px', outline: 'none' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  thead:       { background: '#f8fafc' },
  th:          { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tr:          { borderBottom: '1px solid #f8fafc' },
  td:          { padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#374151' },
  nameCell:    { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar:      { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 },
  name:        { fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' },
  nameId:      { fontSize: '0.72rem', color: '#94a3b8' },
  sexBadge:    { padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  gradeBadge:  { background: '#fff7ed', color: '#f97316', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  classBadge:  { background: '#ede9fe', color: '#7c3aed', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  badgeGreen:  { background: '#d1fae5', color: '#065f46', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  badgeGray:   { background: '#f1f5f9', color: '#64748b', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  editBtn:     { background: '#fff7ed', color: '#f97316', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', marginRight: '0.4rem', cursor: 'pointer' },
  deleteBtn:   { background: '#fef2f2', color: '#dc2626', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' },
  empty:       { textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.9rem' },
  tableFooter: { padding: '0.85rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
};