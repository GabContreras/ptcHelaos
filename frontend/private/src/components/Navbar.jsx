import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth(); // ✅ Solo extraer user, no name

    // Función para obtener el nombre a mostrar
    const getDisplayName = () => {
        // Debug temporal - puedes remover este console.log después
        console.log('User object:', user);
        
        if (!user) return 'MisterBeast'; // Fallback al valor original
        
        // Primero revisar si tiene un campo 'name'
        if (user.name && user.name !== user.email) return user.name;
        
        // Si tiene email, extraer la parte antes del @ y formatearla mejor
        if (user.email) {
            const emailName = user.email.split('@')[0];
            // Convertir puntos/guiones en espacios y capitalizar
            return emailName
                .replace(/[._-]/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }
        
        // Fallback al valor original
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
            label: "Toma de órdenes"
        },
        {
            path: "/inventory", 
            label: "Inventario"
        },
        {
            path: "/clients",
            label: "Control de clientes"
        },
        {
            path: "/pos",
            label: "Caja chica"
        },
        {
            path: "/dashboard",
            label: "Gráficas"
        },
        {
            path: "/delivery",
            label: "Delivery"
        },
        {
            path: "/employees", 
            label: "Empleados"
        }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="image-sidebar">
            {/* Header con logo */}
            <div className="image-header">
                <div className="header-icon">🌙</div>
                <div className="header-content">
                    <h1 className="header-title">Moon's Ice Cream Rolls</h1>
                    <span className="header-subtitle">Management System</span>
                </div>
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
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Navbar;