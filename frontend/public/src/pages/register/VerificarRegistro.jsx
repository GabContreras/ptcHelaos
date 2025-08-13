import React, { useEffect } from 'react';
import { useRegister } from '../../hooks/RegisterHook/useRegister';
import { useNavigate } from 'react-router-dom';
import UniversalModal from '../../components/modals/UniversalModal/UniversalModal';
import './VerificarRegistro.css';

const VerificarRegistro = () => {
    const navigate = useNavigate();
    const {
        code,
        setCode,
        inputRefs,
        loading,
        error,
        message,
        showSuccessModal,
        verifyRegistrationCode,
        handleCodeChange,
        handleCodeKeyDown,
        fetchUserEmailFromToken,
        userEmail,
        handleModalClose,
    } = useRegister();

    useEffect(() => {
        fetchUserEmailFromToken();
        // Enfocar el primer input al cargar
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
        // eslint-disable-next-line
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyRegistrationCode();
    };

    const goBack = () => {
        navigate('/RegistroPage');
    };


    return (
        <>
            <div className="code-container">
                <div className="code-form-container">
                    <div className="code-logo">
                        <span className="logo-icon">🍦</span>
                        <span className="logo-text">Moon Ice Cream</span>
                    </div>

                    <h1>Verificación de Cuenta</h1>
                    <p className="code-description">
                        Para completar tu registro, ingresa el código de verificación que se envió a tu correo
                    </p>

                    <div className="user-info">
                        <div className="user-icon">👤</div>
                        <span className="user-email">{userEmail}</span>
                    </div>

                    <p className="code-instruction">Se envió un código de 4 dígitos a tu cuenta de gmail</p>

                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <div className="code-inputs-container">
                        {code.map((digit, idx) => (
                            <input
                                key={idx}
                                type="text"
                                maxLength={1}
                                value={digit}
                                ref={el => inputRefs.current[idx] = el}
                                onChange={e => handleCodeChange(idx, e.target.value)}
                                onKeyDown={e => handleCodeKeyDown(idx, e)}
                                disabled={loading}
                                className="code-input"
                            />
                        ))}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="back-button"
                            onClick={goBack}
                            disabled={loading}
                        >
                            Regresar
                        </button>

                        <button
                            type="submit"
                            className="continue-button"
                            onClick={handleSubmit}
                            disabled={!code.every(digit => digit !== '') || loading}
                        >
                            {loading ? 'Verificando...' : 'Verificar'}
                        </button>
                    </div>

                </div>
            </div>

            {/* Modal de éxito */}
            <UniversalModal
                isOpen={showSuccessModal}
                onClose={handleModalClose}
                type="success"
                title="¡Verificación Exitosa!"
                message="Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión."
            />
        </>
    );
};

export default VerificarRegistro;