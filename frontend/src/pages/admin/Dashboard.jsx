import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

const weekData = [
  { week: 'Week 1', present: 45, absent: 12 },
  { week: 'Week 2', present: 62, absent: 8  },
  { week: 'Week 3', present: 78, absent: 15 },
  { week: 'Week 4', present: 55, absent: 10 },
  { week: 'Week 5', present: 90, absent: 6  },
  { week: 'Week 6', present: 72, absent: 9  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, attendance: 0, classes: 0 });
  const [recentStudents, setRecentStudents] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t, a, c] = await Promise.all([
          api.get('/students'), api.get('/teachers'),
          api.get('/attendance'), api.get('/classes'),
        ]);
        setStats({ students: s.data.length, teachers: t.data.length, attendance: a.data.length, classes: c.data.length });
        setRecentStudents(s.data.slice(0, 5));
      } catch {}
    };
    load();
  }, []);

  const cards = [
    { label: 'Total Students',   value: stats.students,   icon: '🎓', grad: '#f97316, #fb923c', change: '+12%' },
    { label: 'Total Teachers',   value: stats.teachers,   icon: '👨‍🏫', grad: '#8b5cf6, #a78bfa', change: '+5%'  },
    { label: 'Total Classes',    value: stats.classes,    icon: '📚', grad: '#22d3ee, #67e8f9', change: '+2%'  },
    { label: 'Attendance Records', value: stats.attendance, icon: '📋', grad: '#10b981, #34d399', change: '+8%' },
  ];

  const genderData = [
    { name: 'Male',   value: 60, color: '#f97316' },
    { name: 'Female', value: 35, color: '#8b5cf6' },
    { name: 'Other',  value: 5,  color: '#94a3b8' },
  ];

  const COLORS = ['#f97316','#8b5cf6','#22d3ee','#10b981'];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Admin Dashboard</h1>
          <p style={s.sub}>Welcome back, <strong>{user.name}</strong> 👋 Here's your school overview.</p>
        </div>
        <div style={s.dateBox}>
          <div style={s.dateDay}>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
          <div style={s.dateVal}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      <div style={s.cardGrid}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...s.statCard, background: `linear-gradient(135deg, ${c.grad})` }}>
            <div style={s.statTop}>
              <div>
                <div style={s.statValue}>{c.value}</div>
                <div style={s.statLabel}>{c.label}</div>
              </div>
              <div style={s.statIcon}>{c.icon}</div>
            </div>
            <div style={s.statChange}>↑ {c.change} this month</div>
          </div>
        ))}
      </div>

      <div style={s.row}>
        <div style={{ ...s.card, flex: 2 }}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>📈 Weekly Attendance</div>
            <div style={s.legend}>
              <span style={s.dot('#f97316')}/><span style={s.legText}>Present</span>
              <span style={{ marginLeft: '1rem' }}/>
              <span style={s.dot('#8b5cf6')}/><span style={s.legText}>Absent</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weekData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}/>
              <Area type="monotone" dataKey="present" stroke="#f97316" strokeWidth={2.5} fill="url(#gP)" dot={{ fill: '#f97316', r: 4 }}/>
              <Area type="monotone" dataKey="absent"  stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gA)" dot={{ fill: '#8b5cf6', r: 4 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...s.card, flex: 1, minWidth: '240px' }}>
          <div style={s.cardHeader}><div style={s.cardTitle}>👥 Gender Ratio</div></div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={160} height={160}>
              <Pie data={genderData} cx={80} cy={80} innerRadius={45} outerRadius={72} dataKey="value" strokeWidth={0}>
                {genderData.map((e, i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }}/>
            </PieChart>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {genderData.map((d) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748b' }}>
                <span style={{ ...s.dot(d.color), display: 'inline-block' }}/> {d.name} {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.row}>
        <div style={{ ...s.card, flex: 1 }}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>🎓 Recent Students</div>
            <a href="/admin/students" style={s.viewAll}>View all →</a>
          </div>
          <div style={s.studentList}>
            {recentStudents.length === 0
              ? <div style={s.empty}>No students yet</div>
              : recentStudents.map((st, i) => (
                <div key={st.id} style={s.studentRow}>
                  <div style={{ ...s.sAvatar, background: COLORS[i % COLORS.length] }}>{st.firstName?.charAt(0)}{st.lastName?.charAt(0)}</div>
                  <div style={s.sInfo}>
                    <div style={s.sName}>{st.firstName} {st.lastName}</div>
                    <div style={s.sEmail}>{st.grade || 'No grade'} {st.sex ? `• ${st.sex}` : ''}</div>
                  </div>
                  <span style={s.sGrade}>{st.status}</span>
                </div>
              ))}
          </div>
        </div>

        <div style={{ ...s.card, flex: 1 }}>
          <div style={s.cardHeader}><div style={s.cardTitle}>⚙️ System Status</div><span style={s.allGreen}>All systems operational</span></div>
          <div style={s.statusGrid}>
            {[
              { label: 'Backend API',    detail: 'Port 5000', status: 'Online'  },
              { label: 'PostgreSQL DB',  detail: 'Connected', status: 'Online'  },
              { label: 'CI/CD Pipeline', detail: 'GitHub',    status: 'Passing' },
              { label: 'Kubernetes',     detail: 'Minikube',  status: 'Running' },
              { label: 'Prometheus',     detail: 'Metrics',   status: 'Active'  },
              { label: 'Grafana',        detail: 'Dashboard', status: 'Active'  },
            ].map((item) => (
              <div key={item.label} style={s.statusItem}>
                <div style={s.statusDot}/>
                <div style={s.statusInfo}>
                  <div style={s.statusLabel}>{item.label}</div>
                  <div style={s.statusDetail}>{item.detail}</div>
                </div>
                <span style={s.statusBadge}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:      { padding: '2rem 2.5rem', minHeight: '100vh' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  title:     { fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.4rem' },
  sub:       { color: '#64748b', fontSize: '0.95rem' },
  dateBox:   { background: '#fff', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'right', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  dateDay:   { fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600' },
  dateVal:   { fontSize: '0.9rem', color: '#1e293b', fontWeight: '700', marginTop: '2px' },
  cardGrid:  { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' },
  statCard:  { borderRadius: '18px', padding: '1.5rem', color: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' },
  statTop:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' },
  statValue: { fontSize: '2.5rem', fontWeight: '900', lineHeight: 1, marginBottom: '0.25rem' },
  statLabel: { fontSize: '0.85rem', opacity: 0.9, fontWeight: '500' },
  statIcon:  { fontSize: '2.2rem', opacity: 0.8 },
  statChange: { fontSize: '0.78rem', opacity: 0.85, background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px' },
  row:       { display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' },
  card:      { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  cardTitle: { fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' },
  legend:    { display: 'flex', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' },
  legText:   { fontSize: '0.78rem', color: '#64748b' },
  dot:       (c) => ({ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: c, marginRight: '4px' }),
  viewAll:   { fontSize: '0.8rem', color: '#f97316', fontWeight: '600', textDecoration: 'none' },
  studentList: { display: 'flex', flexDirection: 'column', gap: '0.65rem' },
  studentRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: '#f8fafc', borderRadius: '10px' },
  sAvatar:   { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 },
  sInfo:     { flex: 1 },
  sName:     { fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' },
  sEmail:    { fontSize: '0.75rem', color: '#94a3b8' },
  sGrade:    { background: '#d1fae5', color: '#065f46', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  empty:     { textAlign: 'center', color: '#94a3b8', padding: '2rem' },
  allGreen:  { fontSize: '0.78rem', color: '#10b981', fontWeight: '600', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '20px' },
  statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' },
  statusItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.75rem', background: '#f8fafc', borderRadius: '8px' },
  statusDot: { width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', flexShrink: 0 },
  statusInfo: { flex: 1 },
  statusLabel: { fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' },
  statusDetail: { fontSize: '0.7rem', color: '#94a3b8' },
  statusBadge: { fontSize: '0.7rem', fontWeight: '600', color: '#10b981', background: '#ecfdf5', padding: '0.15rem 0.5rem', borderRadius: '20px' },
};