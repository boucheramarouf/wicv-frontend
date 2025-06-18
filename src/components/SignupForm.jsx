import React, { useState } from 'react';
import InputField from './InputField';
import PasswordStrengthBar from './PasswordStrengthBar';
import './Signup.css';
import axios from 'axios';

const SignupForm = () => {
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Mise à jour spéciale pour le mot de passe
    if (name === 'password') {
      setPassword(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
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
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        nom: formData.lastName,
        prenom: formData.firstName,
        email: formData.email,
        numeroTelephone: formData.phone,
        mot_de_passe: formData.password
      };
      
      await axios.post('http://localhost:8080/auth/inscription', payload);
      
      // Réinitialiser le formulaire après succès
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      setPassword('');
      
      // Afficher un message temporaire
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success-message';
      successMsg.textContent = 'Inscription réussie! Vérifiez votre email.';
      document.querySelector('.form-box').prepend(successMsg);
      
      setTimeout(() => {
        successMsg.remove();
      }, 5000);
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setErrors({
        server: error.response?.data?.message || 'Erreur lors de l\'inscription'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='body-signup'>
      <div className="signup-container">
        <div className="logo-box">
          <div className="logo-text">
            <span className="wi">WI</span>
            <span className="cv">CV</span>
          </div>
        </div>

        <form className="form-box" onSubmit={handleSubmit}>
          <p className="welcome-text">
            Créez votre compte WIKEYS CV pour convertir vos CVs
          </p>

          {/* Grid Prénom / Nom */}
          <div className="form-grid">
            <div>
              <InputField 
                icon="fas fa-user" 
                placeholder="Prénom" 
                name="firstName" 
                type="text" 
                value={formData.firstName}
                onChange={handleChange}
                required 
                error={errors.firstName}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            <div>
              <InputField 
                icon="fas fa-user-tag" 
                placeholder="Nom" 
                name="lastName" 
                type="text" 
                value={formData.lastName}
                onChange={handleChange}
                required 
                error={errors.lastName}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>
          
          <div className='autre-colomn'>
            <div>
              <InputField 
                icon="fas fa-envelope" 
                placeholder="Adresse email" 
                name="email" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                error={errors.email}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div>
              <InputField 
                icon="fas fa-phone" 
                placeholder="Numéro de téléphone" 
                name="phone" 
                type="tel" 
                value={formData.phone}
                onChange={handleChange}
                required 
                error={errors.phone}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Password + Strength */}
            <div style={{ position: 'relative' }}>
              <InputField
                icon="fas fa-lock"
                placeholder="Mot de passe"
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
                placeholder="Confirmer le mot de passe" 
                name="confirmPassword" 
                type="password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
                error={errors.confirmPassword}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
            
            {errors.server && <div className="server-error">{errors.server}</div>}
            
            <button 
              type="submit" 
              className="signup-btn-sign"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </div>
        </form>

        <div className="login-section">
          <span>Vous avez déjà un compte ?</span>
          <button
            type="button"
            className="login-btn"
            onClick={() => window.location.href = '/login'}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;