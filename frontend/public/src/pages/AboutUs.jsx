import React from "react";
import Navbar from "../components/NavBar";
import '../styles/AboutUs.css';
import Logo from '../imgs/logo.jpg';
import Imagen1 from '../imgs/aboutus1.png';
import Imagen2 from '../imgs/aboutus2.png';
import Imagen3 from '../imgs/aboutus3.png';
import Persona1 from '../imgs/persona1.png';
import Persona2 from '../imgs/persona2.png';
import Persona3 from '../imgs/persona3.png';

function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="page-container">

        {/* About Us Section */}
        <section className="about-section">
          <div className="about-content">
            <div className="text-section">
              <h2 className="section-title">¿Quiénes somos?</h2>
              <p className="description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam rerum placeat perspiciatis minima veritatis 
                eum, facilis inventore provident aspernatur eveniet culpa. Lorem ipsum dolor sit, amet consectetur adipisicing 
                elit. Magnam rerum placeat perspiciatis minima veritatis eum, facilis inventore provident aspernatur eveniet culpa, 
                nihil ullam nulla ipsum sint? Tempora, veritatis? A, facilis?
              </p>
            </div>
            <div className="about-logo-container">
              <img 
                src={Logo}
                alt="Moon's Ice Cream Rolls Logo"
                className="about-logo"
              />
            </div>
          </div>

          {/* Ice Cream Process Images */}
          <div className="process-images">
            <div className="process-image">
              <img 
                src={Imagen1}
                alt="Ice cream rolling process step 1"
              />
            </div>
            <div className="process-image">
              <img 
                src={Imagen2}
                alt="Ice cream rolling process step 2"
              />
            </div>
            <div className="process-image">
              <img 
                src={Imagen3}
                alt="Ice cream rolling process step 3"
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2 className="section-title">Nuestro Equipo</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-avatar female-1">
                <img src={Persona1} alt="Laura Gómez" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Laura Gómez</h3>
                <p className="team-position">Encargada de Ventas</p>
              </div>
            </div>
            <div className="team-member">
              <div className="team-avatar female-2">
                <img src={Persona2} alt="María López" />
              </div>
              <div className="team-info">
                <h3 className="team-name">María López</h3>
                <p className="team-position">Administradora</p>
              </div>
            </div>
            <div className="team-member">
              <div className="team-avatar male-1">
                <img src={Persona3} alt="Carlos Pérez" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Carlos Pérez</h3>
                <p className="team-position">Maestro Heladero</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

export default AboutUs;
