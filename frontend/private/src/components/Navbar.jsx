import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import { config } from '../config.jsx';
const API_BASE = config.api.API_BASE;

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user, isAdmin } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Cerrar menú al hacer clic en un enlace
    const handleMenuItemClick = () => {
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    };

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.image-sidebar') && !event.target.closest('.hamburger-menu')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    // Función para obtener el nombre a mostrar
    const getDisplayName = () => {
        if (!user) return 'Usuario';

        if (user.name && user.name !== user.email) return user.name;

        if (user.email) {
            const emailName = user.email.split('@')[0];
            return emailName
                .replace(/[._-]/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }

        return 'Usuario';
    };

    const handleLogout = async () => {
        try {
            await fetch(API_BASE + 'logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error("Error al hacer logout:", error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    // Definir todos los elementos del menú con sus roles
    const allMenuItems = [
        {
            path: "/dashboard",
            label: "Gráficas",
            icon: "📊",
            adminOnly: false
        },
        {
            path: "/orders",
            label: "Toma de órdenes",
            icon: "📝",
            adminOnly: false
        },
        {
            path: "/inventory",
            label: "Inventario",
            icon: "📦",
            adminOnly: false
        },
        {
            path: "/clients",
            label: "Control de clientes",
            icon: "👥",
            adminOnly: false
        },
        {
            path: "/delivery",
            label: "Delivery",
            icon: "🚚",
            adminOnly: false
        },
        {
            path: "/employees",
            label: "Empleados",
            icon: "👨‍💼",
            adminOnly: true // Solo admin
        },
        {
            path: "/category",
            label: "Categorías",
            icon: "🏷️",
            adminOnly: true // Solo admin
        },
        {
            path: "/pettyCash",
            label: "Caja Chica",
            icon: "💳",
            adminOnly: false 
        }
    ];

    // Filtrar elementos del menú según el rol del usuario
    const menuItems = allMenuItems.filter(item => {
        // Si el item es solo para admin y el usuario no es admin, no mostrarlo
        if (item.adminOnly && !isAdmin()) {
            return false;
        }
        return true;
    });

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Botón hamburguesa para móvil - solo mostrar cuando el menú está cerrado */}
            {isMobile && !isMobileMenuOpen && (
                <button
                    className={`hamburger-menu`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Abrir menú"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            )}

            {/* Overlay para móvil */}
            {isMobile && isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`image-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                {/* Header con logo */}
                <div className="image-header">
                    <div className="header-icon">🌙</div>
                    <div className="header-content">
                        <h1 className="header-title">Moon's Ice Cream Rolls</h1>
                        <span className="header-subtitle">Management System</span>
                    </div>
                    {/* Eliminamos el botón X ya que se puede cerrar clickeando fuera */}
                </div>

                {/* User section */}
                <div className="user-card">
                    <div className="user-avatar-section">
                        <div className="user-circle">👤</div>
                    </div>
                    <div className="user-details">
                        <span className="username">{getDisplayName()}</span>
                        {/* Mostrar el rol del usuario */}
                        <span className="user-role">
                            {isAdmin() ? 'Administrador' : 'Empleado'}
                        </span>
                        <button
                            className="logout-badge"
                            onClick={handleLogout}
                            title="Cerrar sesión"
                        >
                            cerrar sesión
                        </button>
                    </div>
                </div>

                {/* Navigation buttons */}
                <div className="nav-buttons">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`nav-button ${isActive(item.path) ? 'nav-active' : ''}`}
                            onClick={handleMenuItemClick}
                        >
                            {isMobile && (
                                <span className="nav-icon">{item.icon}</span>
                            )}
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;