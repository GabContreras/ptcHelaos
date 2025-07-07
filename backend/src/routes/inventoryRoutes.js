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
    //GET localhost:3333/api/inventory/12345
    .get(inventoryCtrl.getInventoryById)
    //Ruta para editar información de un inventario en específico
    //PUT localhost:3333/api/inventory/12345
    .put(inventoryCtrl.updateInventory)
    //Ruta para eliminar un inventario en específico
    //DELETE localhost:3333/api/inventory/12345
    .delete(inventoryCtrl.deleteInventory);

// Rutas para lotes

//Ruta para crear un lote en un inventario en específico
// POST localhost:3333/api/inventory/:id/batch
router.route('/:id/batch')
    .post(inventoryCtrl.createBatch);

// Ruta para operaciones en lotes específicos (entradas, salidas, etc)
// PUT localhost:3333/api/inventory/batch/12345/operation
router.route('/batch/:batchId/operation')
    .put(inventoryCtrl.batchOperation);

//Ruta para ver movimientos en lotes específicos
// GET localhost:3333/api/inventory/batch/12345/movements
router.route('/batch/:batchId/movements')
    .get(inventoryCtrl.getBatchMovements);

//Ruta para borrar lotes específicos (siempre y cuando no estén en uso ni tengan productos)
// DELETE localhost:3333/api/inventory/batch/12345
router.route('/batch/:batchId')
    .delete(inventoryCtrl.deleteBatch);
export default router;