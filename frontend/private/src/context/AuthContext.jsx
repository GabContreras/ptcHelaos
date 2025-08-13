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

            // CRÍTICO: Guardar en localStorage SIEMPRE después del login exitoso
            localStorage.setItem("authToken", "authenticated");
            localStorage.setItem("user", JSON.stringify(userData));

            // Actualizar estado inmediatamente
            setAuthCokie("authenticated");
            setUser(userData);

            //orueba

            console.log("Login exitoso Moon Ice Cream:", {
                userType: data.userType,
                userId: data.userId,
                name: userData.name,
                cookieWillBeSet: true
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

    // Utilidad para fetch autenticado
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
    const hasRole = (role) => user?.userType === role;
    const hasAnyRole = (roles) => roles.includes(user?.userType);
    const isEmployee = () => user?.userType === 'employee';
    const isAdmin = () => user?.userType === 'admin';

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("user");
        const cookieExists = checkAuthTokenCookie();

        console.log("🔄 useEffect - Checking stored auth for Moon Ice Cream:", { 
            hasToken: !!token, 
            hasSavedUser: !!savedUser, 
            cookieExists: !!cookieExists 
        });

        // LÓGICA MEJORADA: Verificar cookie primero, luego localStorage
        if (!cookieExists) {
            console.log("Cookie authToken no encontrada");
            
            // Si tampoco hay datos locales, limpiar y redirigir
            if (!token || !savedUser) {
                console.log("No hay datos locales tampoco, limpiando...");
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                setAuthCokie(null);
                setUser(null);
                
                // Solo redirigir si no estamos en rutas públicas
                const currentPath = window.location.pathname;
                const publicPaths = ['/', '/login', '/register', '/recuperacion', '/recuperacioncodigo', '/cambiarpassword'];
                
                if (!publicPaths.includes(currentPath)) {
                    console.log("🔄 Redirigiendo al login...");
                    window.location.href = '/login';
                }
                setIsLoading(false);
                return;
            }
        }

        //Si hay cookie O datos locales, intentar restaurar sesión
        if (cookieExists || (token && savedUser && savedUser !== "undefined")) {
            // Restaurar desde localStorage primero
            if (token && savedUser && savedUser !== "undefined") {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setAuthCokie(token);
                    console.log("Moon Ice Cream auth restored from localStorage:", parsedUser);
                } catch (error) {
                    console.error("Error parsing saved user:", error);
                    localStorage.removeItem("user");
                    localStorage.removeItem("authToken");
                }
            }

            // ✅ Verificar con el servidor si hay cookie
            if (cookieExists) {
                fetch(`${SERVER_URL}auth/me`, {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                })
                .then(response => {
                    if (!response.ok) throw new Error("No autenticado");
                    return response.json();
                })
                .then(data => {
                    if (data?.user) {
                        const userData = {
                            id: data.user.id,
                            userType: data.user.userType,
                            email: data.user.email,
                            name: data.user.name
                        };
                        
                        setUser(userData);
                        setAuthCokie("authenticated");
                        localStorage.setItem("user", JSON.stringify(userData));
                        localStorage.setItem("authToken", "authenticated");
                        
                        console.log("Session verified with server:", userData);
                    }
                })
                .catch(error => {
                    console.warn("⚠️ Error verifying session with server:", error.message);
                    // Si falla la verificación del servidor pero hay datos locales, mantenerlos
                    if (!token || !savedUser) {
                        localStorage.removeItem("user");
                        localStorage.removeItem("authToken");
                        setAuthCokie(null);
                        setUser(null);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
            } else {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
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