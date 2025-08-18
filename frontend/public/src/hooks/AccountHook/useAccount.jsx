// hooks/useUserProfile.js
import { useState, useEffect } from "react";
import { config } from "../../config";

const API_BASE = config.api.API_BASE;

export function useUserProfile(userId) {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // GET - Obtener perfil de usuario
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error al cargar el perfil: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("No se pudo cargar el perfil. " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  //Actualizar perfil
  const updateUserProfile = async (updatedData) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}customers/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el perfil: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setProfile(result); // actualizar estado con lo que devuelve la API
      return result;
    } catch (err) {
      console.error("Error updating user profile:", err);
      setError("No se pudo actualizar el perfil. " + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Refrescar datos manualmente
  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  return {
    profile,
    setProfile,
    isLoading,
    error,
    fetchUserProfile,
    updateUserProfile,
    refreshProfile,
  };
}

export default useUserProfile;