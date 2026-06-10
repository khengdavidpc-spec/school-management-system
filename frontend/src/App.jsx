import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage     from './pages/LoginPage';
import StudentsPage  from './pages/StudentsPage';
import TeachersPage  from './pages/TeachersPage';
import AttendancePage from './pages/AttendancePage';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/students"  element={<PrivateRoute><StudentsPage /></PrivateRoute>} />
        <Route path="/teachers"  element={<PrivateRoute><TeachersPage /></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute><AttendancePage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}