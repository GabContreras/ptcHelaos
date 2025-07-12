import React from "react";
import Navbar from "../components/NavBar";

function AboutUs() {
    return (
        <>
        <Navbar />
        <div className="about-us">
            <h1>Sobre Nosotros</h1>
            <p>
                Somos una empresa dedicada a ofrecer la mejor experiencia de helados artesanales. 
                Nuestro equipo está comprometido con la calidad y la innovación, utilizando solo los 
                mejores ingredientes para crear sabores únicos y deliciosos.
            </p>
            <p>
                Desde nuestros inicios, hemos trabajado arduamente para brindar un servicio excepcional 
                y un ambiente acogedor para todos nuestros clientes. ¡Ven a visitarnos y descubre por qué 
                somos los favoritos de la comunidad!
            </p>
        </div>
        </>
    );
}

export default AboutUs;