import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupForm from './components/SignupForm';
import DashboardUser from './components/Dashboard/DashboardUser';
import DashboardAdmin from './components/DashboardAdmin/DashboardAdmin';
import ValidateAccounts from './components/DashboardAdmin/ValidateAccounts';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/dashboardUser" element={
              <ProtectedRoute>
                <DashboardUser />
              </ProtectedRoute>
            } />
            <Route path="/dashboardAdmin" element={
              <AdminRoute>
                <DashboardAdmin />
              </AdminRoute>
            } />
            <Route path="/validate-accounts" element={
              <AdminRoute>
                <ValidateAccounts />
              </AdminRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;