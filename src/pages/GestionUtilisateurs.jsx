import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import NavbarAdmin from "../components/DashboardAdmin/NavbarAdmin";
import "../components/DashboardAdmin/Dashboard.css";

const GestionUtilisateurs = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/admin/utilisateurs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Erreur de récupération des utilisateurs");
        const data = await response.json();
        // Exclure les utilisateurs qui ont le rôle 'admin' dans leur tableau 'roles'
        setUsers(data.filter(u => !u.roles || !u.roles.some(role => typeof role === 'string' ? role === 'admin' : (role.name === 'admin' || role.authority === 'admin'))));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/admin/utilisateurs/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      setUsers(users.filter((u) => u.idUtilisateur !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (userId, currentValide) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/admin/utilisateurs/${userId}/valide`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ valide: !currentValide }),
        }
      );
      if (!response.ok) throw new Error("Erreur lors du changement d'état");
      setUsers(users.map(u => u.idUtilisateur === userId ? { ...u, valide: !currentValide } : u));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading-spinner">Chargement...</div>;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="body-dushboard">
      <div className="dashboard-container">
        <NavbarAdmin user={user} onLogout={logout} />
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
            <h1 className="dashboard-accounts-title">Gestion des utilisateurs</h1>
            <div className="dashboard-accounts-count">
              <i className="fas fa-info-circle"></i>
              {users.length} utilisateurs trouvés
            </div>
          </div>
          <div className="dashboard-accounts-list">
            <div className="dashboard-accounts-list-header">
              <div>Utilisateur</div>
              <div>Email</div>
              <div>Téléphone</div>
              <div>Validé</div>
              <div>Actions</div>
            </div>
            {users.map((u) => (
              <div key={u.idUtilisateur} className="dashboard-account-item">
                <div className="dashboard-account-user">
                  <div className="dashboard-account-avatar">
                    {u.nom?.charAt(0)}{u.prenom?.charAt(0)}
                  </div>
                  <span>{u.nom} {u.prenom}</span>
                </div>
                <div className="dashboard-account-email">{u.email}</div>
                <div className="dashboard-account-date">{u.numeroTelephone || '-'}</div>
                <div className="dashboard-account-date">{u.valide ? 'Oui' : 'Non'}</div>
                <div className="dashboard-account-actions">
                  <button
                    onClick={() => handleToggleActive(u.idUtilisateur, u.valide)}
                    className={u.valide ? "dashboard-toggle-disable-btn" : "dashboard-toggle-enable-btn"}
                  >
                    {u.valide ? <><i className="fas fa-user-slash"></i> Désactiver</> : <><i className="fas fa-user-check"></i> Activer</>}
                  </button>
                  <button
                    onClick={() => handleDelete(u.idUtilisateur)}
                    className="dashboard-reject-btn"
                  >
                    <i className="fas fa-trash"></i> Supprimer
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

export default GestionUtilisateurs;
