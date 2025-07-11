import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config.jsx';

const API_BASE = config.api.API_BASE;

export function usePasswordRecovery() {
    const navigate = useNavigate();

    // Estados generales
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Para inputs de código
    const inputRefs = useRef([]);

    // Solicitar código de recuperación
    const requestCode = async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await fetch(`${API_BASE}passwordRecovery/requestCode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Código de recuperación enviado a tu email');
                setTimeout(() => {
                    navigate('/recuperacioncodigo');
                }, 2000);
            } else {
                setError(data.message || 'Error al enviar código');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    // Obtener email del token (para mostrar en pantalla)
    const fetchUserEmailFromToken = async () => {
        try {
            const response = await fetch(`${API_BASE}passwordRecovery/getTokenInfo`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUserEmail(data.email || 'usuario@moonicecream.com');
            } else {
                setUserEmail('usuario@moonicecream.com');
            }
        } catch {
            setUserEmail('usuario@moonicecream.com');
        }
    };

    // Verificar código
    const verifyCode = async () => {
        const enteredCode = code.join('');
        if (enteredCode.length !== 6) {
            setError('Por favor ingresa el código completo');
            return false;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE}passwordRecovery/verifyCode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ code: enteredCode }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/cambiarpassword');
                return true;
            } else {
                setError(data.message || 'Código inválido');
                setCode(['', '', '', '', '', '']);
                if (inputRefs.current[0]) inputRefs.current[0].focus();
                return false;
            }
        } catch {
            setError('Error de conexión con el servidor');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Cambiar contraseña
    const resetPassword = async () => {
        setError('');
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}passwordRecovery/resetPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password: newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                setError(data.message || 'Error al cambiar contraseña');
            }
        } catch {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    // Navegación y helpers
    const goToLogin = () => navigate('/login');
    const goToRecovery = () => navigate('/recuperacion');

    // Manejo de inputs de código
    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 5) inputRefs.current[index + 1].focus();
    };
    const handleCodeKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Para cerrar modal de éxito
    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate('/login', {
            state: { message: 'Contraseña cambiada exitosamente. Inicia sesión con tu nueva contraseña.' }
        });
    };

    return {
        // Estados
        email, setEmail,
        code, setCode,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        userEmail, setUserEmail,
        loading, setLoading,
        error, setError,
        message, setMessage,
        showSuccessModal, setShowSuccessModal,
        inputRefs,

        // Funciones
        requestCode,
        fetchUserEmailFromToken,
        verifyCode,
        resetPassword,
        goToLogin,
        goToRecovery,
        handleCodeChange,
        handleCodeKeyDown,
        handleModalClose,
    };
}