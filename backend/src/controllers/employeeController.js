const employeesController = {};
// Importaciones necesarias
import employeesModel from "../models/Employee.js"
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

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

// CONTROLADOR PARA INSERTAR UN NUEVO EMPLEADO
employeesController.insertEmployee = async (req, res) => {
    try {
        // Extraer datos del empleado del cuerpo de la petición
        const { name, email, phone, password, hireDate, salary, dui } = req.body;
        
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
        await employeesModel.findByIdAndDelete(req.params.id)
        
        // Enviar respuesta exitosa de eliminación
        res.json({ message: "Deleted successfully" })
    } catch (error) {
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