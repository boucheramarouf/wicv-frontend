import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faChevronDown, faUsersCog } from '@fortawesome/free-solid-svg-icons';

const UserDropdownAdmin = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="dashboard-user-dropdown">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="dashboard-user-menu-btn"
      >
        <div className="dashboard-user-avatar">AD</div>
        <span className="dashboard-user-name">Administrateur</span>
        <FontAwesomeIcon icon={faChevronDown} className="dashboard-user-chevron" />
      </button>

      {showDropdown && (
        <div className="dashboard-user-content">
          <div className="dashboard-user-info">
            <p className="dashboard-user-fullname">Administrateur</p>
            <p className="dashboard-user-email">{user?.email}</p>
          </div>
          <div className="dashboard-dropdown-divider"></div>
          <a href="#" className="dashboard-dropdown-item">
            <FontAwesomeIcon icon={faUser} className="dashboard-dropdown-icon" /> Mon compte
          </a>
          <a href="#" className="dashboard-dropdown-item">
            <FontAwesomeIcon icon={faUsersCog} className="dashboard-dropdown-icon" /> Gestion utilisateurs
          </a>
          <a href="#" className="dashboard-dropdown-item">
            <FontAwesomeIcon icon={faCog} className="dashboard-dropdown-icon" /> Paramètres
          </a>
          <div className="dashboard-dropdown-divider"></div>
          <button 
            onClick={onLogout}
            className="dashboard-dropdown-item dashboard-logout-item"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="dashboard-dropdown-icon" /> Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdownAdmin;