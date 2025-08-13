import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from "../assets/Button"
import Cart from './Cart'
import imgLogo from "../imgs/logo.jpg"
import "../styles/Navbar.css"
import CartIcon from "../imgs/cartIcon.png"

function NavBar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { authCokie, user, logout } = useAuth()
    const [mostrarCart, setMostrarCart] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const userMenuRef = useRef(null)
    const cartRef = useRef(null)

    const toggleCart = () => {
        setMostrarCart(!mostrarCart)
        if (showUserMenu) setShowUserMenu(false)
        if (mobileMenuOpen) setMobileMenuOpen(false)
    }

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu)
        if (mostrarCart) setMostrarCart(false)
        if (mobileMenuOpen) setMobileMenuOpen(false)
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
        if (showUserMenu) setShowUserMenu(false)
        if (mostrarCart) setMostrarCart(false)
    }

    const handleLogoClick = () => {
        if (window.innerWidth <= 768) {
            toggleMobileMenu()
        } else {
            navigate('/')
        }
    }

    const handleMobileNavigation = (path) => {
        navigate(path)
        setMobileMenuOpen(false)
    }

    const handleLogout = () => {
        logout()
        setShowUserMenu(false)
        navigate('/')
    }

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false)
            }
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setMostrarCart(false)
            }
            if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.logo')) {
                setMobileMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [mobileMenuOpen])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMobileMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className='navbar-container'>
            <div className='navbar'>
                <div className='logo' onClick={handleLogoClick}>
                    <img src={imgLogo} className='imgLogo' alt="Logo"/>
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

                <div className="navbar-right-section">
                    <div ref={cartRef} className="navbar-cart-container">
                        <a onClick={toggleCart} className='linkCart'>
                            <img src={CartIcon} alt="Carrito"/>
                        </a>
                    </div>

                    <div className="logs">
                        {authCokie ? (
                            <div className="user-section" ref={userMenuRef}>
                                <div className="user-avatar" onClick={toggleUserMenu}>
                                    <span className="user-initials">{getUserInitials()}</span>
                                </div>
                                
                                {showUserMenu && (
                                    <div className="user-menu">
                                        <div className="user-info">
                                            <p className="user-email">{user?.email}</p>
                                        </div>
                                        <div className="menu-divider"></div>
                                        <button className="menu-item" onClick={() => {
                                            navigate('/userAccount')
                                            setShowUserMenu(false)
                                        }}>
                                            Mi Perfil
                                        </button>
                                        <div className="menu-divider"></div>
                                        <button className="menu-item logout" onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="auth-buttons-container">
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
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <>
                    <div className="mobile-menu-overlay active" onClick={() => setMobileMenuOpen(false)} />
                    <div className="mobile-menu active">
                        <div className="mobile-menu-links">
                            <a 
                                onClick={() => handleMobileNavigation('/')}
                                className={location.pathname === '/' ? 'active' : ''}
                            >
                                Inicio
                            </a>
                            <a 
                                onClick={() => handleMobileNavigation('/Menu')}
                                className={location.pathname === '/Menu' ? 'active' : ''}
                            >
                                Menu
                            </a>
                            <a 
                                onClick={() => handleMobileNavigation('/Contactanos')}
                                className={location.pathname === '/Contactanos' ? 'active' : ''}
                            >
                                Contacto
                            </a>
                            <a 
                                onClick={() => handleMobileNavigation('/AboutUs')}
                                className={location.pathname === '/AboutUs' ? 'active' : ''}
                            >
                                Sobre nosotros
                            </a>
                        </div>
                    </div>
                </>
            )}

            {mostrarCart && (
                <div className="cart-slide" ref={cartRef}>
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