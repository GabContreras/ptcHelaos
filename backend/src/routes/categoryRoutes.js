import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { validateAuthToken } from '../middlewares/validateAuthToken.js';
const router = express.Router();

router.route('/')
.get(validateAuthToken(['admin', 'employee']), categoryController.getCategory)
.post(validateAuthToken(['admin', 'employee']),categoryController.insertCategory);

router.route('/:id')
.delete(validateAuthToken(['admin', 'employee']),categoryController.deleteCategory)
.put(validateAuthToken(['admin', 'employee']),categoryController.updateCategory)


export default router;