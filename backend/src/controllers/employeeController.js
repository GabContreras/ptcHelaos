const employeesController = {};
// Importaciones necesarias
import employeesModel from "../models/Employee.js"
import customersModel from "../models/Customer.js"

import bcryptjs from "bcryptjs";

// CONTROLADOR PARA OBTENER TODOS LOS EMPLEADOS
employeesController.getEmployees = async (req, res) => {
    try {
        // Buscar todos los empleados en la base de datos
        const employees = await employeesModel.find()

        // Enviar respuesta exitosa con los empleados encontrados
        res.json(employees)
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: "Error fetching employees" })
    }
}

// NUEVO: CONTROLADOR PARA OBTENER UN EMPLEADO POR ID
employeesController.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Buscar el empleado por ID, excluyendo la contraseña por seguridad
        const employee = await employeesModel.findById(id).select('-password -loginAttempts -lockTime');
        
        if (!employee) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        
        // Enviar respuesta exitosa con el empleado encontrado
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        
        // Verificar si es un error de ID inválido
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de empleado inválido" });
        }
        
        // Manejar otros errores del servidor
        res.status(500).json({ message: "Error fetching employee" });
    }
}

// CONTROLADOR PARA INSERTAR UN NUEVO EMPLEADO
employeesController.insertEmployee = async (req, res) => {
    try {
        // Extraer datos del empleado del cuerpo de la petición
        const { name, email, phone, password, hireDate, salary, dui } = req.body;
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
    
        // ENCRIPTAR LA CONTRASEÑA CON BCRYPT
        // El número 10 es el nivel de salt (rounds de hashing)
        const passwordHash = await bcryptjs.hash(password, 10);

        // CREAR NUEVA INSTANCIA DEL MODELO DE EMPLEADO
        const newEmployee = new employeesModel({
            name,
            email,
            phone,
            password: passwordHash, // Guardar contraseña encriptada
            hireDate,
            salary,
            dui
        })

        // Guardar el nuevo empleado en la base de datos
        await newEmployee.save()

        // Enviar respuesta exitosa de creación
        res.status(201).json({ message: "Empleado guardado correctamente" })
    } catch (error) {
        // VERIFICAR SI EL ERROR ES POR CAMPO DUPLICADO (EMAIL O DUI)
        if (error.code === 11000) {
            // Obtener el campo que causó el conflicto
            const field = Object.keys(error.keyPattern)[0];
            // Generar mensaje específico según el campo duplicado
            const message = field === 'email' ? 'El email ya está registrado' : 'El DUI ya está registrado';
            res.status(400).json({ message })
        } else {
            // Manejar otros errores del servidor
            res.status(500).json({ message: "Error saving employee", error: error.message })
        }
    }
}

// CONTROLADOR PARA ELIMINAR UN EMPLEADO
employeesController.deleteEmployee = async (req, res) => {
    try {
        // Buscar y eliminar el empleado por su ID
        const deletedEmployee = await employeesModel.findByIdAndDelete(req.params.id);
        
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        // Enviar respuesta exitosa de eliminación
        res.json({ message: "Deleted successfully" })
    } catch (error) {
        console.error('Error deleting employee:', error);
        
        // Verificar si es un error de ID inválido
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de empleado inválido" });
        }
        
        // Manejar errores del servidor
        res.status(500).json({ message: "Error deleting employee" })
    }
}

// CONTROLADOR PARA ACTUALIZAR UN EMPLEADO EXISTENTE
employeesController.updateEmployee = async (req, res) => {
    try {
        // Extraer datos del empleado del cuerpo de la petición
        const { name, email, phone, password, hireDate, salary, dui } = req.body;

        // CREAR OBJETO DE ACTUALIZACIÓN SIN LA CONTRASEÑA INICIALMENTE
        // Esto permite actualizar datos sin cambiar la contraseña
        const updateData = { name, email, phone, hireDate, salary, dui };

        // VERIFICAR SI SE QUIERE ACTUALIZAR LA CONTRASEÑA
        // Solo hashear y incluir la contraseña si se proporciona y no está vacía
        if (password && password.trim() !== '') {
            // Encriptar la nueva contraseña
            updateData.password = await bcryptjs.hash(password, 10);
        }

        // ACTUALIZAR EL EMPLEADO EN LA BASE DE DATOS
        const updatedEmployee = await employeesModel.findByIdAndUpdate(
            req.params.id,    // ID del empleado a actualizar
            updateData,       // Datos a actualizar
            { new: true }     // Devolver el documento actualizado
        );

        // VERIFICAR SI EL EMPLEADO EXISTE
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        // Enviar respuesta exitosa de actualización con el empleado actualizado
        res.json({
            message: "Updated successfully",
            employee: updatedEmployee
        });
    } catch (error) {
        // LOG PARA DEPURACIÓN (DEBUG)
        console.error('Error actualizando empleado:', error);

        // Verificar si es un error de ID inválido
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de empleado inválido" });
        }

        // VERIFICAR SI EL ERROR ES POR CAMPO DUPLICADO (EMAIL O DUI)
        if (error.code === 11000) {
            // Obtener el campo que causó el conflicto
            const field = Object.keys(error.keyPattern)[0];
            // Generar mensaje específico según el campo duplicado
            const message = field === 'email' ? 'El email ya está registrado' : 'El DUI ya está registrado';
            res.status(400).json({ message });
        } else {
            // Manejar otros errores del servidor
            res.status(500).json({ message: "Error updating employee", error: error.message });
        }
    }
};

export default employeesController;