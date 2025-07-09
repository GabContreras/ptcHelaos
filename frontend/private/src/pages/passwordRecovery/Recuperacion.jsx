import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recuperacion.css';

const Recuperacion = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`http://localhost:4000/api/passwordRecovery/requestCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const isEmailValid = email.trim() !== '';

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
              placeholder="tu-email@moonicecream.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <button 
              type="submit" 
              className="recovery-button" 
              disabled={!isEmailValid || loading}
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