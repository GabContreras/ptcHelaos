import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
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
        if (!user) return 'MisterBeast';
        
        if (user.name && user.name !== user.email) return user.name;
        
        if (user.email) {
            const emailName = user.email.split('@')[0];
            return emailName
                .replace(/[._-]/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }
        
        return 'MisterBeast';
    };

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:4000/api/logout', {
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

    const menuItems = [
        {
            path: "/orders",
            label: "Toma de órdenes",
            icon: ""
        },
        {
            path: "/inventory", 
            label: "Inventario",
            icon: ""
        },
        {
            path: "/clients",
            label: "Control de clientes",
            icon: ""
        },
        {
            path: "/pos",
            label: "Caja chica",
            icon: ""
        },
        {
            path: "/dashboard",
            label: "Gráficas",
            icon: ""
        },
        {
            path: "/delivery",
            label: "Delivery",
            icon: ""
        },
        {
            path: "/employees", 
            label: "Empleados",
            icon: ""
        },
        {
            path: "/category", 
            label: "Categorías",
            icon: ""
        }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Botón hamburguesa para móvil */}
            {isMobile && (
                <button 
                    className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}
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
                    {/* Botón cerrar en móvil */}
                    {isMobile && (
                        <button 
                            className="close-mobile-menu"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Cerrar menú"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* User section */}
                <div className="user-card">
                    <div className="user-avatar-section">
                        <div className="user-circle">👤</div>
                    </div>
                    <div className="user-details">
                        <span className="username">{getDisplayName()}</span>
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