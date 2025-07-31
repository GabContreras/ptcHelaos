import jsonwebtoken from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import customersModel from '../models/Customer.js'
import employeesModel from '../models/Employee.js'

import { config } from '../config.js'
import { sendMail, HTMLRecoveryEmail } from '../utils/MailPasswordRecovery.js'

const passRecov = {}

passRecov.requestCode = async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ message: 'Dirección de email inválida o faltante' });
    }

    try {
        let userFound;
        let userType;

        // Buscar en empleados primero
        userFound = await employeesModel.findOne({ email });
        if (userFound) {
            userType = 'employee';
        } else {
            // Buscar en clientes
            userFound = await customersModel.findOne({ email });
            if (userFound) {
                userType = 'customer';
            }
        }

        if (!userFound) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const token = jsonwebtoken.sign(
            { email, code, userType, verified: false },
            config.JWT.secret,
            { expiresIn: '1h' }
        );

        res.cookie("tokenRecoveryCode", token, {
            httpOnly: true,
            sameSite: "None", // o "Lax" si es mismo dominio
            secure: true,   // solo si usas HTTPS
            maxAge: 20 * 60 * 1000
        })

        console.log('Sending recovery code to:', email);

        await sendMail(
            email,
            "Código de recuperación de contraseña",
            `Tu código de verificación es: ${code}`,
            HTMLRecoveryEmail(code)
        )

        res.status(200).json({ message: 'Código de recuperación enviado al email' });

    } catch (error) {
        console.error('Error requesting password recovery:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

passRecov.verifyCode = async (req, res) => {
    const { code } = req.body

    try {
        const token = req.cookies.tokenRecoveryCode

        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token' })
        }
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        if (decoded.code !== code) {
            return res.status(401).json({ message: 'Código inválido' })
        }

        const newToken = jsonwebtoken.sign(
            {
                email: decoded.email,
                code: decoded.code,
                userType: decoded.userType,
                verified: true
            },
            config.JWT.secret,
            { expiresIn: '1h' }
        )

        res.cookie('tokenRecoveryCode', newToken, {
            httpOnly: true,
            sameSite: "None", // o "Lax" si es mismo dominio
            secure: true,    // solo si usas HTTPS
            maxAge: 60 * 60 * 1000
        })

        res.status(200).json({ message: 'Código de recuperación verificado' })

    } catch (error) {
        console.error("Error verifying recovery code:", error)
        res.status(500).json({ message: "Error interno del servidor" })
    }
}

// Nuevo endpoint para obtener información del token
passRecov.getTokenInfo = async (req, res) => {
    try {
        const token = req.cookies.tokenRecoveryCode

        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token' })
        }

        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        // Devolver solo la información necesaria (email)
        res.status(200).json({
            email: decoded.email,
            userType: decoded.userType,
            verified: decoded.verified
        })

    } catch (error) {
        console.error("Error getting token info:", error)
        res.status(500).json({ message: "Error interno del servidor" })
    }
}

passRecov.resetPassword = async (req, res) => {
    const { password } = req.body

    // Agregar validación aquí
    if (!password || typeof password !== 'string') {
        return res.status(400).json({ message: 'La contraseña es requerida' })
    }

    try {
        const token = req.cookies.tokenRecoveryCode

        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token' })
        }

        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        if (!decoded.verified) {
            return res.status(401).json({ message: 'Código no verificado' })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        let userFound
        if (decoded.userType === 'employee') {
            userFound = await employeesModel.findOneAndUpdate(
                { email: decoded.email },
                { password: hashedPassword },
                { new: true }
            )
        } else if (decoded.userType === 'customer') {
            userFound = await customersModel.findOneAndUpdate(
                { email: decoded.email },
                { password: hashedPassword },
                { new: true }
            )
        }

        if (!userFound) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        res.clearCookie('tokenRecoveryCode')

        res.status(200).json({ message: 'Contraseña restablecida exitosamente' })

    } catch (error) {
        console.error("Error resetting password:", error)
        res.status(500).json({ message: "Error interno del servidor" })
    }
}

export default passRecov