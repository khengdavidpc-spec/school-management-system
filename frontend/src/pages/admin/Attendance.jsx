import { useEffect, useState } from 'react';
import api from '../../services/api';

const empty = { studentId: '', date: new Date().toISOString().split('T')[0], status: 'present', notes: '' };

export default function AdminAttendance() {
  const [records, setRecords]   = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses]   = useState([]);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [search, setSearch]     = useState('');

  const load = async () => {
    const [ra, rs, rc] = await Promise.all([api.get('/attendance'), api.get('/students'), api.get('/classes').catch(() => ({ data: [] }))]);
    setStudents(rs.data); setClasses(rc.data);
    setRecords(ra.data.map((r) => ({ ...r, studentName: `${r.student?.firstName || ''} ${r.student?.lastName || ''}`.trim() })));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/attendance/${editId}`, form);
      else await api.post('/attendance', form);
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch (err) { setError(err.response?.data?.message || 'Error saving'); }
  };

  const handleEdit = (r) => { setForm({ studentId: r.studentId, date: r.date, status: r.status, notes: r.notes || '' }); setEditId(r.id); setShowForm(true); };
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/attendance/${id}`); load(); };
  const getStudentClass = (sid) => { const st = students.find((s) => s.id === sid); return classes.find((c) => c.id === st?.classId); };
  const filteredStudents = classFilter === 'all' ? students : students.filter((s) => s.classId === classFilter);
  const filtered = records.filter((r) => filter === 'all' || r.status === filter).filter((r) => classFilter === 'all' || getStudentClass(r.studentId)?.id === classFilter).filter((r) => r.studentName.toLowerCase().includes(search.toLowerCase()));
  const counts = { all: records.length, present: records.filter((r) => r.status === 'present').length, absent: records.filter((r) => r.status === 'absent').length, late: records.filter((r) => r.status === 'late').length };
  const statusStyle = { present: { bg: '#d1fae5', color: '#065f46', icon: '✅' }, absent: { bg: '#fef2f2', color: '#dc2626', icon: '❌' }, late: { bg: '#fef3c7', color: '#92400e', icon: '⏰' } };

  return (
    <div style={p.page}>
      <div style={p.header}>
        <div><h1 style={p.title}>Attendance</h1><p style={p.sub}>Track and manage student attendance</p></div>
        <button style={p.addBtn} onClick={() => { setShowForm(true); setForm(empty); setEditId(null); }}>✅ Mark Attendance</button>
      </div>

      <div style={p.summaryRow}>
        {[{ key: 'all', label: 'Total', color: '#f97316', bg: '#fff7ed', icon: '📋' }, { key: 'present', label: 'Present', color: '#10b981', bg: '#ecfdf5', icon: '✅' }, { key: 'absent', label: 'Absent', color: '#ef4444', bg: '#fef2f2', icon: '❌' }, { key: 'late', label: 'Late', color: '#f59e0b', bg: '#fffbeb', icon: '⏰' }].map((c) => (
          <div key={c.key} style={{ ...p.summaryCard, background: c.bg, border: `2px solid ${filter === c.key ? c.color : 'transparent'}`, cursor: 'pointer' }} onClick={() => setFilter(filter === c.key ? 'all' : c.key)}>
            <div style={p.summaryTop}><span style={{ fontSize: '1.5rem' }}>{c.icon}</span><span style={{ ...p.summaryValue, color: c.color }}>{counts[c.key]}</span></div>
            <div style={{ ...p.summaryLabel, color: c.color }}>{c.label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={p.overlay}>
          <div style={p.modal}>
            <div style={p.modalHeader}>
              <h2 style={p.modalTitle}>{editId ? '✏️ Edit Attendance' : '✅ Mark Attendance'}</h2>
              <button style={p.closeBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>✕</button>
            </div>
            {error && <div style={p.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={p.formGrid}>
                <div style={{ ...p.field, gridColumn: '1 / -1' }}><label style={p.label}>Filter by Class</label><select style={p.input} value={classFilter} onChange={(e) => setClassFilter(e.target.value)}><option value="all">All Students</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.grade}</option>)}</select></div>
                <div style={{ ...p.field, gridColumn: '1 / -1' }}>
                  <label style={p.label}>Select Student <span style={p.req}>*</span></label>
                  <select style={p.input} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                    <option value="">Select student</option>
                    {filteredStudents.map((st) => <option key={st.id} value={st.id}>{st.firstName} {st.lastName} — {st.grade || 'No grade'} {st.sex ? `(${st.sex})` : ''}</option>)}
                  </select>
                  {form.studentId && (() => { const st = students.find((s) => s.id === form.studentId); const cls = classes.find((c) => c.id === st?.classId); return st ? <div style={p.preview}>👤 {st.firstName} {st.lastName}{cls ? ` • 📚 ${cls.name}` : ''}</div> : null; })()}
                </div>
                <div style={p.field}><label style={p.label}>Date <span style={p.req}>*</span></label><input style={p.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
                <div style={p.field}><label style={p.label}>Status <span style={p.req}>*</span></label><select style={p.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="present">✅ Present</option><option value="absent">❌ Absent</option><option value="late">⏰ Late</option></select></div>
                <div style={{ ...p.field, gridColumn: '1 / -1' }}><label style={p.label}>Notes</label><input style={p.input} placeholder="Optional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              </div>
              <div style={p.modalFooter}>
                <button type="button" style={p.cancelBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>Cancel</button>
                <button type="submit" style={p.submitBtn}>{editId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={p.tableCard}>
        <div style={p.tableTop}>
          <div>
            <span style={{ ...p.tableTitle, display: 'block', marginBottom: '0.75rem' }}>Records</span>
            <div style={p.filterRow}>
              <button style={{ ...p.chip, ...(classFilter === 'all' ? p.chipActive : {}) }} onClick={() => setClassFilter('all')}>All Classes</button>
              {classes.map((c) => <button key={c.id} style={{ ...p.chip, ...(classFilter === c.id ? p.chipActive : {}) }} onClick={() => setClassFilter(classFilter === c.id ? 'all' : c.id)}>{c.name}</button>)}
            </div>
          </div>
          <input style={p.search} placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <table style={p.table}>
          <thead><tr style={p.thead}><th style={p.th}>#</th><th style={p.th}>Student</th><th style={p.th}>Class</th><th style={p.th}>Date</th><th style={p.th}>Status</th><th style={p.th}>Notes</th><th style={p.th}>Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan="7" style={p.empty}>No records found</td></tr>
              : filtered.map((r, i) => { const cls = getStudentClass(r.studentId); const ss = statusStyle[r.status] || {};
                return (<tr key={r.id} style={p.tr}><td style={{ ...p.td, color: '#94a3b8', fontSize: '0.78rem' }}>{i + 1}</td><td style={p.td}><span style={p.name}>{r.studentName || '—'}</span></td><td style={p.td}>{cls ? <span style={p.classBadge}>{cls.name}</span> : '—'}</td><td style={p.td}>{r.date}</td><td style={p.td}><span style={{ ...p.statusBadge, background: ss.bg, color: ss.color }}>{ss.icon} {r.status}</span></td><td style={p.td}>{r.notes || '—'}</td><td style={p.td}><button style={p.editBtn} onClick={() => handleEdit(r)}>Edit</button><button style={p.deleteBtn} onClick={() => handleDelete(r.id)}>Delete</button></td></tr>);
              })}
          </tbody>
        </table>
        <div style={p.tableFooter}>Showing {filtered.length} of {records.length} • ✅ {counts.present} • ❌ {counts.absent} • ⏰ {counts.late}</div>
      </div>
    </div>
  );
}

const p = {
  page:        { padding: '2rem 2.5rem' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title:       { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub:         { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  addBtn:      { background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  summaryRow:  { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  summaryCard: { borderRadius: '14px', padding: '1.25rem' },
  summaryTop:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  summaryValue: { fontSize: '2rem', fontWeight: '900', lineHeight: 1 },
  summaryLabel: { fontSize: '0.82rem', fontWeight: '700' },
  overlay:     { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:       { background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle:  { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' },
  closeBtn:    { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b' },
  formGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  field:       { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label:       { fontSize: '0.82rem', fontWeight: '600', color: '#475569' },
  req:         { color: '#ef4444' },
  input:       { padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', color: '#1e293b', outline: 'none', background: '#fff' },
  preview:     { marginTop: '0.4rem', fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '6px' },
  modalFooter: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  cancelBtn:   { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  submitBtn:   { background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', border: 'none', padding: '0.7rem 1.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  error:       { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid #fecaca' },
  tableCard:   { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' },
  tableTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', gap: '1rem' },
  tableTitle:  { fontWeight: '700', color: '#1e293b', fontSize: '1rem' },
  filterRow:   { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  chip:        { background: '#f1f5f9', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', color: '#64748b', fontWeight: '500', cursor: 'pointer' },
  chipActive:  { background: '#10b981', color: '#fff', fontWeight: '600' },
  search:      { padding: '0.5rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', width: '220px', outline: 'none', flexShrink: 0 },
  table:       { width: '100%', borderCollapse: 'collapse' },
  thead:       { background: '#f8fafc' },
  th:          { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tr:          { borderBottom: '1px solid #f8fafc' },
  td:          { padding: '0.9rem 1.25rem', fontSize: '0.875rem', color: '#374151' },
  name:        { fontWeight: '600', color: '#1e293b' },
  classBadge:  { background: '#ede9fe', color: '#7c3aed', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  statusBadge: { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  editBtn:     { background: '#ecfdf5', color: '#10b981', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', marginRight: '0.4rem', cursor: 'pointer' },
  deleteBtn:   { background: '#fef2f2', color: '#dc2626', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' },
  empty:       { textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.9rem' },
  tableFooter: { padding: '0.85rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
};