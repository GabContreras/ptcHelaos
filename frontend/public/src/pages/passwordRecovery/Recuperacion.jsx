import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recuperacion.css';
import { config } from '../../config.jsx';
import { usePasswordRecovery } from '../../hooks/PasswordRecoveryHook/usePasswordRecovery';

const API_BASE = config.api.API_BASE;

const Recuperacion = () => {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    loading,
    error,
    message,
    requestCode,
  } = usePasswordRecovery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    requestCode();
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="recovery-container">
      <div className="recovery-form-container">
        <div className="recovery-logo">
          <span className="logo-icon">🍦</span>
          <span className="logo-text">Moon Ice Cream</span>
        </div>

        <h1>Recuperacion de Contraseña</h1>
        <p className="recovery-subtitle">¿Tienes problemas para iniciar sesión?</p>
        <p className="recovery-description">Ingresa tu correo electrónico:</p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form className="recovery-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo.ejemplo@gmail.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <button 
              type="submit" 
              className="recovery-button" 
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Continuar'}
            </button>
          </div>

          <div className="back-to-login">
            <a onClick={goToLogin}>Volver a iniciar sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recuperacion;