import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/RegistroPage.css';
import Navbar from "../components/NavBar";
import HeladosRegistro from "../imgs/heladosRegistro.png"

const RegistroPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    fechaNacimiento: '',
    terminosAceptados: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    // Poner aca las cosas para que jale el formulario de registro :)
  };

  return (
<>
 <Navbar />
    <div className="registro-page">
      <div className="registro-container">
        <div className="form-section">
          <div className="form-content">
            <h1 className="form-title">Crea una nueva cuenta</h1>
            
            <div className="form-wrapper">
              <div className="form-group">
                <label className="form-label">Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingrese su nombre completo"
                  className="form-input"
                  required
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
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono:</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Ingrese su número de teléfono"
                  className="form-input"
                  required
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dirección:</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Ingrese su dirección"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de nacimiento:</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  className="form-input date-input"
                  required
                />
              </div>

              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="terminosAceptados"
                  id="terminos"
                  checked={formData.terminosAceptados}
                  onChange={handleInputChange}
                  className="form-checkbox"
                  required
                />
                <label htmlFor="terminos" className="checkbox-label">
                  Estoy de acuerdo con los términos y condiciones del sitio web.
                </label>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="submit-btn"
              >
                Registrarse
              </button>

              <div className="login-link">
                <p>
                  ¿Ya tienes una cuenta creada?{' '}
                  <a href="#" className="login-link-anchor">
                    Inicia Sesión
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="image-section">
  <div className="image-container">
    <img src={HeladosRegistro} alt="Imagen de postres" className="registro-image"/>
        </div>
       </div>
      </div>
    </div>
</>
  );
};

export default RegistroPage;