import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function useLogin() {
    // Verificar que el contexto exista
    const authContext = useAuth();
    
    if (!authContext) {
        throw new Error('useLogin debe ser usado dentro de un AuthProvider');
    }

    const { Login } = authContext;
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        console.log("Attempting login with:", { email });

        try {
            const result = await Login(email, password);
            
            console.log("Login result:", result);

            if (result.success) {
                console.log("Login successful, navigating to home");
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 100);
            } else {
                setError(result.message || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error en handleSubmit:", error);
            setError("Error de conexión. Por favor, intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleSubmit,
    };
}