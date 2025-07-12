import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/LoginPage.css';
import Navbar from "../components/NavBar";
import heladosLogin from "../imgs/heladosLogin.png";
import { useLogin } from '../hooks/LoginHook/useLogin';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Usar el hook personalizado
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mostrar mensaje de éxito si viene desde recuperación de contraseña
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  }, [location]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="form-section">
          <div className="form-wrapper">
            <div className="header">
              <h1 className="title">Iniciar Sesión</h1>
            </div>

            {/* Mostrar mensaje de éxito */}
            {successMessage && (
              <div className="success-message" style={{
                background: '#d4edda',
                color: '#155724',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {successMessage}
              </div>
            )}

            {/* Mostrar errores */}
            {error && (
              <div className="error-message" style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-fields">
                <div className="field-group">
                  <div className="field-label">
                    Correo Electrónico:
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su Correo Electrónico"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="field-group">
                  <div className="field-label">
                    Contraseña:
                  </div>
                  <div className="password-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingrese su Contraseña"
                      className="input-field password-input"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="password-toggle"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="forgot-password">
                  <button 
                    type="button"
                    onClick={() => navigate('/PasswordRecovery')}
                    className="forgot-link"
                    disabled={loading}
                  >
                    ¿Olvidaste tu contraseña? <span className="underline">Recuperar contraseña</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </div>
            </form>

            <div className="register-section">
              <p className="register-text">
                ¿Aún no tienes una cuenta?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/RegistroPage')}
                  className="register-link"
                  disabled={loading}
                >
                  Regístrate
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="image-section">
          <div className="image-container">
            <div className="image-placeholder">
              <img src={heladosLogin} alt="Imagen de postre" className="image-postre" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;