const employeesController = {};
import employeesModel from "../models/Employee.js"
import mongoose from "mongoose";

//SELECT
employeesController.getEmployees = async (req, res) => {
    try {
        const employees = await employeesModel.find()
        res.json(employees)
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees" })
    }
}

//INSERT
employeesController.insertEmployee = async (req, res) => {
    try {
        const { name, email, phone, password, hireDate, salary, dui } = req.body;
        const passwordHash = await bcryptjs.hash(password, 10);

        const newEmployee = new employeesModel({
            name, email, phone, password: passwordHash, hireDate, salary, dui
        })
        await newEmployee.save()
        res.status(201).json({ message: "Empleado guardado correctamente" })
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const message = field === 'email' ? 'El email ya está registrado' : 'El DUI ya está registrado';
            res.status(400).json({ message })
        } else {
            res.status(500).json({ message: "Error saving employee", error: error.message })
        }
    }
}

//DELETE
employeesController.deleteEmployee = async (req, res) => {
    try {
        await employeesModel.findByIdAndDelete(req.params.id)
        res.json({ message: "Deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee" })
    }
}

//UPDATE
employeesController.updateEmployee = async (req, res) => {
    try {
        const { name, email, phone, password, hireDate, salary, dui } = req.body;
        const passwordHash = await bcryptjs.hash(password, 10);

        const updateEmployee = await employeesModel.findByIdAndUpdate(req.params.id,
            { name, email, phone, password: passwordHash, hireDate, salary, dui },
            { new: true }
        )
        res.json({ message: "Updated successfully" })
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const message = field === 'email' ? 'El email ya está registrado' : 'El DUI ya está registrado';
            res.status(400).json({ message })
        } else {
            res.status(500).json({ message: "Error updating employee" })
        }
    }
}

export default employeesController;