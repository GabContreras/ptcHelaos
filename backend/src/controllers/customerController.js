const customersController = {};
import customersModel from "../models/Customer.js"
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'

//SELECT
customersController.getCustomer = async (req, res) => {
    try {
        const customers = await customersModel.find()
        res.json(customers)
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers" })
    }
}

//INSERT
customersController.insertCustomer = async (req, res) => {
    try {
        const { name, phone, email, password, birthday, frequentCustomer } = req.body;
        
        // Para inserción, la contraseña es obligatoria
        if (!password) {
            return res.status(400).json({ message: "La contraseña es obligatoria" });
        }
        
        const passwordHash = await bcryptjs.hash(password, 10);

        const newCustomer = new customersModel({
            name, phone, email, password: passwordHash, birthday, frequentCustomer
        })
        await newCustomer.save()
        res.status(201).json({ message: "Cliente guardado correctamente" })
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "El email ya está registrado" })
        } else {
            res.status(500).json({ message: "Error saving customer", error: error.message })
        }
    }
}

//DELETE
customersController.deleteCustomer = async (req, res) => {
    try {
        await customersModel.findByIdAndDelete(req.params.id)
        res.json({ message: "Deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer" })
    }
}

//UPDATE
customersController.updateCustomer = async (req, res) => {
    try {
        const { name, phone, email, password, birthday, frequentCustomer } = req.body;
        
        // Crear objeto de actualización sin la contraseña inicialmente
        const updateData = { name, phone, email, birthday, frequentCustomer };
        
        // Solo hashear y incluir la contraseña si se proporciona
        if (password && password.trim() !== '') {
            const passwordHash = await bcryptjs.hash(password, 10);
            updateData.password = passwordHash;
        }

        const updateCustomer = await customersModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
        
        if (!updateCustomer) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        
        res.json({ message: "Updated successfully" })
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "El email ya está registrado" })
        } else {
            res.status(500).json({ message: "Error updating customer", error: error.message })
        }
    }
}

export default customersController;