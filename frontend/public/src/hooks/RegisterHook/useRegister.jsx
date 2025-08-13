import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config.jsx';

const API_BASE = config.api.API_BASE;

export function useRegister() {
    const navigate = useNavigate();

    // Estados del formulario de registro
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        birthday: '',
        termsAccepted: false
    });

    // Estados para verificación de código
    const [code, setCode] = useState(['', '', '', '']);
    const [userEmail, setUserEmail] = useState('');

    // Estados generales
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Para inputs de código
    const inputRefs = useRef([]);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'phone') {
            // Formatear teléfono con guión
            let phoneValue = value.replace(/\D/g, ''); // Solo números
            if (phoneValue.length <= 4) {
                setFormData(prev => ({ ...prev, phone: phoneValue }));
            } else if (phoneValue.length <= 8) {
                setFormData(prev => ({
                    ...prev,
                    phone: phoneValue.slice(0, 4) + '-' + phoneValue.slice(4)
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
        setError(''); // Limpiar errores al cambiar datos
    };

    // Validar edad (mínimo 15 años, no fechas futuras)
    const validateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);

        // Verificar que no sea una fecha futura
        if (birthDate > today) {
            return { valid: false, message: 'La fecha de nacimiento no puede ser futura' };
        }

        // Calcular edad
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 15) {
            return { valid: false, message: 'Debes tener al menos 15 años para registrarte' };
        }

        return { valid: true };
    };

    // Validar formulario
    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            return false;
        }
        if (!formData.email.trim()) {
            setError('El email es requerido');
            return false;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('El formato del correo electrónico no es válido');
            return false;
        }

        if (!formData.phone.trim()) {
            setError('El teléfono es requerido');
            return false;
        }

        // Validar que el teléfono tenga el formato correcto (0000-0000)
        const phoneRegex = /^\d{4}-\d{4}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('El teléfono debe tener el formato 0000-0000');
            return false;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }
        if (!formData.birthday) {
            setError('La fecha de nacimiento es requerida');
            return false;
        }

        // Validar edad
        const ageValidation = validateAge(formData.birthday);
        if (!ageValidation.valid) {
            setError(ageValidation.message);
            return false;
        }

        if (!formData.termsAccepted) {
            setError('Debes aceptar los términos y condiciones');
            return false;
        }
        return true;
    };

    // Registrar usuario
    const registerUser = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${API_BASE}registerCustomer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password,
                    birthday: formData.birthday,
                    frequentCustomer: false
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setUserEmail(formData.email);
                // Guardar email para la pantalla de verificación
                sessionStorage.setItem('registrationEmail', formData.email);
                setMessage('Registro exitoso. Se ha enviado un código de verificación a tu email.');
                setTimeout(() => {
                    navigate('/verificar-registro');
                }, 2000);
            } else {
                setError(data.message || 'Error al registrar usuario');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
            console.error('Error en registro:', err);
        } finally {
            setLoading(false);
        }
    };

    // Obtener email del token para verificación
    const fetchUserEmailFromToken = async () => {
        // Primero intentar obtener del estado del formulario
        if (formData.email) {
            setUserEmail(formData.email);
            return;
        }

        // Si no hay email en el estado, intentar obtenerlo del sessionStorage
        const storedEmail = sessionStorage.getItem('registrationEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
            return;
        }

        // Email por defecto
        setUserEmail('usuario@moonicecream.com');
    };

    // Verificar código de registro
    const verifyRegistrationCode = async () => {
        const enteredCode = code.join('');
        if (enteredCode.length !== 4) {
            setError('Por favor ingresa el código completo');
            return false;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE}registerCustomer/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ code: enteredCode }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowSuccessModal(true);
                return true;
            } else {
                setError(data.message || 'Código inválido');
                setCode(['', '', '', '']);
                if (inputRefs.current[0]) inputRefs.current[0].focus();
                return false;
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
            console.error('Error verificando código:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };


    // Manejo de inputs de código
    const handleCodeChange = (index, value) => {
        if (!/^[a-zA-Z0-9]*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 3) inputRefs.current[index + 1].focus();
    };

    const handleCodeKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Navegación y helpers
    const goToLogin = () => navigate('/login');
    const goBack = () => navigate(-1);

    // Para cerrar modal de éxito
    const handleModalClose = () => {
        setShowSuccessModal(false);
        // Limpiar email guardado del registro
        sessionStorage.removeItem('registrationEmail');
        navigate('/login', {
            state: { message: 'Registro completado exitosamente. Ahora puedes iniciar sesión.' }
        });
    };

    return {
        // Estados del formulario
        formData,
        setFormData,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,

        // Estados de verificación
        code,
        setCode,
        userEmail,
        setUserEmail,

        // Estados generales
        loading,
        setLoading,
        error,
        setError,
        message,
        setMessage,
        showSuccessModal,
        setShowSuccessModal,
        inputRefs,

        // Funciones principales
        handleInputChange,
        registerUser,
        verifyRegistrationCode,
        fetchUserEmailFromToken,

        // Manejo de código
        handleCodeChange,
        handleCodeKeyDown,

        // Navegación
        goToLogin,
        goBack,
        handleModalClose,
    };
}