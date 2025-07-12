import express from 'express';
import pettyCashController from '../controllers/pettyCashController.js';

const router = express.Router();

// Obtener todos los movimientos de caja chica
router.route("/")
    .get(pettyCashController.getAllMovements)
    // Crear una nueva operación de caja chica (ingreso/egreso)
    .post(pettyCashController.cashOperation)
// Obtener el balance actual de caja chica
router.get('/balance', pettyCashController.getCurrentBalance)



export default router;