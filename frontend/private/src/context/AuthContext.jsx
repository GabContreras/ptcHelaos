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

    // Login usando tu controlador existente
    const Login = async (email, password) => {
        try {
            console.log("Enviando petición de login...");
            
            const response = await fetch(`${SERVER_URL}login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include", // CRÍTICO: Para cookies
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || "Error en la autenticación"
                };
            }

            // Si no tiene success en la respuesta pero el status es 200, es exitoso
            if (!data.success && response.status === 200) {
                data.success = true;
            }

            // Verificar que no sea customer para dashboard
            if (data.userType === "customer") {
                return {
                    success: false,
                    message: "Los clientes no tienen acceso al panel administrativo."
                };
            }

            // Crear objeto de usuario usando los datos de tu controlador
            const userData = {
                id: data.userId,
                userType: data.userType,
                email: email,
                name: data.name || email.split('@')[0]
            };

            // Guardar datos de usuario en localStorage
            localStorage.setItem("user", JSON.stringify(userData));
            
            // Verificar cookies con múltiples intentos
            console.log("Cookies inmediatamente después:", document.cookie);
            
            let attempts = 0;
            const checkCookie = () => {
                attempts++;
                const cookieToken = checkAuthTokenCookie();
                console.log(`Intento ${attempts} - Cookie:`, cookieToken ? "✅ Existe" : "❌ No existe");
                console.log("Todas las cookies:", document.cookie);
                
                if (cookieToken) {
                    setAuthCokie(cookieToken);
                    setUser(userData);
                    console.log("Login exitoso - Cookie establecida");
                    return true;
                } else if (attempts < 5) {
                    setTimeout(checkCookie, 200);
                    return false;
                } else {
                    console.error("Cookie no se estableció después de 5 intentos");
                    // Aún así marcar como exitoso si el servidor dice que sí
                    if (data.success) {
                        setUser(userData);
                        setAuthCokie("temp"); // Valor temporal
                    }
                    return false;
                }
            };

            setTimeout(checkCookie, 100);

            return { 
                success: data.success || true, 
                message: data.message || "Login exitoso" 
            };
        } catch (error) {
            console.error("Error en login:", error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            console.log("Iniciando logout...");
            // Llamar al endpoint de logout del servidor
            await fetch(`${SERVER_URL}logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Error al hacer logout en el servidor:", error);
        } finally {
            // Limpiar datos locales
            localStorage.removeItem("user");
            setAuthCokie(null);
            setUser(null);
            console.log("Logout completado");
        }
    };

    // Función para verificar si el usuario está logueado usando tu endpoint
    const checkLoginStatus = async () => {
        try {
            const response = await fetch(`${SERVER_URL}isLoggedIn`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();

            if (data.loggedIn && data.success) {
                // Restaurar sesión desde el servidor
                const userData = {
                    id: data.user,
                    userType: data.userType,
                    email: data.email || "unknown@email.com"
                };
                
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                setAuthCokie("authenticated");
                
                return true;
            } else {
                // Limpiar si no está logueado
                localStorage.removeItem("user");
                setUser(null);
                setAuthCokie(null);
                return false;
            }
        } catch (error) {
            console.error("Error verificando login status:", error);
            return false;
        }
    };

    // Fetch autenticado
    const authenticatedFetch = async (url, options = {}) => {
        const isFormData = options.body instanceof FormData;

        const config = {
            ...options,
            credentials: 'include',
            headers: {
                ...(!isFormData && { 'Content-Type': 'application/json' }),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);

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
    const isAuthenticated = !!(user && (checkAuthTokenCookie() || authCokie));

    // Funciones de roles
    const hasRole = (role) => user?.userType === role;
    const hasAnyRole = (roles) => roles.includes(user?.userType);
    const isEmployee = () => user?.userType === 'employee';
    const isAdmin = () => user?.userType === 'admin';

    // Función para obtener headers (simplificada)
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json'
    });

    useEffect(() => {
        const initAuth = async () => {
            console.log("Inicializando autenticación...");
            
            const savedUser = localStorage.getItem("user");
            const cookieToken = checkAuthTokenCookie();

            console.log("Estado inicial:", { 
                savedUser: !!savedUser, 
                cookieExists: !!cookieToken 
            });

            // Si hay cookie, verificar con el servidor
            if (cookieToken) {
                console.log("Cookie encontrada, verificando con servidor...");
                const isValid = await checkLoginStatus();
                
                if (!isValid) {
                    console.log("Cookie inválida, limpiando...");
                    localStorage.removeItem("user");
                }
            } 
            // Si hay datos guardados pero no cookie, verificar con servidor
            else if (savedUser) {
                console.log("Datos guardados pero no cookie, verificando servidor...");
                const isValid = await checkLoginStatus();
                
                if (!isValid) {
                    console.log("Sesión inválida, limpiando datos...");
                    localStorage.removeItem("user");
                    setUser(null);
                    setAuthCokie(null);
                    
                    // Redirigir si no está en ruta pública
                    const currentPath = window.location.pathname;
                    const publicPaths = ['/', '/login', '/register', '/recuperacion', '/recuperacioncodigo', '/cambiarpassword'];
                    
                    if (!publicPaths.includes(currentPath)) {
                        console.log("Redirigiendo al login...");
                        window.location.href = '/login';
                    }
                }
            }
            // Si no hay nada, asegurarse de que esté limpio
            else {
                console.log("No hay datos de sesión");
                setUser(null);
                setAuthCokie(null);
            }

            setIsLoading(false);
        };

        initAuth();
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
                checkLoginStatus
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);