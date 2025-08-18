import express from 'express';
import customersController from '../controllers/customerController.js';

const router = express.Router();

router.route('/')
.get(customersController.getCustomer)
.post(customersController.insertCustomer);

router.route('/:id')
.get(customersController.getCustomerById)
.delete(customersController.deleteCustomer)
.put(customersController.updateCustomer)

export default router;