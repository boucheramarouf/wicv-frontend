import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

const Navbar = ({ user }) => {
  const [notifications, setNotifications] = useState([]); // État pour les notifications
  const [loading, setLoading] = useState(true); // État pour savoir si les notifications sont en cours de chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs de récupération des notifications

  useEffect(() => {
    if (user) {
      // Assurez-vous que 'user' est défini avant de faire l'appel API
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `http://localhost:8080/api/user/${user.idUtilisateur}/notifications`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!res.ok) {
            throw new Error("Erreur lors de la récupération des notifications");
          }

          const data = await res.json();
          setNotifications(data); // Mise à jour de l'état des notifications
        } catch (err) {
          setError(err.message); // Gérer les erreurs
        } finally {
          setLoading(false); // Marquer comme terminé
        }
      };

      fetchNotifications();
    }
  }, [user]); // Déclenche l'effet uniquement quand `user` change

  if (!user) return null; // Protection : n'affiche rien tant que user n'est pas chargé

  // Filtrer les notifications non lues
  const unreadCount = notifications.filter((n) => !n.lu).length;

  return (
    <nav
      className="dashboard-nav-gradient text-white shadow-lg"
      style={{ width: "100%" }}
    >
      <div className="dashboard-nav-container">
        {/* Logo */}
        <div className="dashboard-logo-container">
          <div className="dashboard-logo-text">
            <span className="dashboard-wi">WI</span>
            <span className="dashboard-cv">CV</span>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="dashboard-search-container">
          <div className="dashboard-search-wrapper">
            <div className="dashboard-search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
              className="dashboard-search-input"
              placeholder="Rechercher un CV..."
              type="search"
            />
          </div>
        </div>

        {/* Menu droit */}
        <div className="dashboard-right-menu">
          {/* Icône maison pour retour dashboard */}
          <Link to="/dashboardUser" className="dashboard-home-btn">
            <FontAwesomeIcon icon={faHome} />
          </Link>
          {/* Affichage des notifications */}
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            setNotifications={setNotifications} // La fonction pour mettre à jour les notifications
          />
          {/* Menu utilisateur */}
          <UserDropdown
            user={user}
            initials={`${user.nom.charAt(0).toUpperCase()}${user.prenom
              .charAt(0)
              .toUpperCase()}`}
          />
        </div>
      </div>

      {/* Affichage de l'état de chargement ou erreur */}
      {loading && <p>Chargement des notifications...</p>}
      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
    </nav>
  );
};

export default Navbar;
