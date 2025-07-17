// src/services/api.js
const API_BASE_URL = "http://localhost:8080";

export const getUserProfile = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getUserCVs = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/user/${userId}/cvs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/admin/utilisateurs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok)
    throw new Error("Erreur lors de la récupération des utilisateurs");
  return response.json();
};
