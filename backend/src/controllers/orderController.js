// Importación del modelo de órdenes
import Order from '../models/OrderModel.js';

const orderCtrl = {};

// CONTROLADOR PARA OBTENER TODAS LAS ÓRDENES
orderCtrl.getAllOrders = async (req, res) => {
    try {
        // Buscar todas las órdenes con populate completo y ordenadas por fecha de creación
        const orders = await Order.find()
            .populate('customerId', 'name email phone')              // Información del cliente
            .populate('products.productId', 'name price')            // Información básica del producto
            .populate('products.flavors.ingredientId', 'name')       // Sabores de los productos
            .populate('products.toppings.ingredientId', 'name')      // Toppings/coberturas
            .populate('products.additions.ingredientId', 'name')     // Adiciones extra
            .populate('reviewId')                                    // Reseña asociada
            .sort({ createdAt: -1 });                               // Ordenar por más recientes primero

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA OBTENER ÓRDENES POR CLIENTE ESPECÍFICO
orderCtrl.getOrdersByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Buscar órdenes filtradas por cliente específico
        const orders = await Order.find({ customerId })
            .populate('products.productId', 'name price')
            .populate('products.flavors.ingredientId', 'name')
            .populate('products.toppings.ingredientId', 'name')
            .populate('products.additions.ingredientId', 'name')
            .populate('reviewId')
            .sort({ createdAt: -1 });                               // Más recientes primero

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA OBTENER UNA ORDEN ESPECÍFICA POR ID
orderCtrl.getOrderById = async (req, res) => {
    try {
        // Buscar orden por ID con populate completo
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('products.productId', 'name price')
            .populate('products.flavors.ingredientId', 'name')
            .populate('products.toppings.ingredientId', 'name')
            .populate('products.additions.ingredientId', 'name')
            .populate('reviewId');

        // Verificar si la orden existe
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA OBTENER ÓRDENES POR TIPO (DELIVERY O LOCAL)
orderCtrl.getOrdersByType = async (req, res) => {
    try {
        const { type } = req.params;

        // VALIDAR QUE EL TIPO SEA VÁLIDO
        if (!["delivery", "local"].includes(type)) {
            return res.status(400).json({
                message: 'Tipo no válido. Use: delivery o Local'
            });
        }

        // Buscar órdenes filtradas por tipo
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

// CONTROLADOR PARA CREAR UNA NUEVA ORDEN
orderCtrl.createOrder = async (req, res) => {
    try {
        // Extraer datos de la orden del cuerpo de la petición
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

        // Obtener información del usuario autenticado
        const { userType, user } = req.user;

        // VALIDAR QUE SE PROPORCIONEN PRODUCTOS
        if (!products || products.length === 0) {
            return res.status(400).json({
                message: 'Se requiere al menos un producto'
            });
        }

        // VALIDAR DIRECCIÓN DE ENTREGA PARA DELIVERY
        if (orderType === "delivery" && !deliveryAddress) {
            return res.status(400).json({
                message: 'Se requiere dirección de entrega para pedidos a domicilio'
            });
        }

        // DETERMINAR EMPLOYEEID SEGÚN EL TIPO DE USUARIO
        let employeeId;
        if (userType === 'admin') {
            employeeId = 'admin';           // Administrador
        } else if (userType === 'employee') {
            employeeId = user;              // Empleado específico
        } else {
            employeeId = 'online';          // Venta en línea por clientes
        }

        // CREAR NUEVA ORDEN
        const newOrder = new Order({
            customerId: customerId || null,  // Puede ser null para clientes no registrados
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

        // Guardar la orden en la base de datos
        await newOrder.save();

        // POBLAR DATOS PARA LA RESPUESTA
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

// CONTROLADOR PARA ACTUALIZAR UNA ORDEN COMPLETA
orderCtrl.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        // Extraer todos los campos a actualizar
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

        // VALIDAR DIRECCIÓN DE ENTREGA PARA DELIVERY
        if (orderType === "delivery" && !deliveryAddress) {
            return res.status(400).json({
                message: 'Se requiere dirección de entrega para pedidos a domicilio'
            });
        }

        // ACTUALIZAR LA ORDEN CON TODOS LOS CAMPOS
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
            { new: true }                    // Devolver el documento actualizado
        )
            .populate('customerId', 'name email phone')
            .populate('products.productId', 'name price');

        // Verificar si la orden existe
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

// CONTROLADOR PARA ACTUALIZAR SOLO EL ESTADO DE LA ORDEN
orderCtrl.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        // VALIDAR QUE EL ESTADO SEA VÁLIDO
        const validStatuses = ["pendiente", "en preparación", "en camino", "entregado", "cancelado"];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: `Estado no válido. Use: ${validStatuses.join(', ')}`
            });
        }

        // ACTUALIZAR SOLO EL ESTADO DE LA ORDEN
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        )
            .populate('customerId', 'name email phone')
            .populate('products.productId', 'name price');

        // Verificar si la orden existe
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

// CONTROLADOR PARA ACTUALIZAR SOLO EL ESTADO DE PAGO
orderCtrl.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        // VALIDAR QUE EL ESTADO DE PAGO SEA VÁLIDO
        const validPaymentStatuses = ["pagado", "pendiente", "rechazado", "reembolsado", "cancelado"];
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                message: `Estado de pago no válido. Use: ${validPaymentStatuses.join(', ')}`
            });
        }

        // ACTUALIZAR SOLO EL ESTADO DE PAGO
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true }
        )
            .populate('customerId', 'name email phone')
            .populate('products.productId', 'name price');

        // Verificar si la orden existe
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

// CONTROLADOR PARA ASIGNAR UNA RESEÑA A UNA ORDEN
orderCtrl.assignReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewId } = req.body;

        // ACTUALIZAR LA ORDEN CON LA RESEÑA ASIGNADA
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { reviewId },
            { new: true }
        )
            .populate('reviewId');               // Popular la reseña completa

        // Verificar si la orden existe
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

// CONTROLADOR PARA ELIMINAR UNA ORDEN
orderCtrl.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar y eliminar la orden por ID
        const deletedOrder = await Order.findByIdAndDelete(id);

        // Verificar si la orden existía
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json({ message: 'Orden eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default orderCtrl;