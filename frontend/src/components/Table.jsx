export default function Table({ columns, data, onEdit, onDelete }) {
  if (!data.length) return <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>No records found.</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={styles.th}>{col.label}</th>
            ))}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} style={styles.tr}>
              {columns.map((col) => (
                <td key={col.key} style={styles.td}>{row[col.key]}</td>
              ))}
              <td style={styles.td}>
                <button style={styles.editBtn}  onClick={() => onEdit(row)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => onDelete(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table:     { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th:        { background: '#f8f9fa', padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.85rem', color: '#555', borderBottom: '2px solid #eee' },
  tr:        { borderBottom: '1px solid #f0f0f0' },
  td:        { padding: '0.75rem 1rem', fontSize: '0.9rem' },
  editBtn:   { background: '#4f46e5', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '5px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem' },
  deleteBtn: { background: '#e74c3c', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' },
};