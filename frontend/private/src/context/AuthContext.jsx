import React, { createContext, useContext, useState, useEffect } from "react";
import { config } from '../config.jsx';

// Actualizada la URL del servidor para Moon Ice Cream
const SERVER_URL = config.api.API_BASE;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // ✅ Corregido
    const [authCokie, setAuthCokie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Función simple para verificar si existe la cookie authToken
    const checkAuthTokenCookie = () => {
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => 
            cookie.trim().startsWith('authToken=')
        );
        return authCookie ? authCookie.split('=')[1].trim() : null;
    };

    // Login adaptado para Moon Ice Cream
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

            // Crear objeto de usuario con el nombre correcto
            const userData = {
                id: data.userId,
                userType: data.userType,
                email: email,
                name: data.name || data.username || email.split('@')[0] // ✅ Múltiples fallbacks
            };

            // Guardar en localStorage
            //localStorage.setItem("authToken", "authenticated");
            //localStorage.setItem("user", JSON.stringify(userData));

            // Actualizar estado inmediatamente
            setAuthCokie("authenticated");
            setUser(userData);

            //orueba

            console.log("Login exitoso Moon Ice Cream:", {
                userType: data.userType,
                userId: data.userId,
                name: userData.name
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
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Error al hacer logout en el servidor:", error);
        } finally {
            // Limpiar datos locales siempre
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setAuthCokie(null);
            setUser(null);
        }
    };

    // Función para obtener headers de autenticación
    const getAuthHeaders = () => {
        const token = authCokie || localStorage.getItem('authToken') ||
            document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

    // Utilidad para fetch autenticado - adaptado para Moon Ice Cream
    const authenticatedFetch = async (url, options = {}) => {
        const token = authCokie || localStorage.getItem('authToken') ||
            document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

        // Detectar si se está enviando FormData
        const isFormData = options.body instanceof FormData;

        const config = {
            ...options,
            credentials: 'include',
            headers: {
                // Solo agregar Content-Type si NO es FormData
                ...(!isFormData && { 'Content-Type': 'application/json' }),
                // Siempre agregar Authorization si hay token
                ...(token && { 'Authorization': `Bearer ${token}` }),
                // Mantener headers adicionales
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);

            // Si el token expiró o es inválido, hacer logout automático
            if (response.status === 401 || response.status === 403) {
                console.log("Token expirado o sin permisos, haciendo logout automático...");
                logout();
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    // Convertimos isAuthenticated en un valor computado
    const isAuthenticated = !!(user && authCokie);

    // Verificar si el usuario tiene un rol específico
    const hasRole = (role) => {
        return user?.userType === role;
    };

    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasAnyRole = (roles) => {
        return roles.includes(user?.userType);
    };

    // Verificar si es empleado (puede acceder al dashboard)
    const isEmployee = () => {
        return user?.userType === 'employee';
    };

    // Verificar si es admin
    const isAdmin = () => {
        return user?.userType === 'admin';
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("user");
        const cookieExists = checkAuthTokenCookie(); // NUEVO: verificar cookie

        console.log("useEffect - Checking stored auth for Moon Ice Cream:", { 
            token, 
            savedUser, 
            cookieExists: !!cookieExists 
        });

        // NUEVO: Si no hay cookie authToken, limpiar todo y redirigir
        if (!cookieExists) {
            console.log("Cookie authToken no encontrada, limpiando datos...");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setAuthCokie(null);
            setUser(null);
            
            // Solo redirigir si no estamos en rutas públicas
            const currentPath = window.location.pathname;
            const publicPaths = ['/', '/login', '/register', '/recuperacion', '/recuperacioncodigo', '/cambiarpassword'];
            
            if (!publicPaths.includes(currentPath)) {
                console.log("Redirigiendo al login...");
                window.location.href = '/login';
            }
        }
        // Si hay cookie Y datos locales, restaurar sesión
        else if (token && savedUser && savedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setAuthCokie(token);
                console.log("Moon Ice Cream auth restored:", { token, user: parsedUser });
            } catch (error) {
                console.error("Error parsing saved user:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("authToken");
            }
        }

        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                authCokie,
                Login,
                logout,
                authenticatedFetch,
                isAuthenticated,
                isLoading,
                setUser,
                setAuthCokie,
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

export const useAuth = () => useContext(AuthContext);