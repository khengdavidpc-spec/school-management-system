import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public
import HomePage    from './pages/public/HomePage';
import LoginPage   from './pages/public/LoginPage';

// Layouts
import AdminLayout   from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';

// Admin pages
import AdminDashboard  from './pages/admin/Dashboard';
import AdminStudents   from './pages/admin/Students';
import AdminTeachers   from './pages/admin/Teachers';
import AdminClasses    from './pages/admin/Classes';
import AdminAttendance from './pages/admin/Attendance';
import AdminGrades     from './pages/admin/Grades';
import AdminUsers      from './pages/admin/Users';

// Teacher pages
import TeacherDashboard  from './pages/teacher/Dashboard';
import TeacherClasses    from './pages/teacher/Classes';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherGrades     from './pages/teacher/Grades';
import TeacherStudents   from './pages/teacher/Students';

// Student pages
import StudentDashboard  from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentGrades     from './pages/student/Grades';
import StudentProfile    from './pages/student/Profile';

const getUser = () => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } };

const PrivateRoute = ({ children, roles }) => {
  const user = getUser();
  if (!user || !localStorage.getItem('token')) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role}/dashboard`} />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard"  element={<AdminDashboard />} />
          <Route path="students"   element={<AdminStudents />} />
          <Route path="teachers"   element={<AdminTeachers />} />
          <Route path="classes"    element={<AdminClasses />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="grades"     element={<AdminGrades />} />
          <Route path="users"      element={<AdminUsers />} />
        </Route>

        {/* Teacher */}
        <Route path="/teacher" element={<PrivateRoute roles={['teacher']}><TeacherLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/teacher/dashboard" />} />
          <Route path="dashboard"  element={<TeacherDashboard />} />
          <Route path="classes"    element={<TeacherClasses />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="grades"     element={<TeacherGrades />} />
          <Route path="students"   element={<TeacherStudents />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<PrivateRoute roles={['student']}><StudentLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/student/dashboard" />} />
          <Route path="dashboard"  element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="grades"     element={<StudentGrades />} />
          <Route path="profile"    element={<StudentProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}