import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import StudentsPage   from './pages/StudentsPage';
import TeachersPage   from './pages/TeachersPage';
import AttendancePage from './pages/AttendancePage';
import ClassesPage    from './pages/ClassesPage';
import Layout         from './components/Layout';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard"  element={<DashboardPage />} />
          <Route path="students"   element={<StudentsPage />} />
          <Route path="teachers"   element={<TeachersPage />} />
          <Route path="classes"    element={<ClassesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}