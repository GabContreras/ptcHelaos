import React, { useEffect } from 'react';
import { usePasswordRecovery } from '../../hooks/PasswordRecoveryHook/usePasswordRecovery';
import { useNavigate } from 'react-router-dom';
import './RecuperacionCodigo.css';

const RecuperacionCodigo = () => {
  const navigate = useNavigate();
  const {
    code,
    setCode,
    inputRefs,
    loading,
    error,
    verifyCode,
    handleCodeChange,
    handleCodeKeyDown,
    fetchUserEmailFromToken,
    userEmail,
  } = usePasswordRecovery();

  useEffect(() => {
    fetchUserEmailFromToken();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCode();
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="code-container">
      <div className="code-form-container">
        <div className="code-logo">
          <span className="logo-icon">🍦</span>
          <span className="logo-text">Moon Ice Cream</span>
        </div>

        <h1>Recuperacion de Contraseña</h1>
        <p className="code-description">
          Ingresa el código de verificación que se envió a tu correo
        </p>
        
        <div className="user-info">
          <div className="user-icon">👤</div>
          <span className="user-email">{userEmail}</span>
        </div>

        <p className="code-instruction">Se envió el código a tu cuenta de gmail</p>

        {error && <div className="error-message">{error}</div>}

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
            {loading ? 'Verificando...' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecuperacionCodigo;