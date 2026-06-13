import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../services/api';

const weekData = [
  { week: 'Week 1', present: 1, absent: 0 },
  { week: 'Week 2', present: 0, absent: 0  },
  { week: 'Week 3', present: 0, absent: 0 },
  { week: 'Week 4', present: 0, absent: 0 },
];

const subjectData = [
  { subject: 'Math',    score: 80 },
  { subject: 'English', score: 92 },
  { subject: 'Khmer', score: 75 },
  { subject: 'Chinese',    score: 60 },
  { subject: 'Computer', score: 96 },
];

const genderData = [
  { name: 'Male',   value: 0, color: '#f97316' },
  { name: 'Female', value: 1, color: '#22d3ee' },
  { name: 'Other',  value: 0,  color: '#94a3b8' },
];

const COLORS = ['#f97316', '#8b5cf6', '#22d3ee', '#10b981'];

export default function DashboardPage() {
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
    { label: 'Attendance Today', value: stats.attendance, icon: '📋', grad: '#10b981, #34d399', change: '+8%'  },
  ];

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Dashboard</h1>
          <p style={s.sub}>Welcome back, <strong>{user.name}</strong> 👋 Here's your school overview.</p>
        </div>
        <div style={s.dateBox}>
          <div style={s.dateDay}>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
          <div style={s.dateVal}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={s.cardGrid}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...s.statCard, background: `linear-gradient(135deg, ${c.grad})` }}>
            <div style={s.statTop}>
              <div>
                <div style={s.statValue}>{c.value}</div>
                <div style={s.statLabel}>{c.label}</div>
              </div>
              <div style={s.statIconWrap}>{c.icon}</div>
            </div>
            <div style={s.statChange}>↑ {c.change} this month</div>
          </div>
        ))}
      </div>

      {/* Row 2: Area chart + Pie */}
      <div style={s.row}>
        <div style={{ ...s.card, flex: 2 }}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>📈 Weekly Attendance Overview</div>
            <div style={s.legend}>
              <span style={s.dot('#f97316')}/><span style={s.legendText}>Present</span>
              <span style={{ marginLeft: '1rem' }}/>
              <span style={s.dot('#22d3ee')}/><span style={s.legendText}>Absent</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weekData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}/>
              <Area type="monotone" dataKey="present" stroke="#f97316" strokeWidth={2.5} fill="url(#gP)" dot={{ fill: '#f97316', r: 4 }}/>
              <Area type="monotone" dataKey="absent"  stroke="#22d3ee" strokeWidth={2.5} fill="url(#gA)" dot={{ fill: '#22d3ee', r: 4 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...s.card, flex: 1, minWidth: '260px' }}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>👥 Student Gender</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
            <PieChart width={180} height={180}>
              <Pie data={genderData} cx={90} cy={90} innerRadius={52} outerRadius={80} dataKey="value" strokeWidth={0}>
                {genderData.map((e, i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }}/>
            </PieChart>
          </div>
          <div style={s.pieLabels}>
            {genderData.map((d) => (
              <div key={d.name} style={s.pieLabel}>
                <span style={{ ...s.dot(d.color), display: 'inline-block' }}/>
                <span style={s.legendText}>{d.name} {d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Bar chart + Recent students */}
      <div style={s.row}>
        <div style={{ ...s.card, flex: 1 }}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>📊 Subject Performance</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]}/>
              <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={60}/>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '12px' }}/>
              <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...s.card, flex: 1 }}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>🎓 Recent Students</div>
            <a href="/students" style={s.viewAll}>View all →</a>
          </div>
          <div style={s.studentList}>
            {recentStudents.length === 0
              ? <div style={s.emptyMsg}>No students yet</div>
              : recentStudents.map((st, i) => (
                <div key={st.id} style={s.studentRow}>
                  <div style={{ ...s.sAvatar, background: COLORS[i % COLORS.length] }}>
                    {st.firstName?.charAt(0)}{st.lastName?.charAt(0)}
                  </div>
                  <div style={s.sInfo}>
                    <div style={s.sName}>{st.firstName} {st.lastName}</div>
                    <div style={s.sEmail}>{st.email}</div>
                  </div>
                  <span style={s.sGrade}>{st.grade || 'N/A'}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Row 4: System status */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardTitle}>⚙️ System Status</div>
          <span style={s.allGreen}>All systems operational</span>
        </div>
        <div style={s.statusGrid}>
          {[
            { label: 'Backend API',     detail: 'http://localhost:5000', status: 'Online'  },
            { label: 'PostgreSQL DB',   detail: 'Connected & synced',    status: 'Online'  },
            { label: 'CI/CD Pipeline',  detail: 'GitHub Actions',        status: 'Passing' },
            { label: 'Kubernetes',      detail: 'Minikube running',      status: 'Running' },
            { label: 'Prometheus',      detail: 'Scraping metrics',      status: 'Active'  },
            { label: 'Grafana',         detail: 'Dashboard live',        status: 'Active'  },
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
  );
}

const s = {
  page:        { padding: '2rem 2.5rem', minHeight: '100vh' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  title:       { fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.4rem' },
  sub:         { color: '#64748b', fontSize: '0.95rem' },
  dateBox:     { background: '#fff', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'right', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  dateDay:     { fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600' },
  dateVal:     { fontSize: '0.9rem', color: '#1e293b', fontWeight: '700', marginTop: '2px' },
  cardGrid:    { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' },
  statCard:    { borderRadius: '18px', padding: '1.5rem', color: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' },
  statTop:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' },
  statValue:   { fontSize: '2.5rem', fontWeight: '900', lineHeight: 1, marginBottom: '0.25rem' },
  statLabel:   { fontSize: '0.85rem', opacity: 0.9, fontWeight: '500' },
  statIconWrap: { fontSize: '2.2rem', opacity: 0.8 },
  statChange:  { fontSize: '0.78rem', opacity: 0.85, background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px' },
  row:         { display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' },
  card:        { background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  cardHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  cardTitle:   { fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' },
  legend:      { display: 'flex', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' },
  legendText:  { fontSize: '0.78rem', color: '#64748b' },
  dot:         (c) => ({ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: c, marginRight: '4px' }),
  pieLabels:   { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' },
  pieLabel:    { display: 'flex', alignItems: 'center', gap: '0.4rem' },
  viewAll:     { fontSize: '0.8rem', color: '#f97316', fontWeight: '600' },
  studentList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  studentRow:  { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', background: '#f8fafc', borderRadius: '10px' },
  sAvatar:     { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 },
  sInfo:       { flex: 1 },
  sName:       { fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' },
  sEmail:      { fontSize: '0.75rem', color: '#94a3b8' },
  sGrade:      { background: '#fff7ed', color: '#f97316', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  emptyMsg:    { textAlign: 'center', color: '#94a3b8', padding: '2rem' },
  allGreen:    { fontSize: '0.78rem', color: '#10b981', fontWeight: '600', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '20px' },
  statusGrid:  { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' },
  statusItem:  { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px' },
  statusDot:   { width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 },
  statusInfo:  { flex: 1 },
  statusLabel: { fontWeight: '600', color: '#1e293b', fontSize: '0.85rem' },
  statusDetail: { fontSize: '0.72rem', color: '#94a3b8', marginTop: '1px' },
  statusBadge: { fontSize: '0.72rem', fontWeight: '600', color: '#10b981', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '20px' },
};