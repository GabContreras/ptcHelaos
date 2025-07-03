import {useNavigate} from 'react-router-dom'
import Button from "../assets/Button"
import imgLogo from "../imgs/logo.jpg"
import "../styles/Navbar.css"

function NavBar() {
    const navigate = useNavigate()

    return (
        <div className='navbar'>
            <div className='logo'>
                <img src={imgLogo}/>
                <p>Moon's ice cream rolls</p>
            </div>
            <div className='links'>
                <a 
                onClick={() => navigate('/')}
                className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Inicio</a>
                <a>Menu</a>
                <a>Contacto</a>
                <a 
                onClick={() => navigate('/AboutUs')}
                className={location.pathname === '/AboutUs' ? 'nav-link active' : 'nav-link'}>Sobre nosotros</a>
            </div>
            <div className="logs">
                <Button titulo="Registrarse" color="#33A9FE" tipoColor="background"/>
                <Button titulo="Iniciar sesion" color="#33A9FE" tipoColor="border"/>
            </div>
        </div>
    )
}

export default NavBar;