import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import NavbarAdmin from "./NavbarAdmin";
import "./Dashboard.css";

const ValidateAccounts = () => {
  const { user, logout } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/admin/utilisateurs/demandes-validation",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Erreur de récupération des comptes");
        const data = await response.json();
        setAccounts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleValidate = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/admin/utilisateurs/${userId}/valider`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Erreur de validation");
      setAccounts(accounts.filter((acc) => acc.idUtilisateur !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt("Raison du refus:");
    if (reason) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/admin/utilisateurs/${userId}/rejeter`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason: reason }), // Clé explicite
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erreur de rejet");
        }

        setAccounts(accounts.filter((acc) => acc.idUtilisateur !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading-spinner">Chargement...</div>;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="body-dushboard">
      <div className="dashboard-container">
        <NavbarAdmin
          user={user}
          pendingCount={accounts.length}
          onLogout={logout}
        />

        <main className="dashboard-main">
          <div className="dashboard-back-container">
            <button
              onClick={() => window.history.back()}
              className="dashboard-back-btn"
            >
              <i className="fas fa-arrow-left"></i> Retour
            </button>
          </div>

          <div className="dashboard-accounts-header">
            <h1 className="dashboard-accounts-title">Validation des comptes</h1>
            <div className="dashboard-accounts-count">
              <i className="fas fa-info-circle"></i>
              {accounts.length} comptes en attente
            </div>
          </div>

          <div className="dashboard-accounts-list">
            <div className="dashboard-accounts-list-header">
              <div>Utilisateur</div>
              <div>Email</div>
              <div>Date</div>
              <div>Actions</div>
            </div>

            {accounts.map((account) => (
              <div
                key={account.idUtilisateur}
                className="dashboard-account-item"
              >
                <div className="dashboard-account-user">
                  <div className="dashboard-account-avatar">
                    {account.nom.charAt(0)}
                    {account.prenom.charAt(0)}
                  </div>
                  <span>
                    {account.nom} {account.prenom}
                  </span>
                </div>
                <div className="dashboard-account-email">{account.email}</div>
                <div className="dashboard-account-date">
                  {new Date(account.dateInscription).toLocaleDateString(
                    "fr-FR"
                  )}
                </div>
                <div className="dashboard-account-actions">
                  <button
                    onClick={() => handleValidate(account.idUtilisateur)}
                    className="dashboard-validate-btn"
                  >
                    <i className="fas fa-check"></i> Valider
                  </button>
                  <button
                    onClick={() => handleReject(account.idUtilisateur)}
                    className="dashboard-reject-btn"
                  >
                    <i className="fas fa-times"></i> Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ValidateAccounts;
