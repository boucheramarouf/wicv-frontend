import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import CVListAdmin from './CVListAdmin';
import { useAuth } from '../../AuthContext';
import './Dashboard.css';
import WICVLoader from './../WICVLoader';

const DashboardAdmin = () => {
  const { user, logout } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [cvsRes, accountsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/admin/cvs', { headers }),
          axios.get('http://localhost:8080/api/admin/utilisateurs/demandes-validation', { headers })
        ]);

        setCvs(cvsRes.data.content); // Supposant une pagination
        setPendingAccounts(accountsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleValidateAccount = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/admin/utilisateurs/${userId}/valider`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingAccounts(pendingAccounts.filter(acc => acc.idUtilisateur !== userId));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  
  if (loading) return <WICVLoader />; // Utilisez le nouveau loader
  
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="body-dushboard">
      <div className="dashboard-container">
        <NavbarAdmin user={user} pendingCount={pendingAccounts.length} onLogout={logout} />

        <main className="dashboard-main">
          <div className="dashboard-welcome" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="dashboard-welcome-title">
              Tableau de bord Administrateur
            </h1>
            <p className="dashboard-welcome-subtitle">
              Gestion des CVs et des comptes utilisateurs
            </p>
          </div>

          <div className="dashboard-generate-btn-container" style={{ width: '100%' }}>
            <button 
              className="dashboard-generate-btn"
              onClick={() => window.location.href = '/validate-accounts'}
            >
              <i className="fas fa-user-check dashboard-generate-icon"></i>
              Valider les nouveaux comptes
              {pendingAccounts.length > 0 && (
                <span className="dashboard-pending-badge">{pendingAccounts.length}</span>
              )}
            </button>
          </div>

          <div className="dashboard-scrollable-container">
            <CVListAdmin cvs={cvs} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;