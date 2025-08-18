import { useState, useEffect } from "react";
import { config } from "../../config";

const API_BASE = config.api.API_BASE;

export function useUserProfile(userId) {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //Obtener perfil de usuario
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

  //actualizar contraseña
  {/*const handlePasswordUpdate = async (newPassword, confirmPassword) => {
    if (newPassword.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
    }
    if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    try {
        await updateUserProfile({ ...profile, password: newPassword });
        alert("Contraseña actualizada con éxito");
        setIsPasswordModalOpen(false);
        setNewPassword("");
        setConfirmPassword("");
    } catch (err) {
        alert("Error al actualizar la contraseña");
    }
};*/}


  //Actualizar perfil
  const updateUserProfile = async (updatedData) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}profile/${userId}`, {
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
      setProfile(result);
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
    //handlePasswordUpdate,
    fetchUserProfile,
    updateUserProfile,
    refreshProfile,
  };
}

export default useUserProfile;