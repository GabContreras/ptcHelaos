import customersModel from '../models/Customer.js'
import employeesModel from '../models/Employee.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

const loginController = {}

const attemptsLimit = 5 // Número máximo de intentos de login permitidos

loginController.login = async (req, res) => {
    const { email, password } = req.body
    console.log('Login attempt:', email);

    try {
        let userFound = null
        let userType = null

        // Verificar si es admin
        if (email === config.emailAdmin.email && password === config.emailAdmin.password) {
            userType = 'admin'
            userFound = { _id: 'admin', name: 'Administrador', email: email }
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

            //return res.json({val: (userFound.lockTime > Date.now()), diferencia: (Date.parse("2025-08-12T14:09:53.176+00:00") - Date.now()) / 60000});
            if (Date.parse(userFound.lockTime) > Date.now()) {
                const minutosRestantes = Math.ceil((userFound.lockTime - Date.now()) / 60000);
                return res.status(403).json({ message: "Cuenta bloqueada, intenta de nuevo en: " + minutosRestantes + " minutos." });
            }


            const isMatch = await bcryptjs.compare(password, userFound.password)

            // Verificar si el cliente está verificado
            if (userType === 'customer' && !userFound.isVerified) {
                return res.status(403).json({
                    message: 'Cuenta no verificada. Revisa tu email para el código de verificación.',
                    verified: false
                })
            }
            if (!isMatch) {

                //Si se equivoca de contraseña, suma 1 a los intentos de login
                userFound.loginAttempts = userFound.loginAttempts + 1; // Incrementa el contador de intentos

                //Si sobrepasa los intentos permitidos, bloquea la cuenta
                if (userFound.loginAttempts >= attemptsLimit) {
                    userFound.lockTime = Date.now() + 15 * 60000; // Bloquea la cuenta por un tiempo
                    userFound.loginAttempts = 0;
                    await userFound.save();
                    return res.status(403).json({ message: "Cuenta bloqueada por 15 minutos." });

                }
                await userFound.save(); // Guarda los cambios en la base de datos
                return res.status(401).json({ message: "Credenciales inválidas, te quedan: " + (attemptsLimit - userFound.loginAttempts) + " intentos." });
            }
            userFound.loginAttempts = 0; // Reinicia los intentos de login si la contraseña es correcta
            userFound.lockTime = null; // Reinicia el tiempo de bloqueo si la contraseña es correcta
            await userFound.save(); // Guarda los cambios en la base de datos 

        }

        jwt.sign(
            { user: userFound._id, userType },
            config.JWT.secret,
            { expiresIn: config.JWT.expiresIn },
            (error, token) => {
                if (error) {
                    console.error('Error generando token:', error);
                    return res.status(500).json({ message: 'Error generando token' })
                }
                const host = req.get('host') || '';
                const origin = req.get('origin') || '';

                const isProduction = host.includes('onrender.com') ||
                    process.env.NODE_ENV === 'production' ||
                    req.secure;

                const cookieOptions = {
                    httpOnly: true,
                    sameSite: isProduction ? "None" : "lax", // Dinámico según entorno
                    secure: isProduction, // true solo en producción
                    maxAge: 24 * 60 * 60 * 1000, // 24 horas
                    path: '/' // Disponible en todo el dominio
                };

                console.log('Setting cookie with options:', {
                console.log('Setting cookie with options:', {
                    isProduction,
                    host: req.get('host'),
                    cookieOptions
                });

                res.cookie('authToken', token, cookieOptions);


                // Respuesta completa con datos del usuario
                res.status(200).json({
                    message: 'Login exitoso',
                    userType: userType,
                    userId: userFound._id,
                    user: {
                        email: userFound.email,
                        name: userFound.name || userFound.username || email.split('@')[0]
                    }
                })
            }
        )
    } catch (error) {
        console.error('Error en login:', error)
        res.status(500).json({ message: 'Error en el servidor' })
    }
}

// NUEVO: Endpoint para verificar autenticación
loginController.getAuthenticatedUser = async (req, res) => {
    console.log('Checking auth, cookies:', Object.keys(req.cookies));

    const token = req.cookies.authToken
    if (!token) {
        return res.status(401).json({ message: 'No autenticado' })
    }

    try {
        const decoded = jwt.verify(token, config.JWT.secret)
        let user = null

        if (decoded.userType === 'admin') {
            user = {
                _id: 'admin',
                name: 'Administrador',
                email: config.emailAdmin.email
            user = {
                _id: 'admin',
                name: 'Administrador',
                email: config.emailAdmin.email
            }
        } else if (decoded.userType === 'employee') {
            user = await employeesModel.findById(decoded.user)
        } else if (decoded.userType === 'customer') {
            user = await customersModel.findById(decoded.user)
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name || user.username || user.email.split('@')[0],
                userType: decoded.userType,
            },
        })
    } catch (error) {
        console.error('Token verification failed:', error)
        return res.status(401).json({ message: 'Token inválido o expirado' })
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

// NUEVO: Endpoint de logout
loginController.logout = (req, res) => {

    const isProduction = req.get('host')?.includes('vercel.app') ||
        req.get('host')?.includes('herokuapp.com') ||
        req.get('host')?.includes('onrender.com') ||
        process.env.NODE_ENV === 'production' ||
        req.secure;

    res.clearCookie('authToken', {
        httpOnly: true,
        sameSite: isProduction ? "None" : "lax",
        secure: isProduction,
        path: '/'
    });


    console.log('Cookie cleared');
    res.status(200).json({ message: 'Logout exitoso' });
}

export default loginController