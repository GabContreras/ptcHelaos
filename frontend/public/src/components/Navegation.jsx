import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Page404 from "../pages/404";
import AboutUs from "../pages/AboutUs";
import FinishOrder from "../pages/FinishOrder";
import LoginPage from "../pages/LoginPage";
import RegistroPage from "../pages/register/RegistroPage";
import InicioPage from "../pages/incioPage";
import Menu from "../pages/Menu";
import Contactanos from "../pages/Contactanos"
import Recuperacion from "../pages/passwordRecovery/Recuperacion";
import RecuperacionCodigo from "../pages/passwordRecovery/RecuperacionCodigo";
import CambiarPassword from "../pages/passwordRecovery/CambiarPassword";
import VerificarRegistro from "../pages/register/VerificarRegistro";
import FollowOrder from "../pages/FollowOrder";

function Navigation() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<InicioPage />} />
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/FinishOrder" element={<FinishOrder />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/RegistroPage" element={<RegistroPage />} />
        <Route path="/Menu" element={<Menu/>} />
        <Route path="/Contactanos" element={<Contactanos/>} />
      
      {/* Rutas de recuperación de contraseña y registro sin navbar */}
      <Route path="/passwordRecovery" element={<Recuperacion />} />
      <Route path="/recuperacioncodigo" element={<RecuperacionCodigo />} />
      <Route path="/cambiarpassword" element={<CambiarPassword />} />
      <Route path="/verificar-registro" element={<VerificarRegistro />} />

      {/* Rutas alternativas para compatibilidad */}
      <Route path="/login" element={<Navigate to="/LoginPage" replace />} />
      <Route path="/register" element={<Navigate to="/RegistroPage" replace />} />

      {/* Ruta catch-all para páginas no encontradas */}
      <Route path="*" element={<Page404 />} />
        <Route path="*" element={<Page404 />} />
        <Route path="/FollowOrder" element={<FollowOrder />} />
    </Routes>
  );
}

export default Navigation;