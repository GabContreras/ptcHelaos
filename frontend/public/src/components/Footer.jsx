import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer-container">
      <div className="footer-links">
        <button className="footer-link" onClick={() => navigate('/')}>Inicio</button>
        <button className="footer-link" onClick={() => navigate('/menu')}>Menu</button>
        <button className="footer-link" onClick={() => navigate('/contactanos')}>Contacto</button>
        <button className="footer-link" onClick={() => navigate('/AboutUs')}>Sobre nosotros</button>
      </div>

      <div className="footer-copy">
        <p>© 2025 Moon's Ice Cream Rolls. Todos los derechos reservados.</p>
        <div className="footer-legal">
          <span onClick={() => navigate('/terminos')}>Términos y servicios</span>
          <span onClick={() => navigate('/privacidad')}>Políticas de privacidad</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
