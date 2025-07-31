// Importaciones necesarias
import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';

const productCtrl = {};

// CONFIGURAR CLOUDINARY PARA MANEJO DE IMÁGENES
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});

// CONTROLADOR PARA OBTENER TODOS LOS PRODUCTOS
productCtrl.getAllProducts = async (req, res) => {
    try {
        // Buscar todos los productos y popular la información de categoría
        const products = await Product.find()
            .populate('categoryId', 'name')  // Solo obtener el nombre de la categoría
            
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA OBTENER SOLO PRODUCTOS DISPONIBLES
productCtrl.getAvailableProducts = async (req, res) => {
    try {
        // Filtrar solo productos con available: true
        const products = await Product.find({ available: true })
            .populate('categoryId', 'name')
            
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA OBTENER UN PRODUCTO ESPECÍFICO POR ID
productCtrl.getProductById = async (req, res) => {
    try {
        // Buscar producto por ID y popular categoría
        const product = await Product.findById(req.params.id)
            .populate('categoryId', 'name');
        
        // Verificar si el producto existe
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONTROLADOR PARA OBTENER PRODUCTOS POR CATEGORÍA
productCtrl.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        // Filtrar productos por categoría Y que estén disponibles
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

// CONTROLADOR PARA CREAR UN NUEVO PRODUCTO
productCtrl.createProduct = async (req, res) => {
    try {
        // Extraer datos del producto del cuerpo de la petición
        const { name, categoryId, description, preparationTime, basePrice, available } = req.body;
        let imageUrls = [];

        // SUBIR MÚLTIPLES IMÁGENES A CLOUDINARY
        if (req.files && req.files.length > 0) {
            // Procesar cada archivo de imagen
            for (const file of req.files) {
                try {
                    // Subir imagen a cloudinary con configuraciones específicas
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "products",  // Carpeta en cloudinary
                        allowed_formats: ["jpg", "png", "jpeg", "webp"]  // Formatos permitidos
                    });
                    // Guardar la URL segura de la imagen
                    imageUrls.push({ url: result.secure_url });
                } catch (uploadError) {
                    console.error("Error subiendo imagen:", uploadError);
                }
            }
        }

        // CREAR NUEVO PRODUCTO
        const newProduct = new Product({
            name,
            categoryId,
            description,
            images: imageUrls,                                    // Array de URLs de imágenes
            available: available !== undefined ? available : true, // Por defecto disponible
            preparationTime,
            basePrice
        });

        // Guardar producto en la base de datos
        await newProduct.save();
        // Popular categoría para la respuesta
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

// CONTROLADOR PARA ACTUALIZAR UN PRODUCTO EXISTENTE
productCtrl.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Extraer datos a actualizar
        const { name, categoryId, description, preparationTime, basePrice, available } = req.body;
        
        // VERIFICAR QUE EL PRODUCTO EXISTE
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        let imageUrls = [];

        // SUBIR NUEVAS IMÁGENES SI SE PROPORCIONAN
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

        // PREPARAR DATOS DE ACTUALIZACIÓN
        const updateData = {
            name,
            categoryId,
            description,
            preparationTime,
            basePrice,
            // Mantener disponibilidad actual si no se especifica
            available: available !== undefined ? available : product.available
        };

        // SOLO ACTUALIZAR IMÁGENES SI SE SUBIERON NUEVAS
        // Esto preserva las imágenes existentes si no se cargan nuevas
        if (imageUrls.length > 0) {
            updateData.images = imageUrls;
        }

        // Actualizar producto y devolver el documento actualizado
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

// CONTROLADOR PARA ELIMINAR UN PRODUCTO
productCtrl.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Buscar el producto a eliminar
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // ELIMINAR IMÁGENES DE CLOUDINARY ANTES DE ELIMINAR EL PRODUCTO
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                try {
                    // EXTRAER PUBLIC_ID DE LA URL DE CLOUDINARY
                    // Las URLs de cloudinary tienen formato: .../.../products/public_id.extension
                    const publicId = image.url.split('/').pop().split('.')[0];
                    
                    // ELIMINAR IMAGEN DE CLOUDINARY PERMANENTEMENTE
                    // Usar la ruta completa con la carpeta 'products'
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                } catch (deleteError) {
                    console.error("Error eliminando imagen de cloudinary:", deleteError);
                }
            }
        }

        // ELIMINAR EL PRODUCTO DE LA BASE DE DATOS
        await Product.findByIdAndDelete(id);

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error("Error eliminando producto:", error);
        res.status(500).json({ message: error.message });
    }
};

export default productCtrl;