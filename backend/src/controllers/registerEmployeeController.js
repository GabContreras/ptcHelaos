import employeesModel from '../models/Employee.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import { config } from '../config.js'

const register = {}

cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
})

register.registerEmployee = async (req, res) => {
    const { name, email, phone, password, hireDate, salary, dui } = req.body;
    let imgUrl = "";
    try {
        const existingEmployee = await employeesModel.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }

        // Verificar DUI único
        const existingDui = await employeesModel.findOne({ dui });
        if (existingDui) {
            return res.status(400).json({ message: 'El DUI ya está registrado' });
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'public', allowed_formats: ['jpg', 'png', 'jpeg'] });
            imgUrl = result.secure_url;
        }
        const passwordHash = await bcryptjs.hash(password, 10);

        // Validar fecha de contratación
        const parsedHireDate = new Date(hireDate);
        if (isNaN(parsedHireDate)) {
            return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
        }

        const newEmployee = new employeesModel({
            name,
            email,
            phone,
            password: passwordHash,
            hireDate: parsedHireDate,
            salary,
            dui,
            image: imgUrl
        });
        await newEmployee.save();

        jwt.sign(
            { id: newEmployee._id },
            config.JWT.secret,
            { expiresIn: config.JWT.expiresIn },
            (error, token) => {
                if (error) {
                    return res.status(500).json({ message: 'Error generando el token' });
                }
                res.cookie('authToken', token);
                res.status(201).json({ message: 'Empleado registrado exitosamente' });
            }
        );
    } catch (error) {
        console.error('Error registering employee', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const message = field === 'email' ? 'El email ya está registrado' : 'El DUI ya está registrado';
            res.status(400).json({ message })
        } else {
            res.status(500).json({ message: 'Error registrando empleado' });
        }
    }
}

export default register