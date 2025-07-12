import React from 'react';
import '../styles/InicioPage.css';
import Navbar from "../components/NavBar";
import inicio from '../imgs/inicioHelados.png'; 
import logo from '../imgs/logo.jpg';
import { useNavigate } from "react-router-dom";

const InicioPage = () => {
  const navigate = useNavigate()
  
  return (
    <>
      <Navbar />

      <div className="inicio-wrapper bg-white">
        <div className="hero-section">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="logo-area mb-6">
                <img src={logo} alt="Logo" className="logo-img" />
              </div>

              <div className="text-area">
                <h1 className="main-title">HELADOS ARTESANALES CON ESTILO</h1>
                <p className="subtitle">
                  Sabores únicos, preparados con amor<br />
                  y los mejores ingredientes.
                </p>
              </div>
            </div>
          </div>
        </div>

<div className="image-wrapper">
  <div className="image-card relative rounded-xl shadow-md overflow-hidden">
    <button className="menu-button absolute top-4 left-1/2 transform -translate-x-1/2 z-10" onClick={() => navigate('/Menu')} >
      Ver menú
    </button>
    <img src={inicio} alt="Inicio Helados" className="inicio-img" />
  </div>
</div>

      </div>
    </>
  );
};

export default InicioPage;
