import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import api from '../services/api';

const empty = { firstName: '', lastName: '', email: '', phone: '', grade: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');

  const load = async () => {
    const res = await api.get('/students');
    setStudents(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.put(`/students/${editId}`, form);
      } else {
        await api.post('/students', form);
      }
      setForm(empty);
      setEditId(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving student');
    }
  };

  const handleEdit = (student) => {
    setForm({ firstName: student.firstName, lastName: student.lastName, email: student.email, phone: student.phone || '', grade: student.grade || '' });
    setEditId(student.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await api.delete(`/students/${id}`);
    load();
  };

  const columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName',  label: 'Last Name' },
    { key: 'email',     label: 'Email' },
    { key: 'grade',     label: 'Grade' },
    { key: 'status',    label: 'Status' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Students</h2>
          <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}>
            {showForm ? 'Cancel' : '+ Add Student'}
          </button>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={{ margin: '0 0 1rem' }}>{editId ? 'Edit Student' : 'Add Student'}</h3>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} style={styles.form}>
              <input style={styles.input} placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              <input style={styles.input} placeholder="Last Name"  value={form.lastName}  onChange={(e) => setForm({ ...form, lastName: e.target.value })}  required />
              <input style={styles.input} placeholder="Email"      value={form.email}     onChange={(e) => setForm({ ...form, email: e.target.value })}      required type="email" />
              <input style={styles.input} placeholder="Phone"      value={form.phone}     onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input style={styles.input} placeholder="Grade"      value={form.grade}     onChange={(e) => setForm({ ...form, grade: e.target.value })} />
              <button style={styles.saveBtn} type="submit">{editId ? 'Update' : 'Save'}</button>
            </form>
          </div>
        )}

        <Table columns={columns} data={students} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title:     { margin: 0, fontSize: '1.5rem' },
  addBtn:    { background: '#4f46e5', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  formCard:  { background: '#fff', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' },
  form:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  input:     { padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' },
  saveBtn:   { gridColumn: '1 / -1', background: '#4f46e5', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' },
  error:     { background: '#fff0f0', color: '#c0392b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
};