import React, { useState, useEffect } from "react";
import Navbar from "../components/Dashboard/Navbar";
import { useAuth } from "../AuthContext";
import "../components/Dashboard/Dashboard.css";
import "./MyAccount.css";

const MyAccount = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "********",
    telephone: "",
  });
  const [edit, setEdit] = useState({
    prenom: false,
    nom: false,
    email: false,
    password: false,
    telephone: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔄 Fonction pour charger le profil utilisateur depuis l'API
  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/${user.idUtilisateur}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setForm({
          prenom: data.prenom || "",
          nom: data.nom || "",
          email: data.email || "",
          password: "********",
          telephone: data.numeroTelephone?.toString() || "",
        });
      } else {
        console.error("Erreur lors du chargement des informations utilisateur.");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };

  // 🔁 Chargement des infos utilisateur à jour
  useEffect(() => {
    if (user && user.idUtilisateur) {
      fetchUserData();
    }
  }, [user]);

  const handleEdit = (field) => {
    setEdit((prev) => ({ ...prev, [field]: true }));
    if (field === "password") setForm((f) => ({ ...f, password: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (edit.password && form.password && form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (
      edit.telephone &&
      form.telephone &&
      !/^((\+33|0)[1-9](\d{2}){4})$/.test(form.telephone)
    ) {
      setError("Le numéro de téléphone n'est pas valide.");
      return;
    }

    const changes = {};
    Object.entries(form).forEach(([key, value]) => {
      if (edit[key] && value && (key !== "password" || value !== "********")) {
        changes[key] = value;
      }
    });

    // ✅ Format propre sans parseInt
    if (changes.telephone) {
      changes.numeroTelephone = changes.telephone.replace(/\s+/g, "");
      delete changes.telephone;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/user/${user.idUtilisateur}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(changes),
      });

      if (response.ok) {
        setMessage("Modifications enregistrées !");
        fetchUserData(); // Recharge les infos à jour
      } else {
        const data = await response.json();
        setError(data.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      setError("Erreur réseau : " + error.message);
    }

    setEdit({
      prenom: false,
      nom: false,
      email: false,
      password: false,
      telephone: false,
    });

    setForm((prev) => ({
      ...prev,
      password: "********",
    }));
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="dashboard-container">
      <Navbar user={user} />
      <main className="dashboard-main">
        <div className="my-account-container">
          <div className="my-account-header">
            <h2>
              <i className="fas fa-user-edit"></i>
              Modifier votre profil
            </h2>
            <p>Mettez à jour vos informations personnelles</p>
          </div>
          <form className="my-account-info" onSubmit={handleSave}>
            {/* Prénom */}
            <div className="myaccount-field">
              <label className="myaccount-label">Prénom</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  name="prenom"
                  className={`myaccount-input${edit.prenom ? " myaccount-input-edit" : ""}`}
                  value={form.prenom}
                  onChange={handleChange}
                  readOnly={!edit.prenom}
                />
                <button type="button" className="myaccount-edit-btn" onClick={() => handleEdit("prenom")}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
              </div>
            </div>

            {/* Nom */}
            <div className="myaccount-field">
              <label className="myaccount-label">Nom</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  name="nom"
                  className={`myaccount-input${edit.nom ? " myaccount-input-edit" : ""}`}
                  value={form.nom}
                  onChange={handleChange}
                  readOnly={!edit.nom}
                />
                <button type="button" className="myaccount-edit-btn" onClick={() => handleEdit("nom")}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="myaccount-field">
              <label className="myaccount-label">Email</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="email"
                  name="email"
                  className={`myaccount-input${edit.email ? " myaccount-input-edit" : ""}`}
                  value={form.email}
                  onChange={handleChange}
                  readOnly={!edit.email}
                />
                <button type="button" className="myaccount-edit-btn" onClick={() => handleEdit("email")}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
              </div>
            </div>

            {/* Téléphone */}
            <div className="myaccount-field">
              <label className="myaccount-label">Téléphone</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="tel"
                  name="telephone"
                  className={`myaccount-input${edit.telephone ? " myaccount-input-edit" : ""}`}
                  value={form.telephone}
                  onChange={handleChange}
                  readOnly={!edit.telephone}
                  pattern="^((\+33|0)[1-9](\d{2}){4})$"
                  title="Format attendu : 06XXXXXXXX ou +336XXXXXXXX"
                />
                <button type="button" className="myaccount-edit-btn" onClick={() => handleEdit("telephone")}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
              </div>
              {!edit.telephone && form.telephone && (
                <div className="myaccount-current-value">
                  
                </div>
              )}
            </div>

            {/* Mot de passe */}
            <div className="myaccount-field">
              <label className="myaccount-label">Mot de passe</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="password"
                  name="password"
                  className={`myaccount-input${edit.password ? " myaccount-input-edit" : ""}`}
                  value={form.password}
                  onChange={handleChange}
                  readOnly={!edit.password}
                  autoComplete="new-password"
                />
                <button type="button" className="myaccount-edit-btn" onClick={() => handleEdit("password")}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
              </div>
            </div>

            {/* Bouton Enregistrer */}
            <div className="myaccount-save-container">
              <button type="submit" className="myaccount-save-btn">
                <i className="fas fa-save" style={{ marginRight: 8 }}></i>
                Enregistrer les modifications
              </button>
            </div>

            {message && <div className="myaccount-info-msg">{message}</div>}
            {error && <div className="myaccount-info-error">{error}</div>}
          </form>
        </div>
      </main>
    </div>
  );
};

export default MyAccount;
