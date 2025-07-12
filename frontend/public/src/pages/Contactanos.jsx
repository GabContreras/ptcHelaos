import React, { useState } from 'react';
import '../styles/Contactanos.css';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import Imagen from "../imgs/contactanoshelado.png"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('Mensaje enviado correctamente!');
  };

  return (
<>
   <Navbar/>
    <div className="contact-page">
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-form-wrapper">
            <h2 className="contact-title">Contáctanos</h2>
            <div className="contact-form">
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">Nombre Completo:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingrese su nombre completo"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Correo Electrónico:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingrese su correo electrónico"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="asunto" className="form-label">Asunto:</label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje" className="form-label">Mensaje:</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="6"
                  required
                />
              </div>

              <button type="submit" onClick={handleSubmit} className="submit-btn">
                Enviar
              </button>
            </div>
          </div>
          
          <div className="contact-image-wrapper">
            <div className="coffee-image">
              <img 
                src= {Imagen}
                alt="Café artesanal con rollos de canela"
                className="coffee-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="visit-section">
        <div className="visit-container">
          <h2 className="visit-title">Visítanos</h2>

          <div className="map-container">
            <div className="decorative-frame"></div>
            
            <div className="map-frame">
              <div className="map-placeholder">
  <iframe
    title="Moon's Ice Cream Rolls"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.9892613424096!2d-88.87194192418866!3d13.505705086839863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f7cad93616c420f%3A0xc5fd7c7b069dba7!2sMoon&#39;s%20Ice%20Cream%20Rolls!5e0!3m2!1ses!2ssv!4v1720737778981!5m2!1ses!2ssv"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
            </div>
            
            <div className="decorative-frame"></div>
          </div>
        </div>
      </section>
    </div>
    <Footer/>
</>
  );
};

export default ContactPage;