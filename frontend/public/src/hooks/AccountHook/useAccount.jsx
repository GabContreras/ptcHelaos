import { useState, useEffect } from "react";
import { config } from "../../config";

const API_BASE = config.api.API_BASE;

export function useUserProfile() {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener datos del usuario desde localStorage
  const getUserFromStorage = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "undefined") {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  // Obtener perfil de usuario según su tipo
  const fetchUserProfile = async () => {
    const user = getUserFromStorage();
    
    if (!user || !user.id || !user.userType) {
      setError("No hay información de usuario disponible en localStorage");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      let endpoint = "";
      
      // Determinar el endpoint según el tipo de usuario
      if (user.userType === "employee" || user.userType === "admin") {
        endpoint = `${API_BASE}employees/${user.id}`;
      } else if (user.userType === "customer") {
        endpoint = `${API_BASE}customers/${user.id}`;
      } else {
        throw new Error(`Tipo de usuario no válido: ${user.userType}`);
      }

      console.log("Fetching profile from:", endpoint);
      console.log("User data from localStorage:", user);

      // Obtener token de autenticación
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Agregar token si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers,
        credentials: 'include', // Importante para mantener las cookies
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('No tienes autorización para acceder a esta información.');
        }
        throw new Error(`Error al cargar el perfil: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Profile data received:", data);
      
      // Asegurarse de que tenemos los datos correctos
      const profileData = data.employee || data.customer || data.data || data;
      setProfile(profileData);
      
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("No se pudo cargar el perfil. " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar perfil
  const updateUserProfile = async (updatedData) => {
    const user = getUserFromStorage();
    
    if (!user || !user.id || !user.userType) {
      throw new Error("No hay información de usuario disponible en localStorage");
    }

    try {
      setIsLoading(true);
      setError("");

      let endpoint = "";
      
      // Determinar el endpoint según el tipo de usuario
      if (user.userType === "employee" || user.userType === "admin") {
        endpoint = `${API_BASE}employees/${user.id}`;
      } else if (user.userType === "customer") {
        endpoint = `${API_BASE}customers/${user.id}`;
      } else {
        throw new Error(`Tipo de usuario no válido: ${user.userType}`);
      }

      console.log("Updating profile at:", endpoint);
      console.log("Update data:", updatedData);

      // Preparar datos para envío - solo incluir password si se proporcionó
      const dataToSend = { ...updatedData };
      
      // Si no hay password o está vacío, eliminarlo del objeto
      if (!dataToSend.password || dataToSend.password.trim() === '') {
        delete dataToSend.password;
        console.log("Password omitido - no se actualizará la contraseña");
      } else {
        console.log("Password incluido - se actualizará la contraseña");
      }

      // Obtener token de autenticación
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Agregar token si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('No tienes autorización para actualizar esta información.');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al actualizar el perfil: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Update response:", result);

      // Actualizar el estado con los nuevos datos
      // Los controladores devuelven diferentes formatos, manejar ambos
      const updatedProfile = result.employee || result.customer || result.data || result;
      
      // Si el backend solo devuelve un mensaje de éxito, hacer un refresh del perfil
      if (result.message && !updatedProfile._id) {
        console.log("Respuesta solo con mensaje, refrescando perfil...");
        await fetchUserProfile();
      } else {
        setProfile(updatedProfile);
      }
      
      return updatedProfile;
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

  // Cargar el perfil cuando el componente se monta
  useEffect(() => {
    const user = getUserFromStorage();
    if (user && user.id && user.userType) {
      fetchUserProfile();
    }
  }, []); // Solo ejecutar una vez al montar

  return {
    profile,
    setProfile,
    isLoading,
    error,
    fetchUserProfile,
    updateUserProfile,
    refreshProfile,
    user: getUserFromStorage(), // Exponer también la información del usuario del localStorage
  };
}

export default useUserProfile;