import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../../config';

const SERVER_URL = config.api.API_BASE;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    const Login = async (email, password) => {
        try {
            console.log("🔵 Login - Iniciando proceso de login");
            
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

            if (data.userType === "customer") {
                return {
                    success: false,
                    message: "Los clientes no tienen acceso al panel administrativo."
                };
            }

            const userData = {
                id: data.userId,
                userType: data.userType,
                email: data.user?.email || email,
                name: data.user?.name || email.split('@')[0]
            };

            console.log("🟡 Login - Guardando user pero NO authToken, activando isLoginLoading");
            
            // Guardar en AsyncStorage PERO NO actualizar authToken todavía
            await AsyncStorage.setItem("pendingAuthToken", "authenticated");
            await AsyncStorage.setItem("user", JSON.stringify(userData));

            // SOLO actualizar user e isLoginLoading, NO authToken
            setUser(userData);
            setIsLoginLoading(true);
            
            console.log("🟢 Login - Estados actualizados:", {
                user: userData.name,
                isLoginLoading: true,
                authToken: "NOT SET - WAITING FOR COMPLETE"
            });

            return { success: true, message: data.message, user: userData };
        } catch (error) {
            console.error("🔴 Error en login:", error);
            return { success: false, message: error.message };
        }
    };

    const completeLogin = async () => {
        console.log("🟣 CompleteLogin - Completando login");
        
        try {
            // Mover el token pendiente a token real
            const pendingToken = await AsyncStorage.getItem("pendingAuthToken");
            if (pendingToken) {
                await AsyncStorage.setItem("authToken", pendingToken);
                await AsyncStorage.removeItem("pendingAuthToken");
            }
            
            setAuthToken("authenticated");
            setIsLoginLoading(false);
            
            console.log("✅ CompleteLogin - Token activado, navegación a MainTabs debería ocurrir");
        } catch (error) {
            console.error("Error en completeLogin:", error);
        }
    };

    const logout = async () => {
        console.log("🔶 Logout - Iniciando logout");
        try {
            await fetch(`${SERVER_URL}logout`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.error("Error al hacer logout en el servidor:", error);
        } finally {
            try {
                await AsyncStorage.removeItem("authToken");
                await AsyncStorage.removeItem("pendingAuthToken");
                await AsyncStorage.removeItem("user");
            } catch (storageError) {
                console.error("Error al limpiar AsyncStorage:", storageError);
            }
            
            setAuthToken(null);
            setUser(null);
            setIsLoginLoading(false);
            console.log("🔶 Logout - Estados limpiados");
        }
    };

    const getAuthHeaders = async () => {
        const token = authToken || await AsyncStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    };

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

            if (response.status === 401 || response.status === 403) {
                console.log("Token expirado, haciendo logout automático...");
                await logout();
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    const isAuthenticated = !!(user && authToken);
    const hasRole = (role) => user?.userType === role;
    const hasAnyRole = (roles) => roles.includes(user?.userType);
    const isEmployee = () => user?.userType === 'employee';
    const isAdmin = () => user?.userType === 'admin';

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                console.log("🔄 CheckAuthState - Verificando estado inicial");
                
                // IMPORTANTE: Para testing, limpia el storage al inicio
                // REMOVER ESTAS LÍNEAS EN PRODUCCIÓN
                console.log("🧹 CheckAuthState - Limpiando storage para testing");
                await AsyncStorage.removeItem("authToken");
                await AsyncStorage.removeItem("pendingAuthToken");
                await AsyncStorage.removeItem("user");
                
                const token = await AsyncStorage.getItem("authToken");
                const savedUser = await AsyncStorage.getItem("user");

                console.log("🔄 CheckAuthState - Datos encontrados:", { 
                    hasToken: !!token, 
                    hasSavedUser: !!savedUser
                });

                if (!token || !savedUser || savedUser === "undefined") {
                    console.log("🔄 CheckAuthState - No hay datos válidos");
                    setAuthToken(null);
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setAuthToken(token);
                    console.log("🔄 CheckAuthState - Auth restaurada:", parsedUser.name);
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
                console.log("🔄 CheckAuthState - Verificación completada");
            }
        };

        checkAuthState();
    }, []);

    // Log cuando cambian los estados principales
    useEffect(() => {
        console.log("📊 Estados AuthContext:", {
            isLoading,
            isLoginLoading,
            hasUser: !!user,
            hasAuthToken: !!authToken,
            userType: user?.userType
        });
    }, [isLoading, isLoginLoading, user, authToken]);

    return (
        <AuthContext.Provider
            value={{
                user,
                authToken,
                Login,
                logout,
                completeLogin,
                authenticatedFetch,
                isAuthenticated,
                isLoading,
                isLoginLoading,
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