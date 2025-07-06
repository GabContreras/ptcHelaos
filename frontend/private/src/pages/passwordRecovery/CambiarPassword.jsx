import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../components/Modals/passwordRecoveryModal/SuccessModal';
import './CambiarPassword.css';

const CambiarPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Obtener el email del token cuando el componente se monta
  useEffect(() => {
    const getUserEmailFromToken = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/passwordRecovery/getTokenInfo`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email || 'usuario@moonicecream.com');
        } else {
          setUserEmail('usuario@moonicecream.com');
        }
      } catch (err) {
        console.error('Error getting user email:', err);
        setUserEmail('usuario@moonicecream.com');
      }
    };

    getUserEmailFromToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
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
      const response = await fetch(`http://localhost:4000/api/passwordRecovery/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          password: newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Mostrar modal de éxito en lugar de redirigir inmediatamente
        setShowSuccessModal(true);
      } else {
        setError(data.message || 'Error al cambiar contraseña');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login', { 
      state: { 
        message: 'Contraseña cambiada exitosamente. Inicia sesión con tu nueva contraseña.' 
      } 
    });
  };

  const isFormValid = newPassword.length >= 6 && newPassword === confirmPassword;

  return (
    <>
      <div className="change-password-container">
        <div className="change-password-form-container">
          <div className="change-password-logo">
            <span className="logo-icon">🍦</span>
            <span className="logo-text">Moon Ice Cream</span>
          </div>

          <h1>Recuperacion de Contraseña</h1>
          <p className="change-password-description">
            Ingresa una nueva contraseña (se asociara a esta cuenta)
          </p>
          
          <div className="user-info">
            <div className="user-icon">👤</div>
            <span className="user-email">{userEmail}</span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="change-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ingresa la nueva contraseña:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Vuelve a ingresar la contraseña:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="change-password-button"
                disabled={!isFormValid || loading}
              >
                {loading ? 'Cambiando...' : 'Continuar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="¡Éxito!"
        message="Tu contraseña se restableció exitosamente."
      />
    </>
  );
};

export default CambiarPassword;