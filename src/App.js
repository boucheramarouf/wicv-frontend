import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupForm from "./components/SignupForm";
import DashboardUser from "./components/Dashboard/DashboardUser";
import DashboardAdmin from "./components/DashboardAdmin/DashboardAdmin";
import ValidateAccounts from "./components/DashboardAdmin/ValidateAccounts";
import GestionUtilisateurs from "./pages/GestionUtilisateurs";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import MyAccount from "./pages/MyAccount";
import MyAccountAdmin from "./pages/MyAccountAdmin";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/dashboardUser"
              element={
                <ProtectedRoute>
                  <DashboardUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboardAdmin"
              element={
                <AdminRoute>
                  <DashboardAdmin />
                </AdminRoute>
              }
            />
            <Route
              path="/validate-accounts"
              element={
                <AdminRoute>
                  <ValidateAccounts />
                </AdminRoute>
              }
            />
            <Route
              path="/gestion-utilisateurs"
              element={
                <AdminRoute>
                  <GestionUtilisateurs />
                </AdminRoute>
              }
            />
            <Route
              path="/my-account"
              element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-account-admin"
              element={
                <ProtectedRoute>
                  <MyAccountAdmin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
