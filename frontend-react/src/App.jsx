import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Invoices from './pages/Invoices';
import Employees from './pages/Employees';
import Interns from './pages/Interns';
import Documents from './pages/Documents';
import Users from './pages/Users';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="projects" element={<ProtectedRoute roles={['superAdmin', 'admin']}><Projects /></ProtectedRoute>} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="invoices" element={<ProtectedRoute roles={['superAdmin', 'admin']}><Invoices /></ProtectedRoute>} />
        <Route path="employees" element={<ProtectedRoute roles={['superAdmin', 'admin']}><Employees /></ProtectedRoute>} />
        <Route path="interns" element={<Interns />} />
        <Route path="documents" element={<Documents />} />
        <Route path="users" element={<ProtectedRoute roles={['superAdmin']}><Users /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
