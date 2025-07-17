import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faSignOutAlt,
  faChevronDown,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";

const UserDropdownAdmin = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        showDropdown &&
        event.target.closest(".dashboard-user-dropdown") === null
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="dashboard-user-dropdown" style={{ position: "relative" }}>
      <button
        onClick={handleDropdownToggle}
        className="dashboard-user-menu-btn"
        type="button"
        aria-haspopup="true"
        aria-expanded={showDropdown}
      >
        <div className="dashboard-user-avatar">AD</div>
        <span className="dashboard-user-name">Administrateur</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="dashboard-user-chevron"
        />
      </button>

      {showDropdown && (
        <div
          className="dashboard-user-content show"
          style={{ position: "absolute", right: 0, zIndex: 100 }}
        >
          <div className="dashboard-user-info">
            <p className="dashboard-user-fullname">Administrateur</p>
            <p className="dashboard-user-email">{user?.email}</p>
          </div>
          <div className="dashboard-dropdown-divider"></div>
          <a
            href="/my-account-admin"
            className="dashboard-dropdown-item"
            onClick={() => setShowDropdown(false)}
          >
            <FontAwesomeIcon
              icon={faUser}
              className="dashboard-dropdown-icon"
            />{" "}
            Mon compte
          </a>
          <button
            type="button"
            className="dashboard-dropdown-item"
            onClick={() => {
              window.location.href = "/gestion-utilisateurs";
              setShowDropdown(false);
            }}
          >
            <FontAwesomeIcon
              icon={faUsersCog}
              className="dashboard-dropdown-icon"
            />{" "}
            Gestion utilisateurs
          </button>
          <button
            type="button"
            className="dashboard-dropdown-item"
            onClick={() => {
              /* paramètres */
            }}
          >
            <FontAwesomeIcon icon={faCog} className="dashboard-dropdown-icon" />{" "}
            Paramètres
          </button>
          <div className="dashboard-dropdown-divider"></div>
          <button
            onClick={onLogout}
            className="dashboard-dropdown-item dashboard-logout-item"
          >
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="dashboard-dropdown-icon"
            />{" "}
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdownAdmin;
