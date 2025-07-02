//import {useNavigate} from 'react-router-dom'
import Button from "../assets/Button"
import imgLogo from "../imgs/logo.jpg"
import "../styles/Navbar.css"

function NavBar() {
    //const navigate = useNavigate()

    return (
        <div className='navbar'>
            <div className='logo'>
                <img src={imgLogo}/>
                <p>Moon's ice cream rolls</p>
            </div>
            <div className='links'>
                <a>Inicio</a>
                <a>Menu</a>
                <a>Contacto</a>
                <a>Sobre nosotros</a>
            </div>
            <div className="logs">
                <Button titulo="Registrarse" color="#99DBFF"/>
                <Button titulo="Iniciar sesion" color="#FFBAE7"/>
            </div>
        </div>
    )
}

export default NavBar;