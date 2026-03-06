import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import RiskPrediction from './pages/RiskPrediction';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserProfile from './pages/UserProfile';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';
import StaffAlerts from './pages/StaffAlerts';
import BatchUpload from './pages/BatchUpload';
import StudentNotifications from './pages/StudentNotifications';
import StudentResources from './pages/StudentResources';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user role is allowed
  if (allowedRoles) {
    const userRole = localStorage.getItem('role');
    if (!allowedRoles.includes(userRole)) {
      // Redirect to their appropriate dashboard
      return <Navigate to={userRole === 'student' ? '/student-dashboard' : '/dashboard'} />;
    }
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<DashboardLayout />}>
        {/* Staff/Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <StudentList />
          </ProtectedRoute>
        } />
        <Route path="/add-student" element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <StudentForm />
          </ProtectedRoute>
        } />
        <Route path="/edit-student/:id" element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <StudentForm />
          </ProtectedRoute>
        } />
        <Route path="/staff/alerts" element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <StaffAlerts />
          </ProtectedRoute>
        } />
        <Route path="/staff/batch-upload" element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <BatchUpload />
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/notifications" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentNotifications />
          </ProtectedRoute>
        } />
        <Route path="/student/resources" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentResources />
          </ProtectedRoute>
        } />

        {/* Shared Routes */}
        <Route path="/predict" element={
          <ProtectedRoute allowedRoles={['staff', 'admin', 'student']}>
            <RiskPrediction />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['staff', 'admin', 'student']}>
            <UserProfile />
          </ProtectedRoute>
        } />
      </Route>
    </Routes >
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
