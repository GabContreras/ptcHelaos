import express from 'express';
import customersController from '../controllers/customerController.js';
import { validateAuthToken } from '../middlewares/validateAuthToken.js';

const router = express.Router();

router.route('/')
.get(validateAuthToken(['admin', 'employee']),customersController.getCustomer)
.post(validateAuthToken(['admin', 'employee']),customersController.insertCustomer);

router.route('/:id')
.get(customersController.getCustomerById)
.delete(validateAuthToken(['admin', 'employee']),customersController.deleteCustomer)
.put(validateAuthToken(['admin', 'employee','customer']),customersController.updateCustomer)

export default router;  