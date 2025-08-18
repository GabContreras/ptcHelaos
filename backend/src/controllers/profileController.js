const profileController = {};
import customersModel from "../models/Customer.js"

profileController.getCustomerById = async (req, res) => {
    try {
        // Buscar un cliente por su ID
        const customer = await customersModel.findById(req.params.id)
        if (!customer) {
            return res.status(404).json({ message: "Cliente no encontrado" })
        }
        res.json(customer);
    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({ message: "Error fetching customer", error })
    }
}

export default profileController;