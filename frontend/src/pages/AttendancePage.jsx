import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import api from '../services/api';

const empty = { studentId: '', date: '', status: 'present', notes: '' };

export default function AttendancePage() {
  const [records, setRecords]   = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');

  const load = async () => {
    const [att, stu] = await Promise.all([api.get('/attendance'), api.get('/students')]);
    setRecords(att.data.map((r) => ({
      ...r,
      studentName: `${r.student?.firstName || ''} ${r.student?.lastName || ''}`.trim(),
    })));
    setStudents(stu.data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.put(`/attendance/${editId}`, form);
      } else {
        await api.post('/attendance', form);
      }
      setForm(empty);
      setEditId(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving record');
    }
  };

  const handleEdit = (record) => {
    setForm({ studentId: record.studentId, date: record.date, status: record.status, notes: record.notes || '' });
    setEditId(record.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    await api.delete(`/attendance/${id}`);
    load();
  };

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'date',        label: 'Date' },
    { key: 'status',      label: 'Status' },
    { key: 'notes',       label: 'Notes' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Attendance</h2>
          <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}>
            {showForm ? 'Cancel' : '+ Mark Attendance'}
          </button>
        </div>

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={{ margin: '0 0 1rem' }}>{editId ? 'Edit Record' : 'Mark Attendance'}</h3>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} style={styles.form}>
              <select style={styles.input} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
              <input style={styles.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              <select style={styles.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
              <input style={styles.input} placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <button style={styles.saveBtn} type="submit">{editId ? 'Update' : 'Save'}</button>
            </form>
          </div>
        )}

        <Table columns={columns} data={records} onEdit={handleEdit} onDelete={handleDelete} />
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