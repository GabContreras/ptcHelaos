import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../../config';

const SERVER_URL = config.api.API_BASE;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const Login = async (email, password) => {
        try {
            const response = await fetch(`${SERVER_URL}login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error en la autenticación");
            }

            // Permitir solo employees y admin para Moon Ice Cream dashboard
            if (data.userType === "customer") {
                return {
                    success: false,
                    message: "Los clientes no tienen acceso al panel administrativo."
                };
            }

            // Crear objeto de usuario con datos completos del servidor
            const userData = {
                id: data.userId,
                userType: data.userType,
                email: data.user?.email || email,
                name: data.user?.name || email.split('@')[0]
            };

            // Guardar en AsyncStorage (equivalente a localStorage en React Native)
            await AsyncStorage.setItem("authToken", "authenticated");
            await AsyncStorage.setItem("user", JSON.stringify(userData));

            // Actualizar estado inmediatamente
            setAuthToken("authenticated");
            setUser(userData);

            console.log("Login exitoso Moon Ice Cream:", {
                userType: data.userType,
                userId: data.userId,
                name: userData.name,
                tokenSaved: true
            });

            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error en login Moon Ice Cream:", error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            // Llamar al endpoint de logout del servidor
            await fetch(`${SERVER_URL}logout`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            console.log("Logout exitoso en el servidor");
        } catch (error) {
            console.error("Error al hacer logout en el servidor:", error);
            // Continuar con la limpieza local aunque falle el servidor
        } finally {
            // Limpiar datos locales siempre
            try {
                await AsyncStorage.removeItem("authToken");
                await AsyncStorage.removeItem("user");
                console.log("Datos locales limpiados correctamente");
            } catch (storageError) {
                console.error("Error al limpiar AsyncStorage:", storageError);
            }
            
            // Actualizar estado inmediatamente
            setAuthToken(null);
            setUser(null);
        }
    };

    // Función para obtener headers de autenticación
    const getAuthHeaders = async () => {
        const token = authToken || await AsyncStorage.getItem('authToken');

        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    // Utilidad para fetch autenticado
    const authenticatedFetch = async (url, options = {}) => {
        const isFormData = options.body instanceof FormData;
        const headers = await getAuthHeaders();

        const config = {
            ...options,
            credentials: 'include',
            headers: {
                ...(!isFormData && { 'Content-Type': 'application/json' }),
                ...headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);

            // Si el token expiró o es inválido, hacer logout automático
            if (response.status === 401 || response.status === 403) {
                console.log("Token expirado o sin permisos, haciendo logout automático...");
                await logout();
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    // Convertimos isAuthenticated en un valor computado
    const isAuthenticated = !!(user && authToken);

    // Verificar si el usuario tiene un rol específico
    const hasRole = (role) => user?.userType === role;
    const hasAnyRole = (roles) => roles.includes(user?.userType);
    const isEmployee = () => user?.userType === 'employee';
    const isAdmin = () => user?.userType === 'admin';

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                const savedUser = await AsyncStorage.getItem("user");

                console.log("🔄 useEffect - Checking stored auth for Moon Ice Cream:", { 
                    hasToken: !!token, 
                    hasSavedUser: !!savedUser
                });

                if (!token || !savedUser || savedUser === "undefined") {
                    console.log("No hay datos locales, limpiando...");
                    await AsyncStorage.removeItem("authToken");
                    await AsyncStorage.removeItem("user");
                    setAuthToken(null);
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                // Restaurar desde AsyncStorage
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setAuthToken(token);
                    console.log("Moon Ice Cream auth restored from AsyncStorage:", parsedUser);
                } catch (parseError) {
                    console.error("Error parsing saved user:", parseError);
                    await AsyncStorage.removeItem("user");
                    await AsyncStorage.removeItem("authToken");
                    setAuthToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking auth state:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthState();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                authToken,
                Login,
                logout,
                authenticatedFetch,
                isAuthenticated,
                isLoading,
                setUser,
                setAuthToken,
                getAuthHeaders,
                hasRole,
                hasAnyRole,
                isEmployee,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};