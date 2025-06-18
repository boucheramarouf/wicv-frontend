import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import CVList from './CVList';
import { useAuth } from '../../AuthContext';
import WICVLoader from './../WICVLoader';
import './Dashboard.css';


const DashboardUser = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [cvs, setCvs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    if (!user?.idUtilisateur) return;

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const base = `http://localhost:8080/api/user/${user.idUtilisateur}`;
      const [profileRes, cvsRes, notificationsRes] = await Promise.all([
        axios.get(base, { headers }),
        axios.get(`${base}/cvs`, { headers }),
        axios.get(`${base}/notifications`, { headers }),
      ]);

      setProfile(profileRes.data);
      setCvs(cvsRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };


  const fileInputRef = useRef(null);

  const handleGenerateCVClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);
        
        // Ajoutez des logs pour débogage
        console.log('Envoi du fichier:', file.name, 'type:', file.type);
        
        const response = await axios.post(
            `http://localhost:8080/api/user/${user.idUtilisateur}/cvs/process`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        await fetchData();
    } catch (err) {
        console.error('Erreur détaillée:', err);
        setError(err.response?.data?.message || err.message);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchData();
  }, [user?.idUtilisateur]);

  if (loading) return <WICVLoader />; 
  
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="body-dushboard">
      <div className="dashboard-container">
        <Navbar user={profile} notifications={notifications} onLogout={logout} />

        <main className="dashboard-main">
          <div className="dashboard-welcome">
            <h1 className="dashboard-welcome-title">
              Bienvenue, {profile.nom} {profile.prenom}
            </h1>
            <p className="dashboard-welcome-subtitle">
              Gérez et créez vos CVs professionnels en un clic
            </p>
          </div>

          <div className="dashboard-generate-btn-container">
        <button 
          className="dashboard-generate-btn"
          onClick={handleGenerateCVClick}
        >
          <i className="fas fa-plus-circle dashboard-generate-icon"></i>
          Générer un nouveau CV
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
           accept=".pdf,.docx,.doc,.txt"
        />
      </div>

          <CVList cvs={cvs} refreshData={fetchData} />
        </main>
      </div>
    </div>
  );
};

export default DashboardUser;