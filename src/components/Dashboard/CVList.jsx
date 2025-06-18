import React, { useState } from 'react';
import CVListItem from './CVListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './../CVList.css';

const CVList = ({ cvs = [], refreshData }) => {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(cvs.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const startIndex = currentPage * itemsPerPage;
  const visibleCVs = cvs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dashboard-cv-list-container">
      <div className="dashboard-cv-list-header">
        <h2 className="dashboard-cv-list-title">Vos CVs générés</h2>
      </div>

      <div className="dashboard-cv-table-container">
        <table className="dashboard-cv-table">
          <thead className="dashboard-cv-table-head">
            <tr>
              <th>Nom de fichier</th>
              <th>Propriétaire</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="dashboard-cv-table-body">
            {visibleCVs.map(cv => (
        <CVListItem
          key={`${cv.idCv}-${cv.utilisateur?.idUtilisateur || 'unknown'}`}
          cv={cv}
          refreshData={refreshData}
        />
      ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="dashboard-cv-pagination">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 0}
              className="pagination-button"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            <span className="pagination-info">
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, cvs.length)} sur {cvs.length}
            </span>
            
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages - 1}
              className="pagination-button"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVList;