import express from 'express';
import employeesController from '../controllers/employeeController.js';

const router = express.Router();

router.route('/')
.get(employeesController.getEmployees)
.post(employeesController.insertEmployee);

router.route('/:id')
.get(employeesController.getEmployeeById)    
.delete(employeesController.deleteEmployee)
.put(employeesController.updateEmployee)

export default router;