import customersModel from '../models/Customer.js'
import employeesModel from '../models/Employee.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {config} from '../config.js'

const loginController = {}

loginController.login = async (req, res) => {
    const { email, password } = req.body
    try {
        let userFound = null
        let userType = null

        // Verificar si es admin
        if (email === config.emailAdmin.email && password === config.emailAdmin.password) {
            userType = 'admin'
            userFound = { _id: 'admin' }
        } else {
            // Buscar en empleados primero
            userFound = await employeesModel.findOne({ email })
            if (userFound) userType = 'employee'

            // Si no se encuentra en empleados, buscar en clientes
            if (!userFound) {
                userFound = await customersModel.findOne({ email })
                if (userFound) userType = 'customer'
            }
        }

        if (!userFound) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        // Verificar contraseña (excepto para admin)
        if (userType !== 'admin') {
            const isMatch = await bcryptjs.compare(password, userFound.password)
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' })
            }

            // Verificar si el cliente está verificado
            if (userType === 'customer' && !userFound.isVerified) {
                return res.status(403).json({ 
                    message: 'Cuenta no verificada. Revisa tu email para el código de verificación.',
                    verified: false 
                })
            }
        }

        jwt.sign(
            { user: userFound._id, userType },
            config.JWT.secret,
            { expiresIn: config.JWT.expiresIn },
            (error, token) => {
                if (error) {
                    return res.status(500).json({ message: 'Error generando token' })
                }

                res.cookie('authToken', token)
                res.status(200).json({ 
                    message: 'Login exitoso',
                    userType: userType,
                    userId: userFound._id
                })
            }
        )
    } catch (error) {
        console.error('Error en login:', error)
        res.status(500).json({ message: 'Error en el servidor' })
    }
}

// Controlador para verificar si el usuario está logueado usando la cookie
loginController.isLoggedIn = (req, res) => {
    const token = req.cookies.authToken
    if (!token) {
        return res.status(401).json({ loggedIn: false, message: 'No se proporcionó token' })
    }
    jwt.verify(token, config.JWT.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ loggedIn: false, message: 'Token inválido o expirado' })
        }
        res.status(200).json({ 
            loggedIn: true, 
            user: decoded.user, 
            userType: decoded.userType 
        })
    })
}

export default loginController