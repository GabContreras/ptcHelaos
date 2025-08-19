import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function useLogin() {
    const { Login } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        // Validaciones básicas
        if (!email.trim()) {
            setError("Por favor, ingresa tu correo electrónico");
            return false;
        }

        if (!password.trim()) {
            setError("Por favor, ingresa tu contraseña");
            return false;
        }

        setLoading(true);
        setError("");
        
        console.log("Attempting login with:", { email: email.trim() });

        try {
            const result = await Login(email.trim(), password.trim());
            
            console.log("Login result:", result);

            if (result.success) {
                console.log("Login successful");
                // No manejar navegación aquí, el AuthContext lo hará automáticamente
                return true;
            } else {
                const errorMessage = result.message || "Error al iniciar sesión";
                setError(errorMessage);
                return false;
            }
        } catch (error) {
            console.error("Error en handleLogin:", error);
            const errorMessage = "Error de conexión. Verifica tu conexión a internet.";
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError("");
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setError("");
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
        clearError,
        resetForm,
    };
}