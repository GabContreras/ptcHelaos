import express from 'express';
import pettyCashCtrl from '../controllers/pettyCashController.js';

const router = express.Router();

// Obtener todos los movimientos de caja chica
router.get('/', pettyCashCtrl.getAllMovements);

// Obtener el balance actual de caja chica
router.get('/balance', pettyCashCtrl.getCurrentBalance);

// Crear una nueva operación de caja chica (ingreso/egreso)
router.post('/', pettyCashCtrl.cashOperation);

export default router;