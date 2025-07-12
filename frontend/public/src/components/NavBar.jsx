import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Button from "../assets/Button"
import Cart from './Cart'
import imgLogo from "../imgs/logo.jpg"
import "../styles/Navbar.css"
import CartIcon from "../imgs/cartIcon.png"

function NavBar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [mostrarCart, setMostrarCart] = useState(false)

    const toggleCart = () => {
        setMostrarCart(!mostrarCart)
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
                    <a>Contacto</a>
                    <a 
                        onClick={() => navigate('/AboutUs')}
                        className={location.pathname === '/AboutUs' ? 'nav-link active' : 'nav-link'}
                    >Sobre nosotros</a>
                </div>
                <a onClick={toggleCart} className='linkCart'>
                    <img src={CartIcon} alt="Carrito"/>
                </a>
                <div className="logs">
                    <Button titulo="Registrarse" color="#33A9FE" tipoColor="background" onClick={() => navigate('/RegistroPage')} />
                    <Button titulo="Iniciar sesion" color="#33A9FE" tipoColor="border" onClick={() => navigate('/LoginPage')}  />
                </div>
                </div>
                
            {/* Mostrar carrito lateral si está activado */}
            {mostrarCart && (
                <div className="cart-slide">
                    <Cart />
                    <a onClick={() => navigate('/FinishOrder')}/>Finalizar Orden<a/>
                </div>
            )}
        </div>
    )
}

export default NavBar
