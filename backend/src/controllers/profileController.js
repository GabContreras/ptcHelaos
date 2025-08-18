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

profileController.updateCustomer = async (req, res) => {
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
        res.json({ message: "Updated successfully", customer: updateCustomer })
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

export default profileController;