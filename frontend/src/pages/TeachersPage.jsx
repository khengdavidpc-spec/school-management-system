import { useEffect, useState } from 'react';
import api from '../services/api';

const SUBJECTS = ['Math', 'Khmer', 'English', 'Chinese', 'Computer'];
const empty = { firstName: '', lastName: '', sex: '', email: '', phone: '', subject: '', classId: '' };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses]   = useState([]);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const [rt, rc] = await Promise.all([
      api.get('/teachers'),
      api.get('/classes').catch(() => ({ data: [] })),
    ]);
    setTeachers(rt.data);
    setClasses(rc.data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/teachers/${editId}`, form);
      else await api.post('/teachers', form);
      setForm(empty); setEditId(null); setShowForm(false); load();
    } catch (err) { setError(err.response?.data?.message || 'Error saving'); }
  };

  const handleEdit = (t) => {
    setForm({ firstName: t.firstName, lastName: t.lastName, sex: t.sex || '', email: t.email, phone: t.phone || '', subject: t.subject, classId: t.classId || '' });
    setEditId(t.id); setShowForm(true); setSelected(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    await api.delete(`/teachers/${id}`); load(); setSelected(null);
  };

  const getTeacherClasses = (id) => classes.filter((c) => c.teacherId === id);
  const filtered = teachers.filter((t) => `${t.firstName} ${t.lastName} ${t.subject}`.toLowerCase().includes(search.toLowerCase()));
  const COLORS = ['#8b5cf6','#f97316','#22d3ee','#10b981','#ef4444','#f59e0b'];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Teachers</h1>
          <p style={s.sub}>{teachers.length} teachers registered</p>
        </div>
        <button style={s.addBtn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); setSelected(null); }}>
          {showForm ? '✕ Cancel' : '+ Add Teacher'}
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editId ? '✏️ Edit Teacher' : '👨‍🏫 Add New Teacher'}</h2>
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
                  <label style={s.label}>Email <span style={s.req}>*</span></label>
                  <input style={s.input} type="email" placeholder="teacher@school.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Phone Number</label>
                  <input style={s.input} placeholder="012 345 678" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Subject <span style={s.req}>*</span></label>
                  <select style={s.input} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                    <option value="">Select subject</option>
                    {SUBJECTS.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
                <div style={{ ...s.field, gridColumn: '1 / -1' }}>
                  <label style={s.label}>Assign to Class</label>
                  <select style={s.input} value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
                    <option value="">Select class (optional)</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.grade}</option>)}
                  </select>
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => { setShowForm(false); setForm(empty); setEditId(null); }}>Cancel</button>
                <button type="submit" style={s.submitBtn}>{editId ? 'Update Teacher' : 'Add Teacher'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={s.twoCol}>
        <div style={s.tableCard}>
          <div style={s.tableTop}>
            <span style={s.tableTitle}>All Teachers</span>
            <input style={s.search} placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <table style={s.table}>
            <thead><tr style={s.thead}>
              <th style={s.th}>#</th>
              <th style={s.th}>Teacher</th>
              <th style={s.th}>Sex</th>
              <th style={s.th}>Subject</th>
              <th style={s.th}>Classes</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan="7" style={s.empty}>No teachers found</td></tr>
                : filtered.map((t, i) => {
                  const tClasses = getTeacherClasses(t.id);
                  return (
                    <tr key={t.id} style={{ ...s.tr, ...(selected?.id === t.id ? s.trSelected : {}) }}
                      onClick={() => setSelected(selected?.id === t.id ? null : t)}>
                      <td style={{ ...s.td, color: '#94a3b8', fontSize: '0.78rem' }}>{i + 1}</td>
                      <td style={s.td}>
                        <div style={s.nameCell}>
                          <div style={{ ...s.avatar, background: COLORS[i % COLORS.length] }}>
                            {t.firstName?.charAt(0)}{t.lastName?.charAt(0)}
                          </div>
                          <div>
                            <div style={s.name}>{t.firstName} {t.lastName}</div>
                            <div style={s.nameId}>{t.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.sexBadge, background: t.sex === 'Female' ? '#fce7f3' : t.sex === 'Male' ? '#e0f2fe' : '#f1f5f9', color: t.sex === 'Female' ? '#be185d' : t.sex === 'Male' ? '#0369a1' : '#64748b' }}>
                          {t.sex || '—'}
                        </span>
                      </td>
                      <td style={s.td}><span style={s.subjectBadge}>{t.subject}</span></td>
                      <td style={s.td}><span style={s.classBadge}>{tClasses.length} classes</span></td>
                      <td style={s.td}><span style={t.status === 'active' ? s.badgeGreen : s.badgeGray}>{t.status}</span></td>
                      <td style={s.td} onClick={(e) => e.stopPropagation()}>
                        <button style={s.editBtn} onClick={() => handleEdit(t)}>Edit</button>
                        <button style={s.deleteBtn} onClick={() => handleDelete(t.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div style={s.tableFooter}>Showing {filtered.length} of {teachers.length} teachers</div>
        </div>

        {selected && (
          <div style={s.detailPanel}>
            <div style={s.detailHeader}>
              <div style={s.detailAvatar}>{selected.firstName?.charAt(0)}{selected.lastName?.charAt(0)}</div>
              <button style={s.detailClose} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={s.detailName}>{selected.firstName} {selected.lastName}</div>
            <div style={s.detailSub}>{selected.subject} Teacher</div>
            <div style={s.detailInfo}>
              <div style={s.detailRow}><span style={s.detailKey}>📧 Email</span><span style={s.detailVal}>{selected.email}</span></div>
              <div style={s.detailRow}><span style={s.detailKey}>📱 Phone</span><span style={s.detailVal}>{selected.phone || '—'}</span></div>
              <div style={s.detailRow}><span style={s.detailKey}>👤 Sex</span><span style={s.detailVal}>{selected.sex || '—'}</span></div>
              <div style={s.detailRow}><span style={s.detailKey}>📚 Subject</span><span style={s.detailVal}>{selected.subject}</span></div>
            </div>
            <div style={s.detailSectionTitle}>Assigned Classes ({getTeacherClasses(selected.id).length})</div>
            <div style={s.classList}>
              {getTeacherClasses(selected.id).length === 0
                ? <div style={s.noClasses}>No classes assigned</div>
                : getTeacherClasses(selected.id).map((c, i) => (
                  <div key={c.id} style={s.classItem}>
                    <div style={{ ...s.classItemIcon, background: COLORS[i % COLORS.length] + '20', color: COLORS[i % COLORS.length] }}>📚</div>
                    <div>
                      <div style={s.classItemName}>{c.name}</div>
                      <div style={s.classItemGrade}>{c.grade} • {c.students?.length || 0} students</div>
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
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  title:       { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub:         { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  addBtn:      { background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  overlay:     { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:       { background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle:  { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' },
  closeBtn:    { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b' },
  formGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  field:       { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label:       { fontSize: '0.82rem', fontWeight: '600', color: '#475569' },
  req:         { color: '#ef4444' },
  input:       { padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', color: '#1e293b', outline: 'none', background: '#fff' },
  modalFooter: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  cancelBtn:   { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  submitBtn:   { background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', color: '#fff', border: 'none', padding: '0.7rem 1.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  error:       { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid #fecaca' },
  twoCol:      { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
  tableCard:   { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden', flex: 1 },
  tableTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' },
  tableTitle:  { fontWeight: '700', color: '#1e293b', fontSize: '1rem' },
  search:      { padding: '0.5rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', width: '220px', outline: 'none' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  thead:       { background: '#f8fafc' },
  th:          { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tr:          { borderBottom: '1px solid #f8fafc', cursor: 'pointer' },
  trSelected:  { background: '#f5f3ff' },
  td:          { padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#374151' },
  nameCell:    { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar:      { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 },
  name:        { fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' },
  nameId:      { fontSize: '0.72rem', color: '#94a3b8' },
  sexBadge:    { padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  subjectBadge: { background: '#ede9fe', color: '#7c3aed', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  classBadge:  { background: '#fff7ed', color: '#f97316', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  badgeGreen:  { background: '#d1fae5', color: '#065f46', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  badgeGray:   { background: '#f1f5f9', color: '#64748b', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  editBtn:     { background: '#ede9fe', color: '#7c3aed', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', marginRight: '0.4rem', cursor: 'pointer' },
  deleteBtn:   { background: '#fef2f2', color: '#dc2626', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' },
  empty:       { textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.9rem' },
  tableFooter: { padding: '0.85rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
  detailPanel: { width: '260px', flexShrink: 0, background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', position: 'sticky', top: '1rem' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  detailAvatar: { width: '48px', height: '48px', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '1rem' },
  detailClose: { background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#64748b' },
  detailName:  { fontWeight: '800', fontSize: '1rem', color: '#1e293b', marginBottom: '0.2rem' },
  detailSub:   { fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' },
  detailInfo:  { background: '#f8fafc', borderRadius: '10px', padding: '0.85rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  detailRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' },
  detailKey:   { fontSize: '0.78rem', color: '#94a3b8', fontWeight: '500', flexShrink: 0 },
  detailVal:   { fontSize: '0.82rem', color: '#1e293b', fontWeight: '600', textAlign: 'right' },
  detailSectionTitle: { fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' },
  classList:   { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  classItem:   { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem', background: '#f8fafc', borderRadius: '8px' },
  classItemIcon: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 },
  classItemName: { fontWeight: '600', fontSize: '0.82rem', color: '#1e293b' },
  classItemGrade: { fontSize: '0.72rem', color: '#94a3b8' },
  noClasses:   { textAlign: 'center', color: '#94a3b8', padding: '1rem', fontSize: '0.85rem' },
};