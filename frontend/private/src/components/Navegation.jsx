import React, { useEffect } from "react";
import Layout from "./Layout";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import Recuperacion from "../pages/passwordRecovery/Recuperacion";
import RecuperacionCodigo from "../pages/passwordRecovery/RecuperacionCodigo";
import CambiarPassword from "../pages/passwordRecovery/CambiarPassword";
import Dashboard from "../pages/Dashboard/Graficas";
import Clients from "../pages/Clients/Clients";
import Employees from "../pages/Employees/Employees";
import PrivateRoute from "./PrivateRoute";
import Orders from "../pages/Orders/Orders";
import Storage from "../pages/Storage/Storage";
import Delivery from "../pages/Delivery/Delivery"
import Finances from "../pages/Finances/Finances";
import { useAuth } from "../context/AuthContext";

function Navegation() {
  const location = useLocation();
  const { authCokie, isLoading } = useAuth();
  const navigate = useNavigate();

  // Rutas públicas (sin navbar)
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/recuperacion",
    "/recuperacioncodigo", 
    "/cambiarpassword",
  ];

  useEffect(() => {
    if (isLoading) return;
    
    const currentPath = location.pathname.toLowerCase().replace(/\/$/, "");
    
    if (authCokie && publicRoutes.includes(currentPath)) {
      navigate("/dashboard");
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
      {/* ===== RUTAS PÚBLICAS (sin layout/navbar) ===== */}
      <Route 
        path="/" 
        element={authCokie ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/login" 
        element={authCokie ? <Navigate to="/dashboard" /> : <Login />} 
      />
      
      {/* 🔄 RUTAS DE RECUPERACIÓN DE CONTRASEÑA */}
      <Route 
        path="/recuperacion" 
        element={authCokie ? <Navigate to="/dashboard" /> : <Recuperacion />} 
      />
      <Route 
        path="/recuperacioncodigo" 
        element={authCokie ? <Navigate to="/dashboard" /> : <RecuperacionCodigo />} 
      />
      <Route 
        path="/cambiarpassword" 
        element={authCokie ? <Navigate to="/dashboard" /> : <CambiarPassword />} 
      />
      
      {/* ===== RUTAS PRIVADAS (CON layout y navbar) ===== */}
      <Route element={<PrivateRoute />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        
        {/* Clientes */}
        <Route path="/clients" element={
          <Layout>
            <Clients />
          </Layout>
        } />
        
        {/* Empleados */}
        <Route path="/employees" element={
          <Layout>
            <Employees />
          </Layout>
        } />
        
        {/* Otras rutas con layout */}
        <Route path="/orders" element={
          <Layout>
            <Orders />
          </Layout>
        } />
        
        <Route path="/inventory" element={
          <Layout>
            < Storage />
          </Layout>
        } />
        
        <Route path="/pos" element={
          <Layout>
            <Finances/>
          </Layout>
        } />
        
        <Route path="/analytics" element={
          <Layout>
            <div style={{ padding: '2rem', background: 'white', minHeight: '100vh' }}>
              <h1>Gráficas</h1>
              <p>Análisis y reportes - En desarrollo</p>
            </div>
          </Layout>
        } />
        
        <Route path="/delivery" element={
          <Layout>
            <Delivery />
          </Layout>
        } />
        
        {/* Ruta por defecto para rutas no encontradas */}
        <Route path="*" element={
          <Layout>
            <div style={{ padding: '2rem', background: 'white', minHeight: '100vh', textAlign: 'center' }}>
              <h1>Página no encontrada</h1>
              <p>La ruta que buscas no existe</p>
            </div>
          </Layout>
        } />
      </Route>
    </Routes>
  );
}

export default Navegation;