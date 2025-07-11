import Order from '../models/OrderModel.js';

const orderCtrl = {};

// GET - Obtener todas las órdenes
orderCtrl.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId', 'name email phone')
            .populate('products.productId', 'name price')
            .populate('products.flavors.ingredientId', 'name')
            .populate('products.toppings.ingredientId', 'name')
            .populate('products.additions.ingredientId', 'name')
            .populate('reviewId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Obtener órdenes por cliente
orderCtrl.getOrdersByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const orders = await Order.find({ customerId })
            .populate('products.productId', 'name price')
            .populate('products.flavors.ingredientId', 'name')
            .populate('products.toppings.ingredientId', 'name')
            .populate('products.additions.ingredientId', 'name')
            .populate('reviewId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Obtener orden por ID
orderCtrl.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('products.productId', 'name price')
            .populate('products.flavors.ingredientId', 'name')
            .populate('products.toppings.ingredientId', 'name')
            .populate('products.additions.ingredientId', 'name')
            .populate('reviewId');
        
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET - Obtener órdenes por tipo
orderCtrl.getOrdersByType = async (req, res) => {
    try {
        const { type } = req.params;
        
        // Validar que el tipo sea válido
        if (!["delivery", "local"].includes(type)) {
            return res.status(400).json({
                message: 'Tipo no válido. Use: delivery o Local'
            });
        }

        const orders = await Order.find({ orderType: type })
            .populate('customerId', 'name email phone')
            .populate('products.productId', 'name price')
            .populate('products.flavors.ingredientId', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST - Crear nueva orden
orderCtrl.createOrder = async (req, res) => {
    try {
        const {
            customerId,
            customerName,
            customerPhone,
            products,
            totalAmount,
            paymentMethod,
            paymentStatus,
            orderStatus,
            orderType,
            deliveryAddress
        } = req.body;

        const { userType, user } = req.user; // Viene del middleware de autenticación

        // Validar que se proporcionen productos
        if (!products || products.length === 0) {
            return res.status(400).json({
                message: 'Se requiere al menos un producto'
            });
        }

        // Validar delivery address para delivery
        if (orderType === "delivery" && !deliveryAddress) {
            return res.status(400).json({
                message: 'Se requiere dirección de entrega para pedidos a domicilio'
            });
        }

        // Determinar employeeId
        let employeeId;
        if (userType === 'admin') {
            employeeId = 'admin';
        } else if (userType === 'employee') {
            employeeId = user;
        } else {
            employeeId = 'online'; // Venta en línea por customers
        }

        // Crear nueva orden
        const newOrder = new Order({
            customerId: customerId || null,
            customerName,
            customerPhone,
            employeeId,
            products,
            totalAmount,
            paymentMethod,
            paymentStatus,
            orderStatus,
            orderType,
            deliveryAddress
        });

        await newOrder.save();

        // Poblar para la respuesta
        await newOrder.populate('customerId', 'name email phone');
        await newOrder.populate('products.productId', 'name price');

        res.status(201).json({
            message: 'Orden creada exitosamente',
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT - Actualizar orden completa
orderCtrl.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            customerId,
            customerName,
            customerPhone,
            products,
            totalAmount,
            paymentMethod,
            paymentStatus,
            orderStatus,
            orderType,
            deliveryAddress
        } = req.body;

        // Validar delivery address para delivery
        if (orderType === "delivery" && !deliveryAddress) {
            return res.status(400).json({
                message: 'Se requiere dirección de entrega para pedidos a domicilio'
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                customerId,
                customerName,
                customerPhone,
                products,
                totalAmount,
                paymentMethod,
                paymentStatus,
                orderStatus,
                orderType,
                deliveryAddress
            },
            { new: true }
        )
        .populate('customerId', 'name email phone')
        .populate('products.productId', 'name price');

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json({
            message: 'Orden actualizada exitosamente',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT - Actualizar estado de orden
orderCtrl.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        // Validar estado
        const validStatuses = ["pendiente", "en preparación", "en camino", "entregado", "cancelado"];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: `Estado no válido. Use: ${validStatuses.join(', ')}`
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        )
        .populate('customerId', 'name email phone')
        .populate('products.productId', 'name price');

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json({
            message: 'Estado de orden actualizado exitosamente',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT - Actualizar estado de pago
orderCtrl.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        // Validar estado de pago
        const validPaymentStatuses = ["pagado", "pendiente", "rechazado","reembolsado","cancelado"];
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                message: `Estado de pago no válido. Use: ${validPaymentStatuses.join(', ')}`
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true }
        )
        .populate('customerId', 'name email phone')
        .populate('products.productId', 'name price');

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json({
            message: 'Estado de pago actualizado exitosamente',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT - Asignar reseña a orden
orderCtrl.assignReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewId } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { reviewId },
            { new: true }
        )
        .populate('reviewId');

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json({
            message: 'Reseña asignada exitosamente',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Eliminar orden
orderCtrl.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json({ message: 'Orden eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default orderCtrl;