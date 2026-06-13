import { useState } from 'react';
import axios from 'axios';
import ReportChart from './ReportChart';

const FinancialSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ fromMonth: '', toMonth: '' });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      const res = await axios.get('/api/reports/financial', {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const reportData = res.data || {};
      setData({
        ...reportData,
        costPerTeacher: Array.isArray(reportData.costPerTeacher) ? reportData.costPerTeacher : [],
        summary: reportData.summary || { totalPaid: 0, totalPending: 0, totalProcessed: 0, totalCancelled: 0, totalPayroll: 0 },
        totalTeachers: reportData.totalTeachers || 0,
        averageTeacherCost: reportData.averageTeacherCost || 0,
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
    if (!data?.costPerTeacher) return;

    const headers = ['Teacher Name', 'Total Salary', 'Average Salary', 'Record Count'];
    const rows = data.costPerTeacher.map((item) => [
      item.teacherName,
      item.totalSalary.toFixed(2),
      item.averageSalary.toFixed(2),
      item.recordCount,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-summary-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const statusChartData = data?.summary ? [
    { name: 'Paid', value: data.summary.totalPaid },
    { name: 'Pending', value: data.summary.totalPending },
    { name: 'Processed', value: data.summary.totalProcessed },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
          <input type="month" name="fromMonth" value={filters.fromMonth} onChange={handleFilterChange} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <input type="month" name="toMonth" value={filters.toMonth} onChange={handleFilterChange} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <button onClick={fetchReport} disabled={loading} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
        {data && <button onClick={downloadCSV} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Download CSV</button>}
      </div>

      {data && (
        <div>
          <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px', border: '1px solid #b3d9ff' }}>
              <strong>Total Paid</strong>
              <p style={{ fontSize: '24px', color: '#28a745', margin: '5px 0 0 0', fontWeight: 'bold' }}>₱{data.summary.totalPaid.toFixed(2)}</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107' }}>
              <strong>Total Pending</strong>
              <p style={{ fontSize: '24px', color: '#ffc107', margin: '5px 0 0 0', fontWeight: 'bold' }}>₱{data.summary.totalPending.toFixed(2)}</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '4px', border: '1px solid #17a2b8' }}>
              <strong>Total Processed</strong>
              <p style={{ fontSize: '24px', color: '#17a2b8', margin: '5px 0 0 0', fontWeight: 'bold' }}>₱{data.summary.totalProcessed.toFixed(2)}</p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px', border: '1px solid #dc3545' }}>
              <strong>Total Cancelled</strong>
              <p style={{ fontSize: '24px', color: '#dc3545', margin: '5px 0 0 0', fontWeight: 'bold' }}>₱{data.summary.totalCancelled.toFixed(2)}</p>
            </div>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px', border: '2px solid #333' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Total Payroll</h3>
            <p style={{ fontSize: '32px', color: '#007bff', margin: 0, fontWeight: 'bold' }}>₱{data.summary.totalPayroll.toFixed(2)}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>Period: {data.period.fromMonth || 'Any'} to {data.period.toMonth || 'Any'}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {statusChartData.length > 0 && statusChartData.some(d => d.value > 0) && (
              <ReportChart data={statusChartData} title="Payroll Status Distribution" type="pie" dataKey="value" />
            )}
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            <h4>Summary Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ccc' }}>
                <strong>Total Teachers</strong>
                <p style={{ fontSize: '20px', color: '#007bff', margin: '5px 0 0 0' }}>{data.totalTeachers}</p>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ccc' }}>
                <strong>Average Teacher Cost</strong>
                <p style={{ fontSize: '20px', color: '#28a745', margin: '5px 0 0 0' }}>₱{data.averageTeacherCost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
              <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Teacher Name</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Total Salary</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Average Salary</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Record Count</th>
                </tr>
              </thead>
              <tbody>
                {data.costPerTeacher.map((teacher) => (
                  <tr key={teacher.teacherId} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{teacher.teacherName}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>₱{teacher.totalSalary.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>₱{teacher.averageSalary.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{teacher.recordCount}</td>
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

export default FinancialSummary;
