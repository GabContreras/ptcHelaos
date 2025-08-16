// productController.js
import Product from '../models/Product.js'; // Ajusta según tu modelo

const productController = {};

// CONTROLADOR PARA OBTENER TODOS LOS PRODUCTOS DISPONIBLES
productController.getAvailableProducts = async (req, res) => {
    try {
        console.log('Obteniendo productos disponibles...');
        
        // Buscar productos disponibles SIN populate para evitar objetos complejos
        const products = await Product.find({ available: true })
            .select('name description basePrice preparationTime images categoryId available')
            .lean(); // lean() para obtener objetos JavaScript planos, no objetos de Mongoose
        
        console.log(`Productos encontrados: ${products.length}`);
        
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ 
            message: 'Error al obtener productos disponibles',
            error: error.message 
        });
    }
};

// CONTROLADOR PARA OBTENER TODOS LOS PRODUCTOS (CON POPULATE PARA ADMIN)
productController.getAllProducts = async (req, res) => {
    try {
        console.log('Obteniendo todos los productos...');
        
        // Para administración, SÍ incluir información de categoría poblada
        const products = await Product.find()
            .populate('categoryId', 'name') // Solo traer el nombre de la categoría
            .select('name description basePrice preparationTime images categoryId available')
            .sort({ createdAt: -1 });
        
        console.log(`Productos encontrados: ${products.length}`);
        
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ 
            message: 'Error al obtener productos',
            error: error.message 
        });
    }
};

// CONTROLADOR PARA OBTENER PRODUCTOS POR CATEGORÍA
productController.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        console.log('Obteniendo productos para categoría:', categoryId);
        
        // Buscar productos de una categoría específica
        const products = await Product.find({ 
            categoryId: categoryId,
            available: true 
        })
            .select('name description basePrice preparationTime images categoryId available')
            .lean();
        
        console.log(`Productos encontrados para categoría ${categoryId}: ${products.length}`);
        
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({ 
            message: 'Error al obtener productos por categoría',
            error: error.message 
        });
    }
};

// CONTROLADOR PARA OBTENER UN PRODUCTO POR ID
productController.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Obteniendo producto:', id);
        
        const product = await Product.findById(id)
            .populate('categoryId', 'name')
            .select('name description basePrice preparationTime images categoryId available');
        
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        console.log('Producto encontrado:', product.name);
        
        res.json(product);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ 
            message: 'Error al obtener producto',
            error: error.message 
        });
    }
};

// CONTROLADOR PARA CREAR UN NUEVO PRODUCTO
productController.createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            basePrice,
            preparationTime,
            categoryId,
            images
        } = req.body;
        
        console.log('Creando nuevo producto:', name);
        
        // Validaciones básicas
        if (!name || !basePrice || !categoryId) {
            return res.status(400).json({
                message: 'Nombre, precio base y categoría son obligatorios'
            });
        }
        
        const newProduct = new Product({
            name,
            description,
            basePrice,
            preparationTime,
            categoryId,
            images: images || [],
            available: true
        });
        
        await newProduct.save();
        
        console.log('Producto creado exitosamente:', newProduct._id);
        
        res.status(201).json({
            message: 'Producto creado exitosamente',
            product: newProduct
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        
        if (error.code === 11000) {
            res.status(400).json({ message: 'Ya existe un producto con ese nombre' });
        } else {
            res.status(500).json({ 
                message: 'Error al crear producto',
                error: error.message 
            });
        }
    }
};

// CONTROLADOR PARA ACTUALIZAR UN PRODUCTO
productController.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            basePrice,
            preparationTime,
            categoryId,
            images,
            available
        } = req.body;
        
        console.log('Actualizando producto:', id);
        
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                basePrice,
                preparationTime,
                categoryId,
                images,
                available
            },
            { new: true }
        ).populate('categoryId', 'name');
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        console.log('Producto actualizado exitosamente:', updatedProduct.name);
        
        res.json({
            message: 'Producto actualizado exitosamente',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ 
            message: 'Error al actualizar producto',
            error: error.message 
        });
    }
};

// CONTROLADOR PARA CAMBIAR DISPONIBILIDAD DE UN PRODUCTO
productController.toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('📦 Cambiando disponibilidad del producto:', id);
        
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        product.available = !product.available;
        await product.save();
        
        console.log(`Disponibilidad del producto cambiada a: ${product.available}`);
        
        res.json({
            message: `Producto ${product.available ? 'activado' : 'desactivado'} exitosamente`,
            product: product
        });
    } catch (error) {
        console.error('Error al cambiar disponibilidad:', error);
        res.status(500).json({ 
            message: 'Error al cambiar disponibilidad del producto',
            error: error.message 
        });
    }
};

// CONTROLADOR PARA ELIMINAR UN PRODUCTO
productController.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('Eliminando producto:', id);
        
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        console.log('Producto eliminado exitosamente:', deletedProduct.name);
        
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ 
            message: 'Error al eliminar producto',
            error: error.message 
        });
    }
};

export default productController;