import express from 'express';
import orderCtrl from '../controllers/orderController.js';
import { validateAuthToken } from '../middlewares/validateAuthToken.js';

const router = express.Router();

// Rutas para órdenes
router.route('/')
    //Ruta para ver todas las órdenes existentes (solo admin y empleados)
    // GET localhost:3333/api/orders
    .get(validateAuthToken(['admin', 'employee']), orderCtrl.getAllOrders)
    
    //Ruta para crear una nueva orden
    // POST localhost:3333/api/orders
    .post(validateAuthToken(['admin', 'employee', 'customer']), orderCtrl.createOrder);

router.route('/:id')
    //Ruta para ver información de una orden en específico
    // GET localhost:3333/api/orders/12345
    .get(validateAuthToken(['admin', 'employee', 'customer']), orderCtrl.getOrderById)
    
    //Ruta para editar información completa de una orden en específico
    // PUT localhost:3333/api/orders/12345
    .put(validateAuthToken(['admin', 'employee']), orderCtrl.updateOrder)
    
    //Ruta para eliminar una orden en específico
    // DELETE localhost:3333/api/orders/12345
    .delete(validateAuthToken(['admin']), orderCtrl.deleteOrder);

// Rutas específicas de filtrado

//Ruta para ver todas las órdenes de un cliente específico
// GET localhost:3333/api/orders/customer/12345
router.get('/customer/:customerId', 
    validateAuthToken(['admin', 'employee', 'customer']), 
    orderCtrl.getOrdersByCustomer
);

//Ruta para ver órdenes por tipo (delivery o Local)
// GET localhost:3333/api/orders/type/delivery
// GET localhost:3333/api/orders/type/Local
router.get('/type/:type', 
    validateAuthToken(['admin', 'employee']), 
    orderCtrl.getOrdersByType
);

// Rutas de actualización específica

//Ruta para actualizar solo el estado de una orden
// PUT localhost:3333/api/orders/12345/status
router.put('/:id/status', 
    validateAuthToken(['admin', 'employee']), 
    orderCtrl.updateOrderStatus
);

//Ruta para actualizar solo el estado de pago de una orden
// PUT localhost:3333/api/orders/12345/payment
router.put('/:id/payment', 
    validateAuthToken(['admin', 'employee']), 
    orderCtrl.updatePaymentStatus
);

//Ruta para asignar una reseña a una orden
// PUT localhost:3333/api/orders/12345/review
router.put('/:id/review', 
    validateAuthToken(['admin', 'employee', 'customer']), 
    orderCtrl.assignReview
);

export default router;