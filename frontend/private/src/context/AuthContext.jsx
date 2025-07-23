import React, { createContext, useContext, useState, useEffect } from "react";
import { config } from '../config.jsx';

const SERVER_URL = config.api.API_BASE;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authCokie, setAuthCokie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Función para verificar si existe la cookie authToken
    const checkAuthTokenCookie = () => {
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => 
            cookie.trim().startsWith('authToken=')
        );
        return authCookie ? authCookie.split('=')[1].trim() : null;
    };

    // Login corregido - NO usar localStorage para el token
    const Login = async (email, password) => {
        try {
            const response = await fetch(`${SERVER_URL}login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include", // CRÍTICO: Para que se envíen las cookies
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || "Error en la autenticación"
                };
            }

            // Verificar que no sea customer
            if (data.userType === "customer") {
                return {
                    success: false,
                    message: "Los clientes no tienen acceso al panel administrativo."
                };
            }

            // Crear objeto de usuario
            const userData = {
                id: data.userId,
                userType: data.userType,
                email: email,
                name: data.name || data.username || email.split('@')[0]
            };

            // SOLO guardar datos de usuario en localStorage, NO el token
            localStorage.setItem("user", JSON.stringify(userData));
            
            // Verificar que la cookie se haya establecido
            setTimeout(() => {
                const cookieToken = checkAuthTokenCookie();
                console.log("Cookie después del login:", cookieToken ? "✅ Existe" : "❌ No existe");
                
                if (cookieToken) {
                    setAuthCokie(cookieToken);
                    setUser(userData);
                    console.log("Login exitoso - Cookie establecida");
                } else {
                    console.error("Cookie no se estableció correctamente");
                }
            }, 100);

            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error en login:", error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            // Llamar al endpoint de logout del servidor
            await fetch(`${SERVER_URL}logout`, {
                method: "POST",
                credentials: "include" // Para enviar cookies
            });
        } catch (error) {
            console.error("Error al hacer logout en el servidor:", error);
        } finally {
            // Limpiar datos locales
            localStorage.removeItem("user");
            setAuthCokie(null);
            setUser(null);
        }
    };

    // Función para obtener headers de autenticación (simplificada)
    const getAuthHeaders = () => {
        return {
            'Content-Type': 'application/json'
            // NO incluir Authorization header - el token va en cookies httpOnly
        };
    };

    // Fetch autenticado corregido
    const authenticatedFetch = async (url, options = {}) => {
        // Detectar si se está enviando FormData
        const isFormData = options.body instanceof FormData;

        const config = {
            ...options,
            credentials: 'include', // CRÍTICO: Para enviar cookies
            headers: {
                // Solo agregar Content-Type si NO es FormData
                ...(!isFormData && { 'Content-Type': 'application/json' }),
                // NO agregar Authorization - usamos cookies httpOnly
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);

            // Si el token expiró o es inválido
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

    // isAuthenticated basado en cookie y usuario
    const isAuthenticated = !!(user && checkAuthTokenCookie());

    // Funciones de roles
    const hasRole = (role) => user?.userType === role;
    const hasAnyRole = (roles) => roles.includes(user?.userType);
    const isEmployee = () => user?.userType === 'employee';
    const isAdmin = () => user?.userType === 'admin';

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const cookieToken = checkAuthTokenCookie();

        console.log("useEffect - Verificando auth:", { 
            savedUser: !!savedUser, 
            cookieExists: !!cookieToken 
        });

        // Si hay cookie Y datos de usuario, restaurar sesión
        if (cookieToken && savedUser && savedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setAuthCokie(cookieToken);
                console.log("Sesión restaurada:", { user: parsedUser });
            } catch (error) {
                console.error("Error parsing saved user:", error);
                localStorage.removeItem("user");
            }
        }
        // Si no hay cookie, limpiar datos locales
        else if (!cookieToken) {
            console.log("No hay cookie, limpiando datos...");
            localStorage.removeItem("user");
            setAuthCokie(null);
            setUser(null);
            
            // Redirigir si no está en ruta pública
            const currentPath = window.location.pathname;
            const publicPaths = ['/', '/login', '/register', '/recuperacion', '/recuperacioncodigo', '/cambiarpassword'];
            
            if (!publicPaths.includes(currentPath)) {
                console.log("Redirigiendo al login...");
                window.location.href = '/login';
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