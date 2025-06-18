import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord, faDownload, faTrash, faShareAlt, faPen } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../AuthContext';

const CVListItem = ({ cv, refreshData }) => {
  const { user } = useAuth();
  const userId = user?.idUtilisateur;

  const {
    nomFichier: fileName,
    proprietaireNom: owner,
    date,
    time,
    idCv
  } = cv;

  const handleAction = async (action) => {
    const token = localStorage.getItem('token');
    
    try {
      switch(action) {
        case 'download':
          // Implémentez le téléchargement
          break;
        case 'delete':
          if (window.confirm('Voulez-vous vraiment supprimer ce CV ?')) {
            await fetch(`http://localhost:8080/api/user/cvs/delete/${idCv}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            refreshData(); // Rafraîchir les données sans recharger la page
          }
          break;
        case 'rename':
          const newName = prompt("Nouveau nom:", fileName);
          if (newName) {
            await fetch(`http://localhost:8080/api/user/cvs/${idCv}/renommer?newName=${encodeURIComponent(newName)}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            refreshData(); // Rafraîchir les données sans recharger la page
          }
          break;
        case 'share':
          // Implémentez le partage
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <tr className="dashboard-table-row">
      <td className="dashboard-file-info">
        <div className="dashboard-file-wrapper">
          <FontAwesomeIcon icon={faFileWord} className="dashboard-file-icon" />
          <div>
            <div className="dashboard-file-name">{fileName}</div>
            <div className="dashboard-file-meta">DOX </div>
          </div>
        </div>
      </td>
      <td className="dashboard-file-owner">
        <div>{owner}</div>
      </td>
      <td className="dashboard-file-date">
        <div>{new Date(date).toLocaleDateString('fr-FR')}</div>
        <div className="dashboard-file-time">{time}</div>
      </td>
      <td className="dashboard-file-actions">
        <div className="dashboard-action-buttons">
          <button 
            onClick={() => handleAction('download')} 
            className="dashboard-action-btn dashboard-download-btn"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
          <button 
            onClick={() => handleAction('delete')} 
            className="dashboard-action-btn dashboard-delete-btn"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button 
            onClick={() => handleAction('share')} 
            className="dashboard-action-btn dashboard-share-btn"
          >
            <FontAwesomeIcon icon={faShareAlt} />
          </button>
          <button 
            onClick={() => handleAction('rename')} 
            className="dashboard-action-btn dashboard-rename-btn"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CVListItem;