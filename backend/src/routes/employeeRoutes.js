import express from 'express';
import employeesController from '../controllers/employeeController.js';
import { validateAuthToken } from '../middlewares/validateAuthToken.js';

const router = express.Router();

router.route('/')
.get(validateAuthToken(['admin']),employeesController.getEmployees)
.post(validateAuthToken(['admin']),employeesController.insertEmployee);

router.route('/:id')
.get(employeesController.getEmployeeById)    
.delete(validateAuthToken(['admin']),employeesController.deleteEmployee)
.put(validateAuthToken(['admin','employee']),employeesController.updateEmployee)

export default router;