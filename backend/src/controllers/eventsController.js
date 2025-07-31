const eventsController = {};
import eventsModel from "../models/Events.js"
import mongoose from "mongoose";

// CONTROLADOR PARA OBTENER TODAS LAS CATEGORÍAS
eventsController.getEvent = async (req, res) => {
    try {
        // Buscar todas las categorías en la base de datos
        const categories = await eventsModel.find()
        
        // Enviar respuesta exitosa con las categorías encontradas
        res.json(categories)
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: "Error fetching event" })
    }
}

// CONTROLADOR PARA INSERTAR UNA NUEVA CATEGORÍA
eventsController.insertEvent = async (req, res) => {
    try {
        // Extraer el nombre de la categoría del cuerpo de la petición
        const { name, date, address, type, isActive } = req.body;
        
        // Crear nueva instancia del modelo de categoría
        const newCategory = new eventsModel({ name, date, address, type, isActive })
        
        // Guardar la nueva categoría en la base de datos
        await newCategory.save()
        
        // Enviar respuesta exitosa de creación
        res.status(201).json({ message: "Evento guardado correctamente" })
    } catch (error) {
        // Verificar si el error es por duplicado (código 11000 de MongoDB)
        if (error.code === 11000) {
            res.status(400).json({ message: "El evento ya existe" })
        } else {
            // Manejar otros errores del servidor
            res.status(500).json({ message: "Error saving category", error: error.message })
        }
    }
}

// CONTROLADOR PARA ELIMINAR UNA CATEGORÍA
eventsController.deleteEvent = async (req, res) => {
    try {
        // Buscar y eliminar la categoría por su ID
        await eventsModel.findByIdAndDelete(req.params.id)
        
        // Enviar respuesta exitosa de eliminación
        res.json({ message: "Deleted successfully" })
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: "Error deleting event" })
    }
}

// CONTROLADOR PARA ACTUALIZAR UNA CATEGORÍA EXISTENTE
eventsController.updateEvent = async (req, res) => {
    try {
        // Extraer el nuevo nombre de la categoría del cuerpo de la petición
        const { name, date, address, type, isActive } = req.body;
        47
        // Buscar y actualizar la categoría por su ID
        // new: true devuelve el documento actualizado
        const updateCategory = await eventsModel.findByIdAndUpdate(req.params.id,
            { name, date, address, type, isActive }, { new: true }
        )
        
        // Enviar respuesta exitosa de actualización
        res.json({ message: "Updated successfully" })
    } catch (error) {
        // Verificar si el error es por duplicado (código 11000 de MongoDB)
        if (error.code === 11000) {
            res.status(400).json({ message: "El evento ya existe" })
        } else {
            // Manejar otros errores del servidor
            res.status(500).json({ message: "Error updating event" })
        }
    }
}

export default eventsController;