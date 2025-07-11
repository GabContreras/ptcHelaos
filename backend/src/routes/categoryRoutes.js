import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.route('/')
.get(categoryController.getCategory)
.post(categoryController.insertCategory);

router.route('/:id')
.delete(categoryController.deleteCategory)
.put(categoryController.updateCategory)

export default router;