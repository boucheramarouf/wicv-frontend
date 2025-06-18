import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../AuthContext';

const UserDropdown = ({ user, initials }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="dashboard-user-dropdown">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="dashboard-user-menu-btn"
      >
        <div className="dashboard-user-avatar">{initials}</div>
        <span className="dashboard-user-name">{user?.nom} {user?.prenom}</span>
        <FontAwesomeIcon icon={faChevronDown} className="dashboard-user-chevron" />
      </button>

      {showDropdown && (
        <div className="dashboard-user-content">
          <div className="dashboard-user-info">
            <p className="dashboard-user-fullname">{user?.nom} {user?.prenom}</p>
            <p className="dashboard-user-email">{user?.email}</p>
          </div>
          <div className="dashboard-dropdown-divider"></div>
          <a href="#" className="dashboard-dropdown-item">
            <FontAwesomeIcon icon={faUser} className="dashboard-dropdown-icon" /> Mon compte
          </a>
          <a href="#" className="dashboard-dropdown-item">
            <FontAwesomeIcon icon={faCog} className="dashboard-dropdown-icon" /> Paramètres
          </a>
          <div className="dashboard-dropdown-divider"></div>
          <button 
            onClick={logout}
            className="dashboard-dropdown-item dashboard-logout-item"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="dashboard-dropdown-icon" /> Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;