import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Page404 from "../pages/404";
import AboutUs from "../pages/AboutUs";
import FinishOrder from "../pages/FinishOrder";
import LoginPage from "../pages/LoginPage";
import RegistroPage from "../pages/register/RegistroPage";
import InicioPage from "../pages/IncioPage";
import Menu from "../pages/Menu";
import Contactanos from "../pages/Contactanos";
import Recuperacion from "../pages/passwordRecovery/Recuperacion";
import RecuperacionCodigo from "../pages/passwordRecovery/RecuperacionCodigo";
import CambiarPassword from "../pages/passwordRecovery/CambiarPassword";
import VerificarRegistro from "../pages/register/VerificarRegistro";
import FollowOrder from "../pages/FollowOrder";
import RateService from "../pages/RateService";
import UserAccount from "../pages/UserAccount";

// Importa tu contexto de autenticación
import { useAuth } from "../context/AuthContext";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authCokie, isLoading, user } = useAuth(); // Ajusta según tu contexto

  // Rutas que NO deben ser accesibles cuando el usuario está logueado
  const restrictedRoutesWhenLoggedIn = [
    "/LoginPage",
    "/RegistroPage", 
    "/passwordRecovery",
    "/recuperacioncodigo",
    "/cambiarpassword",
    "/verificar-registro",
    "/login",
    "/register"
  ];

  useEffect(() => {
    if (isLoading) return;

    const currentPath = location.pathname;

    // Si el usuario está autenticado y trata de acceder a rutas restringidas
    if (authCokie && restrictedRoutesWhenLoggedIn.includes(currentPath)) {
      navigate("/Menu"); // o la ruta principal de tu app
    }
  }, [authCokie, navigate, location.pathname, isLoading]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #8D6CFF 0%, #99DBFF 50%, #FFBAE7 100%)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem 3rem',
          borderRadius: '20px',
          color: '#8D6CFF',
          fontSize: '18px',
          fontWeight: '600',
          boxShadow: '0 20px 40px rgba(141, 108, 255, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>🍦</div>
          Cargando Moon Ice Cream...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<InicioPage />} />
      
      {/* Rutas públicas siempre accesibles */}
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/Menu" element={<Menu />} />
      <Route path="/Contactanos" element={<Contactanos />} />

      {/* Rutas que requieren autenticación */}
      <Route path="/FinishOrder" element={<FinishOrder />} />
      <Route path="/userAccount" element={<UserAccount />} />
      <Route path="/FollowOrder" element={<FollowOrder />} />
      <Route path="/RateService" element={<RateService />} />
      <Route path="/UserAccount" element={<UserAccount />} />

      {/* Rutas de autenticación - redirigen si ya está logueado */}
      <Route
        path="/LoginPage"
        element={authCokie ? <Navigate to="/Menu" replace /> : <LoginPage />}
      />
      <Route
        path="/RegistroPage"
        element={authCokie ? <Navigate to="/Menu" replace /> : <RegistroPage />}
      />

      {/* Rutas de recuperación de contraseña - redirigen si ya está logueado */}
      <Route
        path="/passwordRecovery"
        element={authCokie ? <Navigate to="/Menu" replace /> : <Recuperacion />}
      />
      <Route
        path="/recuperacioncodigo"
        element={authCokie ? <Navigate to="/Menu" replace /> : <RecuperacionCodigo />}
      />
      <Route
        path="/cambiarpassword"
        element={authCokie ? <Navigate to="/Menu" replace /> : <CambiarPassword />}
      />
      <Route
        path="/verificar-registro"
        element={authCokie ? <Navigate to="/Menu" replace /> : <VerificarRegistro />}
      />

      {/* Rutas alternativas para compatibilidad - redirigen si ya está logueado */}
      <Route
        path="/login"
        element={authCokie ? <Navigate to="/Menu" replace /> : <Navigate to="/LoginPage" replace />}
      />
      <Route
        path="/register"
        element={authCokie ? <Navigate to="/Menu" replace /> : <Navigate to="/RegistroPage" replace />}
      />

      {/* Ruta catch-all para páginas no encontradas */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default Navigation;