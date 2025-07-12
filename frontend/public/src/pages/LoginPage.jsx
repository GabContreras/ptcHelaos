import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/LoginPage.css';
import Navbar from "../components/NavBar";
import heladosLogin from "../imgs/heladosLogin.png"

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="login-container">
        <div className="form-section">
          <div className="form-wrapper">
            <div className="header">
              <h1 className="title">Iniciar Sesión</h1>
            </div>

            
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
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="forgot-password">
                <button 
                  onClick={() => console.log('Recuperar contraseña')}
                  className="forgot-link"
                >
                  ¿Olvidaste tu contraseña? <span className="underline" onClick={() => navigate('/PasswordRecovery')}>Recuperar contraseña</span>
                </button>
              </div>

              <button
                className="submit-button"
              >
                Iniciar Sesión
              </button>
            </div>

            <div className="register-section">
              <p className="register-text">
                ¿Aún no tienes una cuenta?{' '}
                <button 
                  onClick={() => console.log('Registro')}
                  className="register-link"
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