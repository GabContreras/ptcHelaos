const categoryController = {};
import categoryModel from "../models/Category.js"
import mongoose from "mongoose";

// CONTROLADOR PARA OBTENER TODAS LAS CATEGORÍAS
categoryController.getCategory = async (req, res) => {
    try {
        // Buscar todas las categorías en la base de datos
        const categories = await categoryModel.find()
        
        // Enviar respuesta exitosa con las categorías encontradas
        res.json(categories)
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: "Error fetching categories" })
    }
}

// CONTROLADOR PARA INSERTAR UNA NUEVA CATEGORÍA
categoryController.insertCategory = async (req, res) => {
    try {
        // Extraer el nombre de la categoría del cuerpo de la petición
        const { name } = req.body;
        
        // Crear nueva instancia del modelo de categoría
        const newCategory = new categoryModel({ name })
        
        // Guardar la nueva categoría en la base de datos
        await newCategory.save()
        
        // Enviar respuesta exitosa de creación
        res.status(201).json({ message: "Categoría guardada correctamente" })
    } catch (error) {
        // Verificar si el error es por duplicado (código 11000 de MongoDB)
        if (error.code === 11000) {
            res.status(400).json({ message: "La categoría ya existe" })
        } else {
            // Manejar otros errores del servidor
            res.status(500).json({ message: "Error saving category", error: error.message })
        }
    }
}

// CONTROLADOR PARA ELIMINAR UNA CATEGORÍA
categoryController.deleteCategory = async (req, res) => {
    try {
        // Buscar y eliminar la categoría por su ID
        await categoryModel.findByIdAndDelete(req.params.id)
        
        // Enviar respuesta exitosa de eliminación
        res.json({ message: "Deleted successfully" })
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: "Error deleting category" })
    }
}

// CONTROLADOR PARA ACTUALIZAR UNA CATEGORÍA EXISTENTE
categoryController.updateCategory = async (req, res) => {
    try {
        // Extraer el nuevo nombre de la categoría del cuerpo de la petición
        const { name } = req.body;
        
        // Buscar y actualizar la categoría por su ID
        // new: true devuelve el documento actualizado
        const updateCategory = await categoryModel.findByIdAndUpdate(req.params.id,
            { name }, { new: true }
        )
        
        // Enviar respuesta exitosa de actualización
        res.json({ message: "Updated successfully" })
    } catch (error) {
        // Verificar si el error es por duplicado (código 11000 de MongoDB)
        if (error.code === 11000) {
            res.status(400).json({ message: "La categoría ya existe" })
        } else {
            // Manejar otros errores del servidor
            res.status(500).json({ message: "Error updating category" })
        }
    }
}

export default categoryController;