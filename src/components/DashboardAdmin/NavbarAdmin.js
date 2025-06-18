import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import NotificationDropdown from '../Dashboard/NotificationDropdown';
import UserDropdownAdmin from './UserDropdownAdmin';

const NavbarAdmin = ({ user, pendingCount, onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:8080/api/user/${user.idUtilisateur}/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) throw new Error('Erreur lors de la récupération des notifications');
          const data = await res.json();
          setNotifications(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.lu).length;

  return (
    <nav className="dashboard-nav-gradient text-white shadow-lg" style={{ width: '100%' }}>
      <div className="dashboard-nav-container">
        <div className="dashboard-logo-container">
          <div className="dashboard-logo-text">
            <span className="dashboard-wi">WI</span>
            <span className="dashboard-cv">CV</span>
            <span className="dashboard-admin-badge">ADMIN</span>
          </div>
        </div>

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

        <div className="dashboard-right-menu">
          <NotificationDropdown 
            notifications={notifications} 
            unreadCount={unreadCount}
            setNotifications={setNotifications}
          />
          <UserDropdownAdmin user={user} onLogout={onLogout} />
        </div>
      </div>
      
      {loading && <p>Chargement des notifications...</p>}
      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
    </nav>
  );
};

export default NavbarAdmin;