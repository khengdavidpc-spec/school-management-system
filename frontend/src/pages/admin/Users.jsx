import { useEffect, useState } from 'react';
import api from '../../services/api';

const empty = { name: '', email: '', password: '', role: 'student' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setError('');
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading users');
    }
  };

  useEffect(() => { load(); }, []);

  const closeForm = () => {
    setForm(empty);
    setEditId(null);
    setShowForm(false);
    setError('');
  };

  const openCreate = () => {
    setForm(empty);
    setEditId(null);
    setError('');
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setForm({ name: user.name || '', email: user.email || '', password: '', role: user.role || 'student' });
    setEditId(user.id);
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await api.put(`/auth/users/${editId}`, payload);
      } else {
        await api.post('/auth/register', form);
      }
      closeForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving user');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    setError('');
    try {
      await api.delete(`/auth/users/${user.id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting user');
    }
  };

  const roleColor = {
    admin: { bg: '#fff7ed', color: '#f97316' },
    teacher: { bg: '#ede9fe', color: '#7c3aed' },
    student: { bg: '#d1fae5', color: '#065f46' },
  };

  const filtered = users.filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>User Management</h1>
          <p style={s.sub}>{users.length} accounts registered</p>
        </div>
        <button style={s.addBtn} onClick={showForm ? closeForm : openCreate}>
          {showForm ? 'Cancel' : '+ Create Account'}
        </button>
      </div>

      {error && !showForm && <div style={s.error}>{error}</div>}

      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editId ? 'Edit Account' : 'Create New Account'}</h2>
              <button style={s.closeBtn} onClick={closeForm}>x</button>
            </div>
            {error && <div style={s.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={s.formGrid}>
                <div style={{ ...s.field, gridColumn: '1 / -1' }}>
                  <label style={s.label}>Full Name <span style={s.req}>*</span></label>
                  <input style={s.input} placeholder="Enter full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Email <span style={s.req}>*</span></label>
                  <input style={s.input} type="email" placeholder="user@school.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Password {!editId && <span style={s.req}>*</span>}</label>
                  <input
                    style={s.input}
                    type="password"
                    placeholder={editId ? 'Leave blank to keep current' : 'Min 6 characters'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editId}
                    minLength={form.password ? 6 : undefined}
                  />
                </div>
                <div style={{ ...s.field, gridColumn: '1 / -1' }}>
                  <label style={s.label}>Role <span style={s.req}>*</span></label>
                  <select style={s.select} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={closeForm}>Cancel</button>
                <button type="submit" style={s.submitBtn}>{editId ? 'Update Account' : 'Create Account'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={s.tableCard}>
        <div style={s.tableTop}>
          <span style={s.tableTitle}>All Accounts</span>
          <input style={s.search} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <table style={s.table}>
          <thead><tr style={s.thead}>
            <th style={s.th}>#</th>
            <th style={s.th}>Name</th>
            <th style={s.th}>Email</th>
            <th style={s.th}>Role</th>
            <th style={s.th}>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan="5" style={s.empty}>No users found. Create accounts above.</td></tr>
              : filtered.map((u, i) => (
                <tr key={u.id} style={s.tr}>
                  <td style={{ ...s.td, color: '#94a3b8', fontSize: '0.78rem' }}>{i + 1}</td>
                  <td style={s.td}>
                    <div style={s.nameCell}>
                      <div style={{ ...s.avatar, background: u.role === 'admin' ? '#f97316' : u.role === 'teacher' ? '#8b5cf6' : '#10b981' }}>
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={s.name}>{u.name}</span>
                    </div>
                  </td>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}>
                    <span style={{ ...s.roleBadge, ...roleColor[u.role] }}>{u.role}</span>
                  </td>
                  <td style={s.td}>
                    <button style={s.editBtn} onClick={() => handleEdit(u)}>Edit</button>
                    <button style={s.deleteBtn} onClick={() => handleDelete(u)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div style={s.tableFooter}>Showing {filtered.length} of {users.length} accounts</div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '2rem 2.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub: { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  addBtn: { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' },
  closeBtn: { background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.82rem', fontWeight: '600', color: '#475569' },
  req: { color: '#ef4444' },
  input: { padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', color: '#1e293b', outline: 'none', background: '#fff' },
  modalFooter: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  cancelBtn: { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  submitBtn: { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', border: 'none', padding: '0.7rem 1.75rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid #fecaca' },
  tableCard: { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' },
  tableTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' },
  tableTitle: { fontWeight: '700', color: '#1e293b', fontSize: '1rem' },
  search: { padding: '0.5rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', width: '220px', outline: 'none' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#374151' },
  nameCell: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: { width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.82rem', flexShrink: 0 },
  name: { fontWeight: '600', color: '#1e293b' },
  roleBadge: { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'capitalize' },
  editBtn: { background: '#fff7ed', color: '#f97316', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', marginRight: '0.4rem', cursor: 'pointer' },
  deleteBtn: { background: '#fef2f2', color: '#dc2626', border: 'none', padding: '0.32rem 0.8rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '3rem', color: '#94a3b8' },
  tableFooter: { padding: '0.85rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
  select: { padding: '0.8rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.875rem', background: '#fff', color: '#1e293b', outline: 'none', width: '100%' },
};
