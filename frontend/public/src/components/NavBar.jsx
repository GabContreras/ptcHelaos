import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from "../assets/Button"
import Cart from './Cart'
import imgLogo from "../imgs/logo.jpg"
import "../styles/Navbar.css"
import CartIcon from "../imgs/cartIcon.png"

function NavBar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { authCokie, user, logout } = useAuth() // Obtener datos del contexto de autenticación
    const [mostrarCart, setMostrarCart] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const toggleCart = () => {
        setMostrarCart(!mostrarCart)
    }

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu)
    }

    const handleLogout = () => {
        logout()
        setShowUserMenu(false)
        navigate('/')
    }

    // Función para obtener las iniciales del usuario
    const getUserInitials = () => {
        if (user?.name) {
            return user.name
                .split(' ')
                .map(word => word.charAt(0))
                .join('')
                .toUpperCase()
                .substring(0, 2)
        }
        return 'U'
    }

    return (
        <div className='navbar-container'>
            <div className='navbar'>
                <div className='logo'>
                    <img src={imgLogo} className='imgLogo'/>
                    <p>Moon's ice cream rolls</p>
                </div>
                <div className='links'>
                    <a 
                        onClick={() => navigate('/')}
                        className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
                    >Inicio</a>
                    <a onClick={() => navigate('/Menu')} className={location.pathname === '/Menu' ? 'nav-link active' : 'nav-link'} >Menu</a>
                    <a onClick={() => navigate('/Contactanos')} className={location.pathname === '/Contactanos' ? 'nav-link active' : 'nav-link'} >Contacto</a>
                    <a 
                        onClick={() => navigate('/AboutUs')}
                        className={location.pathname === '/AboutUs' ? 'nav-link active' : 'nav-link'}
                    >Sobre nosotros</a>
                </div>
                
                <a onClick={toggleCart} className='linkCart'>
                    <img src={CartIcon} alt="Carrito"/>
                </a>

                <div className="logs">
                    {authCokie ? (
                        // Usuario autenticado - Mostrar avatar
                        <div className="user-section">
                            <div className="user-avatar" onClick={toggleUserMenu}>
                                <span className="user-initials">{getUserInitials()}</span>
                            </div>
                            
                            {showUserMenu && (
                                <div className="user-menu">
                                    <div className="user-info">
                                        <p className="user-email">{user?.email}</p>
                                    </div>
                                    <div className="menu-divider"></div>
                                    <button className="menu-item" onClick={() => navigate('/perfil')}>
                                        Mi Perfil
                                    </button>
                                    <button className="menu-item" onClick={() => navigate('/pedidos')}>
                                        Mis Pedidos
                                    </button>
                                    <div className="menu-divider"></div>
                                    <button className="menu-item logout" onClick={handleLogout}>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Usuario no autenticado - Mostrar botones
                        <>
                            <Button 
                                titulo="Registrarse" 
                                color="#33A9FE" 
                                tipoColor="background" 
                                onClick={() => navigate('/RegistroPage')} 
                            />
                            <Button 
                                titulo="Iniciar sesion" 
                                color="#33A9FE" 
                                tipoColor="border" 
                                onClick={() => navigate('/LoginPage')} 
                            />
                        </>
                    )}
                </div>
            </div>

            {mostrarCart && (
                <div className="cart-slide">
                <h1>Tu pedido:</h1>
                    <div className='items'>
                        <Cart />
                    </div>
                    <Button titulo="Finalizar orden" color="#33A9FE" tipoColor="background" onClick={() => navigate('/FinishOrder')}/>
                </div>
            )}
        </div>
    )
}

export default NavBar