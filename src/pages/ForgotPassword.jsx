import React, { useState } from 'react';
import '../components/Signup.css';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8080/auth/forgot-password', { email });
      setSuccess('Un email de réinitialisation a été envoyé si l’adresse existe.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la demande de réinitialisation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="body-signup">
      <div className="signup-container">
        <div className="logo-box">
          <div className="logo-text">
            <span className="wi">WI</span>
            <span className="cv">CV</span>
          </div>
        </div>
        <form className="form-box" onSubmit={handleSubmit}>
          <p className="welcome-text">Mot de passe oublié ?<br/>Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
          {error && <div className="server-error">{error}</div>}
          {success && <div className="form-success-message">{success}</div>}
          <div className="autre-colomn" style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="email"
              name="email"
              className="sign-input-field forgot-email-input"
              placeholder="Adresse email"
              value={email}
              onChange={handleChange}
              required
              style={{ marginBottom: '10px', paddingLeft: '15px' }}
            />
          </div>
          <div className="signup-btn-row">
            <button
              type="submit"
              className="signup-btn-sign"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 