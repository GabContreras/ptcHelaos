import customersModel from '../models/Customer.js'
import employeesModel from '../models/Employee.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import crypto from 'crypto'
import sendVerificationEmail from '../utils/verificationCode.js'

const register = {}

register.registerCustomer = async (req, res) => {
    const { name, phone, email, password, address, birthday, frequentCustomer } = req.body
    try {
        // Verifica si ya existe el email
        const existingCustomer = await customersModel.findOne({ email })
        if (existingCustomer) {
            return res.status(400).json({ message: 'El email ya está registrado' })
        }
        // Verificar si el email ya existe en la tabla de empleados
        const existingEmployee = await employeesModel.findOne({ email })
        if (existingEmployee) {
            return res.status(400).json({
                message: 'El email ya está registrado'
            })
        }
        const passwordHash = await bcryptjs.hash(password, 10)

        // Validar fecha de cumpleaños
        const parsedBirthday = new Date(birthday);
        if (isNaN(parsedBirthday)) {
            return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
        }
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'El formato del correo electrónico no es válido'
            })
        }

        const newCustomer = new customersModel({
            name,
            phone,
            email,
            password: passwordHash,
            address,
            birthday: parsedBirthday,
            frequentCustomer: frequentCustomer || false,
            isVerified: false
        })

        await newCustomer.save()

        const verificationCode = crypto.randomBytes(2).toString('hex')

        const token = jwt.sign({ email, verificationCode }, config.JWT.secret, { expiresIn: '2h' })
        res.cookie('verificationCode', token, {
            httpOnly: true,
            sameSite: "None", // o "Lax" si es mismo dominio
            secure: true,    // solo si usas HTTPS
            maxAge: 2 * 60 * 60 * 1000
        })

        await sendVerificationEmail(email, verificationCode)

        return res.status(201).json({ message: 'Se ha registrado correctamente, revise tu correo electrónico para verificar tu cuenta.' })

    } catch (error) {
        console.log('Error registering customer:', error)
        res.status(500).json({ message: error.message })
    }
}

register.verificationCode = async (req, res) => {
    const { code } = req.body
    const token = req.cookies.verificationCode

    if (!token) {
        return res.status(400).json({ message: "Token de verificación no encontrado" })
    }

    try {
        const decoded = jwt.verify(token, config.JWT.secret)
        const { email, verificationCode: storedCode } = decoded

        if (!email || !storedCode) {
            return res.status(400).json({ message: "Token inválido o faltan campos requeridos" })
        }

        if (code !== storedCode) {
            return res.status(401).json({ message: "Código de verificación inválido" })
        }

        const customer = await customersModel.findOne({ email })
        if (!customer) {
            return res.status(404).json({ message: `Cliente con email ${email} no encontrado` })
        }

        customer.isVerified = true
        await customer.save()

        res.clearCookie("verificationCode")
        return res.status(200).json({ message: "Email verificado exitosamente" })

    } catch (error) {
        console.error("Error verifying code:", error)
        return res.status(500).json({ message: "Error verificando código", error: error.message })
    }
}
export default register