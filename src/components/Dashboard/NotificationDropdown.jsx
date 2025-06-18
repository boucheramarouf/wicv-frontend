import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faArrowLeft, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../AuthContext';

const NotificationDropdown = ({ notifications = [], unreadCount = 0, setNotifications }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationClick = async (notification, e) => {
    e.stopPropagation(); // Empêche la propagation du click
    
    if (!notification.lu) {
      try {
        const userId = user?.idUtilisateur;
        if (!userId) {
          console.error("ID utilisateur manquant");
          return;
        }

        const response = await fetch(`http://localhost:8080/api/user/${userId}/notifications/${notification.id}/marquer-lue`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setNotifications(prevNotifications =>
            prevNotifications.map(n => 
              n.id === notification.id ? { ...n, lu: true } : n
            )
          );
        }
      } catch (err) {
        console.error('Erreur lors de la mise à jour de la notification', err);
      }
    }

    setSelectedNotification(notification);
    setShowDetail(true);
  };

  const markAllAsRead = async (e) => {
    e.stopPropagation(); // Empêche la fermeture du dropdown
    try {
      const userId = user?.idUtilisateur;
      if (!userId) {
        console.error("ID utilisateur manquant");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/user/${userId}/notifications/marquer-toutes-lues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(prevNotifications =>
          prevNotifications.map(n => ({ ...n, lu: true }))
        );
      }
    } catch (err) {
      console.error('Erreur lors du marquage des notifications comme lues', err);
    }
  };

  const backToList = (e) => {
    e.stopPropagation();
    setShowDetail(false);
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleString('fr-FR');
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setShowDropdown(prev => !prev);
    setShowDetail(false);
  };

  // Fermer le dropdown quand on clique en dehors
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) {
        setShowDropdown(false);
        setShowDetail(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="dashboard-notification-dropdown" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={handleDropdownToggle}
        className="dashboard-notification-btn"
      >
        <div className="dashboard-notification-icon-wrapper">
          <FontAwesomeIcon icon={faBell} className="dashboard-notification-icon" />
          {unreadCount > 0 && (
            <span className="dashboard-notification-badge">{unreadCount}</span>
          )}
        </div>
      </button>

      {showDropdown && (
        <div className="dashboard-notification-content" onClick={(e) => e.stopPropagation()}>
          {!showDetail ? (
            <>
              <div className="dashboard-notification-header">
                <span>Notifications</span>
                <div className="dashboard-notification-actions">
                  {unreadCount > 0 && (
                    <>
                      <span className="dashboard-unread-count">{unreadCount} non lues</span>
                      <button 
                        className="dashboard-mark-all-read"
                        onClick={markAllAsRead}
                        title="Marquer toutes comme lues"
                      >
                        <FontAwesomeIcon icon={faCheckDouble} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="dashboard-notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`dashboard-notification-item ${!notification.lu ? 'unread' : 'read'}`}
                      onClick={(e) => handleNotificationClick(notification, e)}
                    >
                      <div>{notification.message}</div>
                      <div className="dashboard-notification-time">
                        {formatDate(notification.dateCreation)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dashboard-no-notifications">
                    Aucune notification
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="dashboard-notification-detail">
              <div className="dashboard-back-button" onClick={backToList}>
                <FontAwesomeIcon icon={faArrowLeft} className="dashboard-back-icon" /> Retour
              </div>
              <h3 className="dashboard-detail-title">{selectedNotification.type}</h3>
              <p className="dashboard-detail-time">
                {formatDate(selectedNotification.dateCreation)}
              </p>
              <p className="dashboard-detail-content">{selectedNotification.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;