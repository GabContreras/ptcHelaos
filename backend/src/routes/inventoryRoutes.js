import express from 'express';
import inventoryCtrl from '../controllers/inventoryController.js';

const router = express.Router();

// Rutas para inventarios
router.route('/')
//Ruta para ver todos los inventarios existentes
    .get(inventoryCtrl.getInventory)

//Ruta para crear un inventario nuevo (sin lotes inicialmente)
    .post(inventoryCtrl.createInventory);

// routes/inventoryRoutes.js
router.route('/batch')
//Ruta para ver todos los lotes existentes
    .get(inventoryCtrl.getAllBatches);

router.route('/:id')
//Ruta para ver información de un inventario en específico
    .get(inventoryCtrl.getInventoryById)
    //Ruta para editar información de un inventario en específico
    .put(inventoryCtrl.updateInventory)
    //Ruta para eliminar un inventario en específico
    .delete(inventoryCtrl.deleteInventory);

// Rutas para lotes

//Ruta para crear un lote en un inventario en específico
// (/inventory/inventoryId/batch)
router.route('/:id/batch')
    .post(inventoryCtrl.createBatch);


// Ruta para operaciones en lotes específicos (entradas, salidas, etc)
router.route('/batch/:batchId/operation')
    .put(inventoryCtrl.batchOperation);

//Ruta para ver movimientos en lotes específicos
router.route('/batch/:batchId/movements')
    .get(inventoryCtrl.getBatchMovements);

//Ruta para borrar lotes específicos (siempre y cuando no estén en uso ni tengan productos)
router.route('/batch/:batchId')
    .delete(inventoryCtrl.deleteBatch);
export default router;