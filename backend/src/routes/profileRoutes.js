import express from 'express';
import profileController from '../controllers/profileController.js';

const router = express.Router();

router.route('/:id')
.get(profileController.getCustomerById)
.put(profileController.updateCustomer);

export default router;