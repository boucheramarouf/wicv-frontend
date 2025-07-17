import "font-awesome/css/font-awesome.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useAuth } from "../AuthContext";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:8080/auth/login",
        {
          username: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!data.idUtilisateur) {
        throw new Error("L'ID utilisateur est manquant dans la réponse.");
      }

      localStorage.setItem("token", data.token);

      const userObj = {
        idUtilisateur: data.idUtilisateur,
        nom: data.nom,
        prenom: data.prenom,
        roles: data.roles,
        email: email,
        telephone: data.telephone || data.numeroTelephone || "",
      };

      login(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));

      if (data.roles.some((roles) => roles.nomRole === "ADMIN")) {
        navigate("/dashboardAdmin");
      } else {
        navigate("/dashboardUser");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      const message = err.response?.data?.message || "Erreur de connexion";
      setError(message);
    }
  };

  return (
    <div className="body-login">
      <div className="login-container">
        {/* Logo Box */}
        <div className="logo-box">
          <div className="logo-text">
            <span className="wi">WI</span>
            <span className="cv">CV</span>
          </div>
        </div>

        {/* Form Box */}
        <form className="form-box" onSubmit={handleLogin}>
          <p className="welcome-text">
            Bienvenue à la plateforme de conversion de CVs de WIKEYS
          </p>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Email Field */}
          <div className="input-group ">
            <span className="input-icon">
              <i className="fa fa-envelope"></i>
            </span>
            <input
              type="text"
              className="input-field"
              name="username"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="input-group ">
            <span className="input-icon">
              <i className="fa fa-lock"></i>
            </span>
            <input
              type="password"
              className="input-field"
              name="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Footer with Forgot Password and Login Button */}
          <div className="form-footer">
            <button
              type="button"
              className="forgot-password"
              onClick={() => (window.location.href = "/forgot-password")}
            >
              Mot de passe oublié ?
            </button>
            <button type="submit" className="login-btn-login">
              Se connecter
            </button>
          </div>
        </form>

        {/* Sign Up Section */}
        <div className="signup-section">
          <span>Vous n'avez pas un compte ?</span>
          <button
            className="signup-btn"
            onClick={() => (window.location.href = "/signup")}
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
