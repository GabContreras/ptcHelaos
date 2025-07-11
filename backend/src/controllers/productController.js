import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';

const productCtrl = {};

// Configurar cloudinary 
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});

// GET - Obtener todos los productos
productCtrl.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('categoryId', 'name')
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Obtener productos disponibles 
productCtrl.getAvailableProducts = async (req, res) => {
    try {
        const products = await Product.find({ available: true })
            .populate('categoryId', 'name')
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Obtener producto por ID
productCtrl.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('categoryId', 'name');
        
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Obtener productos por categoría
productCtrl.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ 
            categoryId, 
            available: true 
        })
        .populate('categoryId', 'name')
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST - Crear nuevo producto
productCtrl.createProduct = async (req, res) => {
    try {
        const { name, categoryId, description, preparationTime, basePrice, available } = req.body;
        let imageUrls = [];

        // Subir múltiples imágenes a cloudinary
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "products",
                        allowed_formats: ["jpg", "png", "jpeg", "webp"]
                    });
                    imageUrls.push({ url: result.secure_url });
                } catch (uploadError) {
                    console.error("Error subiendo imagen:", uploadError);
                }
            }
        }

        // Crear nuevo producto
        const newProduct = new Product({
            name,
            categoryId,
            description,
            images: imageUrls,
            available: available !== undefined ? available : true,
            preparationTime,
            basePrice
        });

        await newProduct.save();
        await newProduct.populate('categoryId', 'name');

        res.status(201).json({
            message: 'Producto creado exitosamente',
            product: newProduct
        });
    } catch (error) {
        console.error("Error creando producto:", error);
        res.status(500).json({ message: error.message });
    }
};

// PUT - Actualizar producto
productCtrl.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId, description, preparationTime, basePrice, available } = req.body;
        
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        let imageUrls = [];

        // Subir nuevas imágenes si se proporcionan
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "products",
                        allowed_formats: ["jpg", "png", "jpeg", "webp"]
                    });
                    imageUrls.push({ url: result.secure_url });
                } catch (uploadError) {
                    console.error("Error subiendo imagen:", uploadError);
                }
            }
        }

        // Preparar datos de actualización
        const updateData = {
            name,
            categoryId,
            description,
            preparationTime,
            basePrice,
            available: available !== undefined ? available : product.available
        };

        // Solo actualizar imágenes si se subieron nuevas
        if (imageUrls.length > 0) {
            updateData.images = imageUrls;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).populate('categoryId', 'name');

        res.json({
            message: 'Producto actualizado exitosamente',
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error actualizando producto:", error);
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Eliminar producto
productCtrl.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Eliminar imágenes de cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                try {
                    // Extraer public_id de la URL de cloudinary
                    const publicId = image.url.split('/').pop().split('.')[0];
                    // Eliminar imagen de cloudinary permanentemente
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                } catch (deleteError) {
                    console.error("Error eliminando imagen de cloudinary:", deleteError);
                }
            }
        }

        await Product.findByIdAndDelete(id);

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error("Error eliminando producto:", error);
        res.status(500).json({ message: error.message });
    }
};

export default productCtrl;