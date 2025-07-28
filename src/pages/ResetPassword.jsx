import React, { useState } from 'react';
import InputField from '../components/InputField';
import PasswordStrengthBar from '../components/PasswordStrengthBar';
import '../components/Signup.css';
import axios from 'axios';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'password') setPassword(value);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit avoir au moins 8 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Remplacer l'URL par celle de votre backend pour la réinitialisation
      await axios.post('http://localhost:8080/auth/reset-password', {
        mot_de_passe: formData.password
      });
      setSuccess('Mot de passe réinitialisé avec succès !');
      setFormData({ password: '', confirmPassword: '' });
      setPassword('');
    } catch (error) {
      setErrors({ server: error.response?.data?.message || 'Erreur lors de la réinitialisation' });
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
          <p className="welcome-text">Réinitialisez votre mot de passe</p>
          {errors.server && <div className="server-error">{errors.server}</div>}
          {success && <div className="form-success-message">{success}</div>}
          <div className="autre-colomn">
            <div>
              <InputField
                icon="fas fa-lock"
                placeholder="Nouveau mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password}
              />
              <PasswordStrengthBar password={password} />
              <p className="password-hint">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre
              </p>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <div>
              <InputField
                icon="fas fa-lock"
                placeholder="Répéter le nouveau mot de passe"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={errors.confirmPassword}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>
          <div className="signup-btn-row">
            <button
              type="submit"
              className="signup-btn-sign"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
