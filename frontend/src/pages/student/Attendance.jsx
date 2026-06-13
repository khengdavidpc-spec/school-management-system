import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/attendance/my');
        setRecords(res.data.map((r) => ({ ...r, studentName: `${r.student?.firstName || ''} ${r.student?.lastName || ''}`.trim() })));
      } catch {}
    };
    load();
  }, []);

  const present = records.filter((r) => r.status === 'present').length;
  const absent  = records.filter((r) => r.status === 'absent').length;
  const late    = records.filter((r) => r.status === 'late').length;
  const pct     = records.length > 0 ? Math.round((present / records.length) * 100) : 0;

  const statusStyle = {
    present: { bg: '#d1fae5', color: '#065f46', icon: '✅' },
    absent:  { bg: '#fef2f2', color: '#dc2626', icon: '❌' },
    late:    { bg: '#fef3c7', color: '#92400e', icon: '⏰' },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>My Attendance</h1>
        <p style={s.sub}>{records.length} total records</p>
      </div>

      <div style={s.summaryRow}>
        {[
          { label: 'Attendance Rate', value: `${pct}%`, color: '#10b981', bg: '#ecfdf5', icon: '📈' },
          { label: 'Present',         value: present,   color: '#10b981', bg: '#d1fae5', icon: '✅' },
          { label: 'Absent',          value: absent,    color: '#ef4444', bg: '#fef2f2', icon: '❌' },
          { label: 'Late',            value: late,      color: '#f59e0b', bg: '#fffbeb', icon: '⏰' },
        ].map((c) => (
          <div key={c.label} style={{ ...s.summaryCard, background: c.bg }}>
            <div style={s.summaryTop}><span style={{ fontSize: '1.5rem' }}>{c.icon}</span><span style={{ ...s.summaryValue, color: c.color }}>{c.value}</span></div>
            <div style={{ ...s.summaryLabel, color: c.color }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={s.tableCard}>
        <div style={s.tableTop}><span style={s.tableTitle}>Attendance History</span></div>
        <table style={s.table}>
          <thead><tr style={s.thead}><th style={s.th}>#</th><th style={s.th}>Date</th><th style={s.th}>Status</th><th style={s.th}>Notes</th></tr></thead>
          <tbody>
            {records.length === 0
              ? <tr><td colSpan="4" style={s.empty}>No attendance records yet</td></tr>
              : records.map((r, i) => { const ss = statusStyle[r.status] || {};
                return (<tr key={r.id} style={s.tr}><td style={{ ...s.td, color: '#94a3b8', fontSize: '0.78rem' }}>{i + 1}</td><td style={s.td}>{r.date}</td><td style={s.td}><span style={{ ...s.statusBadge, background: ss.bg, color: ss.color }}>{ss.icon} {r.status}</span></td><td style={s.td}>{r.notes || '—'}</td></tr>);
              })}
          </tbody>
        </table>
        <div style={s.tableFooter}>{records.length} total attendance records</div>
      </div>
    </div>
  );
}

const s = {
  page:        { padding: '2rem 2.5rem' },
  header:      { marginBottom: '1.5rem' },
  title:       { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' },
  sub:         { color: '#94a3b8', fontSize: '0.875rem', marginTop: '2px' },
  summaryRow:  { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  summaryCard: { borderRadius: '14px', padding: '1.25rem' },
  summaryTop:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  summaryValue: { fontSize: '2rem', fontWeight: '900', lineHeight: 1 },
  summaryLabel: { fontSize: '0.82rem', fontWeight: '700' },
  tableCard:   { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' },
  tableTop:    { padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' },
  tableTitle:  { fontWeight: '700', color: '#1e293b', fontSize: '1rem' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  thead:       { background: '#f8fafc' },
  th:          { padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tr:          { borderBottom: '1px solid #f8fafc' },
  td:          { padding: '0.9rem 1.25rem', fontSize: '0.875rem', color: '#374151' },
  statusBadge: { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  empty:       { textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.9rem' },
  tableFooter: { padding: '0.85rem 1.5rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
};
