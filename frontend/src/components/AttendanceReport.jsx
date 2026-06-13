import { useState } from 'react';
import axios from 'axios';
import ReportChart from './ReportChart';

const AttendanceReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ fromDate: '', toDate: '', studentId: '', classId: '' });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      const res = await axios.get('/api/reports/attendance', {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const reportData = res.data || {};
      setData({
        ...reportData,
        summary: Array.isArray(reportData.summary) ? reportData.summary : [],
        details: Array.isArray(reportData.details) ? reportData.details : [],
        totalRecords: reportData.totalRecords || 0,
        studentCount: reportData.studentCount || 0,
        period: reportData.period || {},
      });
    } catch (err) {
      alert('Error fetching report: ' + err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const downloadCSV = () => {
    if (!data?.summary) return;

    const headers = ['Student Name', 'Roll Number', 'Class', 'Present', 'Absent', 'Total Days', 'Attendance %'];
    const rows = data.summary.map((item) => [
      item.studentName,
      item.rollNumber,
      item.className,
      item.present,
      item.absent,
      item.totalDays,
      item.attendancePercentage + '%',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const chartData = data?.summary?.map((item) => ({
    name: item.studentName,
    present: item.present,
    absent: item.absent,
  })) || [];

  return (
    <div>
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
          <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} placeholder="From Date" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} placeholder="To Date" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <input type="text" name="studentId" value={filters.studentId} onChange={handleFilterChange} placeholder="Student ID" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <input type="text" name="classId" value={filters.classId} onChange={handleFilterChange} placeholder="Class ID" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <button onClick={fetchReport} disabled={loading} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
        {data && <button onClick={downloadCSV} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Download CSV</button>}
      </div>

      {data && (
        <div>
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px', border: '1px solid #b3d9ff' }}>
            <h4>Summary</h4>
            <p><strong>Total Students:</strong> {data.studentCount}</p>
            <p><strong>Total Records:</strong> {data.totalRecords}</p>
            <p><strong>Period:</strong> {data.period.fromDate || 'Any'} to {data.period.toDate || 'Any'}</p>
          </div>

          {chartData.length > 0 && <ReportChart data={chartData} title="Attendance Overview" type="bar" dataKeyX="name" dataKeyY1="present" dataKeyY2="absent" />}

          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
              <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Roll Number</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Class</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Present</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Absent</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Total Days</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {data.summary.map((item) => (
                  <tr key={item.studentId} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{item.studentName}</td>
                    <td style={{ padding: '12px' }}>{item.rollNumber}</td>
                    <td style={{ padding: '12px' }}>{item.className}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#28a745', fontWeight: 'bold' }}>{item.present}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#dc3545', fontWeight: 'bold' }}>{item.absent}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.totalDays}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>{item.attendancePercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
