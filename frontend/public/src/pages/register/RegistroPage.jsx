import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/RegistroPage.css';
import Navbar from "../../components/NavBar";
import HeladosRegistro from "../../imgs/heladosRegistro.png";
import { useRegister } from '../../hooks/RegisterHook/useRegister';
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal";

const RegistroPage = () => {
  const {
    formData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    error,
    message,
    showSuccessModal,
    handleInputChange,
    registerUser,
    handleModalClose,
    goToLogin,
  } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  return (
    <>
      <Navbar />
      <div className="registro-page">
        <div className="registro-container">
          <div className="form-section">
            <div className="form-content">
              <h1 className="form-title">Crea una nueva cuenta</h1>
              
              {error && <div className="error-message">{error}</div>}
              {message && <div className="success-message">{message}</div>}
              
              <form className="form-wrapper" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nombre:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ingrese su nombre completo"
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Correo Electrónico:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ingrese su Correo Electrónico"
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0000-0000"
                    className="form-input"
                    required
                    disabled={loading}
                    maxLength="9"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña:</label>
                  <div className="password-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Ingrese su Contraseña"
                      className="form-input"
                      required
                      disabled={loading}
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Repetir contraseña:</label>
                  <div className="password-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Vuelva escribir su contraseña"
                      className="form-input"
                      required
                      disabled={loading}
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de nacimiento:</label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="form-input date-input"
                    required
                    disabled={loading}
                    max={(() => {
                      // Fecha máxima: hace 15 años desde hoy
                      const today = new Date();
                      const maxDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
                      return maxDate.toISOString().split('T')[0];
                    })()}
                    min={(() => {
                      // Fecha mínima: hace 100 años (límite razonable)
                      const today = new Date();
                      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
                      return minDate.toISOString().split('T')[0];
                    })()}
                  />
                  <small className="date-help-text">
                    Debes tener al menos 15 años para registrarte
                  </small>
                </div>

                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    id="terminos"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="form-checkbox"
                    required
                    disabled={loading}
                  />
                  <label htmlFor="terminos" className="checkbox-label">
                    Estoy de acuerdo con los términos y condiciones del sitio web.
                  </label>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                <div className="login-link">
                  <p>
                    ¿Ya tienes una cuenta creada?{' '}
                    <a 
                      href="#" 
                      className="login-link-anchor"
                      onClick={(e) => {
                        e.preventDefault();
                        goToLogin();
                      }}
                    >
                      Inicia Sesión
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="image-section">
            <div className="image-container">
              <img src={HeladosRegistro} alt="Imagen de postres" className="registro-image"/>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      <UniversalModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        type="success"
        title="¡Registro Exitoso!"
        message="Tu cuenta ha sido verificada correctamente."
      />
    </>
  );
};

export default RegistroPage;