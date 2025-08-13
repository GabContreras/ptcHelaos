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
import TomaDeOrdenes from "../pages/TomaDeOrdenes/TomaDeOrdenes";
import Storage from "../pages/Storage/Storage";
import Orders from "../pages/Orders/Orders"
import PettyCash from "../pages/PettyCash/PettyCash";
import Category from "../pages/Categories/Categories";
import Products from "../pages/Products/Products"
import { useAuth } from "../context/AuthContext";

function Navegation() {
  const location = useLocation();
  const { authCokie, isLoading, user, isAdmin } = useAuth();
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

  // Usar la función isAdmin que ya tienes en tu AuthContext
  // const isAdmin = () => { ... } // ← ELIMINAR esta función, ya está en useAuth

  // Componente para mostrar mensaje de acceso denegado
  const AccessDenied = () => (
    <Layout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'white',
        fontFamily: 'Inter, sans-serif',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            color: '#8D6CFF'
          }}>
            🔒
          </div>
          <h1 style={{
            color: '#8D6CFF',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem',
            margin: '0 0 1rem 0'
          }}>
            Acceso Restringido
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: '1.5',
            margin: '0 0 2rem 0'
          }}>
            Esta sección está disponible únicamente para administradores del sistema.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#8D6CFF',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => e.target.style.background = '#7C3AED'}
            onMouseOut={(e) => e.target.style.background = '#8D6CFF'}
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );

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
        {/* Dashboard - Accesible para todos */}
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />

        {/* Clientes - Accesible para todos */}
        <Route path="/clients" element={
          <Layout>
            <Clients />
          </Layout>
        } />

        {/* Órdenes - Accesible para todos */}
        <Route path="/TomaDeOrdenes" element={
          <Layout>
            <TomaDeOrdenes />
          </Layout>
        } />

        {/* Inventario - Accesible para todos */}
        <Route path="/inventory" element={
          <Layout>
            <Storage />
          </Layout>
        } />

        {/* Delivery - Accesible para todos */}
        <Route path="/orders" element={
          <Layout>
            <Orders />
          </Layout>
        } />

        {/* Analytics - Accesible para todos */}
        <Route path="/analytics" element={
          <Layout>
            <div style={{ padding: '2rem', background: 'white', minHeight: '100vh' }}>
              <h1>Gráficas</h1>
              <p>Análisis y reportes - En desarrollo</p>
            </div>
          </Layout>
        } />

        {/* ===== RUTAS SOLO PARA ADMIN ===== */}
        {/* Empleados - Solo admin */}
        <Route path="/employees" element={
          isAdmin() ? (
            <Layout>
              <Employees />
            </Layout>
          ) : <AccessDenied />
        } />

        {/* POS/Finanzas - Solo admin */}
        <Route path="/pettyCash" element={
          <Layout>
            <PettyCash />
          </Layout>

        } />

        {/* Categorías - Solo admin */}
        <Route path="/category" element={
          isAdmin() ? (
            <Layout>
              <Category />
            </Layout>
          ) : <AccessDenied />
        } />

        {/* Productos - Solo admin */}
        <Route path="/products" element={
          isAdmin() ? (
            <Layout>
              <Products />
            </Layout>
          ) : <AccessDenied />
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