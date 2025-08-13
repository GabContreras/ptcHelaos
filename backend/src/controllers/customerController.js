const customersController = {};
// Importaciones necesarias
import customersModel from "../models/Customer.js"
import employeesModel from "../models/Employee.js"
import bcryptjs from 'bcryptjs'

// CONTROLADOR PARA OBTENER TODOS LOS CLIENTES
customersController.getCustomer = async (req, res) => {
    try {
        // Buscar todos los clientes en la base de datos
        const customers = await customersModel.find()

        // Enviar respuesta exitosa con los clientes encontrados
        res.json(customers)
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: "Error fetching customers" })
    }
}

// CONTROLADOR PARA INSERTAR UN NUEVO CLIENTE
customersController.insertCustomer = async (req, res) => {
    try {
        // Extraer datos del cliente del cuerpo de la petición
        const { name, phone, email, password, birthday, frequentCustomer } = req.body;
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
        
        // VALIDAR QUE LA CONTRASEÑA SEA OBLIGATORIA PARA INSERCIÓN
        if (!password) {
            return res.status(400).json({ message: "La contraseña es obligatoria" });
        }

        // ENCRIPTAR LA CONTRASEÑA CON BCRYPT
        // El número 10 es el nivel de salt (rounds de hashing)
        const passwordHash = await bcryptjs.hash(password, 10);

        // CREAR NUEVA INSTANCIA DEL MODELO DE CLIENTE
        const newCustomer = new customersModel({
            name,
            phone,
            email,
            password: passwordHash, // Guardar contraseña encriptada
            birthday,
            frequentCustomer
        })

        // Guardar el nuevo cliente en la base de datos
        await newCustomer.save()

        // Enviar respuesta exitosa de creación
        res.status(201).json({ message: "Cliente guardado correctamente" })
    } catch (error) {
        // VERIFICAR SI EL ERROR ES POR EMAIL DUPLICADO
        if (error.code === 11000) {
            res.status(400).json({ message: "El email ya está registrado" })
        } else {
            // Manejar otros errores del servidor
            res.status(500).json({ message: "Error saving customer", error: error.message })
        }
    }
}

// CONTROLADOR PARA ELIMINAR UN CLIENTE
customersController.deleteCustomer = async (req, res) => {
    try {
        // Buscar y eliminar el cliente por su ID
        await customersModel.findByIdAndDelete(req.params.id)

        // Enviar respuesta exitosa de eliminación
        res.json({ message: "Deleted successfully" })
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: "Error deleting customer" })
    }
}

// CONTROLADOR PARA ACTUALIZAR UN CLIENTE EXISTENTE
customersController.updateCustomer = async (req, res) => {
    try {
        // Extraer datos del cliente del cuerpo de la petición
        const { name, phone, email, password, birthday, frequentCustomer } = req.body;

        // CREAR OBJETO DE ACTUALIZACIÓN SIN LA CONTRASEÑA INICIALMENTE
        // Esto permite actualizar datos sin cambiar la contraseña
        const updateData = { name, phone, email, birthday, frequentCustomer };

        // VERIFICAR SI SE QUIERE ACTUALIZAR LA CONTRASEÑA
        // Solo hashear y incluir la contraseña si se proporciona y no está vacía
        if (password && password.trim() !== '') {
            // Encriptar la nueva contraseña
            const passwordHash = await bcryptjs.hash(password, 10);
            updateData.password = passwordHash;
        }

        // ACTUALIZAR EL CLIENTE EN LA BASE DE DATOS
        const updateCustomer = await customersModel.findByIdAndUpdate(
            req.params.id,    // ID del cliente a actualizar
            updateData,       // Datos a actualizar
            { new: true }     // Devolver el documento actualizado
        )

        // VERIFICAR SI EL CLIENTE EXISTE
        if (!updateCustomer) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        // Enviar respuesta exitosa de actualización
        res.json({ message: "Updated successfully" })
    } catch (error) {
        // VERIFICAR SI EL ERROR ES POR EMAIL DUPLICADO
        if (error.code === 11000) {
            res.status(400).json({ message: "El email ya está registrado" })
        } else {
            // Manejar otros errores del servidor
            res.status(500).json({ message: "Error updating customer", error: error.message })
        }
    }
}

export default customersController;