const customersController = {};
import customersModel from "../models/Customer.js"
import mongoose from "mongoose";

//SELECT
customersController.getCustomer = async (req, res) => {
   try {
       const customers = await customersModel.find()
       res.json(customers)
   } catch (error) {
       res.status(500).json({message: "Error fetching customers"})
   }
}

//INSERT
customersController.insertCustomer = async (req, res) => {
    try {
        const { name, phone, email, password, address, birthday, frequentCustomer } = req.body;
        const newCustomer = new customersModel({ 
            name, phone, email, password, address, birthday, frequentCustomer 
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
       res.json({message: "Deleted successfully"})
   } catch (error) {
       res.status(500).json({message: "Error deleting customer"})
   }
}

//UPDATE
customersController.updateCustomer = async (req, res) => {
   try {
       const { name, phone, email, password, address, birthday, frequentCustomer } = req.body;
       const updateCustomer = await customersModel.findByIdAndUpdate(req.params.id,
           { name, phone, email, password, address, birthday, frequentCustomer }, 
           {new: true}
       )
       res.json({message: "Updated successfully"})
   } catch (error) {
       if (error.code === 11000) {
           res.status(400).json({ message: "El email ya está registrado" })
       } else {
           res.status(500).json({message: "Error updating customer"})
       }
   }
}

export default customersController;