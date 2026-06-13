import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function StudentProfile() {
  const [myInfo, setMyInfo]   = useState(null);
  const [myClass, setMyClass] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const load = async () => {
      try {
        const [rs, rc] = await Promise.all([api.get('/students/me'), api.get('/classes').catch(() => ({ data: [] }))]);
        const me = rs.data;
        setMyInfo(me);
        if (me?.classId) setMyClass(rc.data.find((c) => c.id === me.classId));
      } catch {}
    };
    load();
  }, []);

  return (
    <div style={s.page}>
      <h1 style={s.title}>My Profile</h1>

      <div style={s.row}>
        <div style={s.profileCard}>
          <div style={s.avatarBig}>{user.name?.charAt(0)?.toUpperCase()}</div>
          <div style={s.profileName}>{user.name}</div>
          <div style={s.profileRole}>Student</div>
          <span style={s.statusBadge}>Active</span>
        </div>

        <div style={s.infoCard}>
          <div style={s.infoTitle}>Personal Information</div>
          <div style={s.infoGrid}>
            <div style={s.infoItem}><div style={s.infoKey}>📧 Email</div><div style={s.infoVal}>{user.email}</div></div>
            <div style={s.infoItem}><div style={s.infoKey}>👤 Full Name</div><div style={s.infoVal}>{myInfo ? `${myInfo.firstName} ${myInfo.lastName}` : user.name}</div></div>
            {myInfo?.sex && <div style={s.infoItem}><div style={s.infoKey}>⚧ Sex</div><div style={s.infoVal}>{myInfo.sex}</div></div>}
            {myInfo?.phone && <div style={s.infoItem}><div style={s.infoKey}>📱 Phone</div><div style={s.infoVal}>{myInfo.phone}</div></div>}
            {myInfo?.grade && <div style={s.infoItem}><div style={s.infoKey}>🎓 Grade</div><div style={s.infoVal}>{myInfo.grade}</div></div>}
            {myInfo?.enrollmentDate && <div style={s.infoItem}><div style={s.infoKey}>📅 Enrolled</div><div style={s.infoVal}>{myInfo.enrollmentDate}</div></div>}
          </div>

          {myClass && (
            <>
              <div style={s.infoTitle}>My Class</div>
              <div style={s.classBox}>
                <div style={s.classBoxIcon}>📚</div>
                <div>
                  <div style={s.classBoxName}>{myClass.name}</div>
                  <div style={s.classBoxDetail}>{myClass.grade} • {myClass.subject}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page:         { padding: '2rem 2.5rem' },
  title:        { fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.5rem' },
  row:          { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
  profileCard:  { background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', width: '220px', flexShrink: 0, textAlign: 'center' },
  avatarBig:    { width: '80px', height: '80px', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '2rem', margin: '0 auto 1rem' },
  profileName:  { fontWeight: '800', fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.3rem' },
  profileRole:  { fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' },
  statusBadge:  { background: '#d1fae5', color: '#065f46', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  infoCard:     { flex: 1, background: '#fff', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
  infoTitle:    { fontWeight: '700', color: '#1e293b', fontSize: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' },
  infoGrid:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
  infoItem:     { background: '#f8fafc', borderRadius: '10px', padding: '0.85rem' },
  infoKey:      { fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', marginBottom: '0.3rem' },
  infoVal:      { fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' },
  classBox:     { display: 'flex', alignItems: 'center', gap: '1rem', background: '#f5f3ff', borderRadius: '12px', padding: '1rem 1.25rem' },
  classBoxIcon: { fontSize: '2rem' },
  classBoxName: { fontWeight: '700', color: '#1e293b', fontSize: '1rem' },
  classBoxDetail: { fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' },
};
