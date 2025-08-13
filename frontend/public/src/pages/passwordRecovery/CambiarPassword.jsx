import React, { useEffect } from 'react';
import { usePasswordRecovery } from '../../hooks/PasswordRecoveryHook/usePasswordRecovery';
import UniversalModal from '../../components/modals/UniversalModal/UniversalModal';
import './CambiarPassword.css';

const CambiarPassword = () => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    showSuccessModal,
    handleModalClose,
    resetPassword,
    userEmail,
    fetchUserEmailFromToken, // <-- Asegúrate de extraer esto
  } = usePasswordRecovery();

  useEffect(() => {
    fetchUserEmailFromToken();
    // eslint-disable-next-line
  }, []);

  const isFormValid = newPassword.length >= 6 && newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword();
  };

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

      {/* Modal de éxito usando UniversalModal */}
      <UniversalModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        type="success"
        title="¡Éxito!"
        message="Tu contraseña se restableció exitosamente."
      />
    </>
  );
};

export default CambiarPassword;