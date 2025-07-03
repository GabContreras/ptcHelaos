import React from "react";
import '../styles/404.css';
import Navbar from "../components/NavBar"; // Adjust the import path as necessary

function Page404() {
  return (
    <>
      <Navbar />

        <div className="page404">
            <h1>Error 404</h1>
            <p>Esta página no existe.</p>
            <p>Por favor, verifica la URL o vuelve a la página de inicio.</p>
        </div>
    </>
  );
}

export default Page404;