import express from 'express';
import multer from 'multer';
import productController from '../controllers/productController.js';
import { validateAuthToken } from '../middlewares/validateAuthToken.js';

const router = express.Router();

// Configuración de multer para múltiples archivos
const upload = multer({
    dest: 'public/'
});

// Rutas para filtrar productos disponibles
router.route('/available')
    .get(productController.getAvailableProducts);

// Ruta para obtener productos por categoría
//GET localhost:3333/api/products/category/12345
router.route('/category/:categoryId')
    .get(productController.getProductsByCategory);


router.route('/')
    // Ruta para obtener todos los productos 
    .get(productController.getAllProducts)
    // Ruta para crear un nuevo producto
    .post(validateAuthToken(['admin', 'employee']), upload.array('images'), productController.createProduct);

router.route('/:id')
    // Ruta para obtener un producto por ID
    .get(productController.getProductById)
    // Ruta para actualizar un producto por ID
    //PUT localhost:3333/api/products/12345
    .put(validateAuthToken(['admin', 'employee']), upload.array('images'), productController.updateProduct)
    // Ruta para eliminar un producto por ID
    //DELETE localhost:3333/api/products/12345
    .delete(validateAuthToken(['admin', 'employee']), productController.deleteProduct);

export default router;