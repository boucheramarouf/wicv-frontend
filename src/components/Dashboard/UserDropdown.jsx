import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../AuthContext";
import { Link } from "react-router-dom";

const UserDropdown = ({ user, initials }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="dashboard-user-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="dashboard-user-menu-btn"
        type="button"
      >
        <div className="dashboard-user-avatar">{initials}</div>
        <span className="dashboard-user-name">
          {user?.nom} {user?.prenom}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="dashboard-user-chevron"
        />
      </button>
      <div className={`dashboard-user-content${showDropdown ? " show" : ""}`}>
        <div className="dashboard-user-info">
          <p className="dashboard-user-fullname">
            {user?.nom} {user?.prenom}
          </p>
          <p className="dashboard-user-email">{user?.email}</p>
        </div>
        <div className="dashboard-dropdown-divider"></div>
        <Link
          to="/my-account"
          className="dashboard-dropdown-item"
          onClick={() => setShowDropdown(false)}
        >
          <FontAwesomeIcon icon={faUser} className="dashboard-dropdown-icon" />{" "}
          Mon compte
        </Link>
        <button className="dashboard-dropdown-item" type="button">
          <FontAwesomeIcon icon={faCog} className="dashboard-dropdown-icon" />{" "}
          Paramètres
        </button>
        <div className="dashboard-dropdown-divider"></div>
        <button
          onClick={logout}
          className="dashboard-dropdown-item dashboard-logout-item"
          type="button"
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="dashboard-dropdown-icon"
          />{" "}
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
