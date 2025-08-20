// productController.js - Actualizado con manejo de imágenes de Cloudinary
import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';

// Configurar cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});

const productController = {};

// Función auxiliar para extraer public_id de URL de Cloudinary
const extractPublicIdFromUrl = (url) => {
    try {
        // Ejemplo: https://res.cloudinary.com/demo/image/upload/v1234567890/products/abc123.jpg
        // Debe retornar: products/abc123
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
            const pathParts = parts.slice(uploadIndex + 2);
            const fileName = pathParts.join('/');
            // Remover la extensión y versión si existe
            return fileName.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
        }
        return null;
    } catch (error) {
        console.error('Error extrayendo public_id:', error);
        return null;
    }
};

// CONTROLADOR PARA OBTENER TODOS LOS PRODUCTOS DISPONIBLES
productController.getAvailableProducts = async (req, res) => {
    try {
        console.log('Obteniendo productos disponibles...');

        const products = await Product.find({ available: true })
            .select('name description basePrice preparationTime images categoryId available')
            .lean();

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

        const products = await Product.find()
            .populate('categoryId', 'name')
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
            available
        } = req.body;

        console.log('Creando nuevo producto:', name);

        // Validaciones básicas
        if (!name || !basePrice || !categoryId) {
            return res.status(400).json({
                message: 'Nombre, precio base y categoría son obligatorios'
            });
        }

        let images = [];

        // Si se suben archivos, subirlos a Cloudinary
        if (req.files && req.files.length > 0) {
            console.log('Subiendo imágenes a Cloudinary:', req.files.length);

            for (const file of req.files) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "products",
                        allowed_formats: ["jpg", "png", "jpeg", "webp"]
                    });

                    images.push({
                        url: result.secure_url
                    });

                    console.log('Imagen subida exitosamente:', result.secure_url);
                } catch (uploadError) {
                    console.error('Error subiendo imagen individual:', uploadError);
                    // Continuar con las demás imágenes
                }
            }
        }

        // VALIDACIÓN: Debe haber al menos una imagen
        if (!images.length) {
            return res.status(400).json({
                message: "Debes subir al menos una imagen."
            });
        }

        const newProduct = new Product({
            name,
            description,
            basePrice: parseFloat(basePrice),
            preparationTime,
            categoryId,
            images,
            available: available !== undefined ? available : true
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
            available,
            existingImages
        } = req.body;

        console.log('Actualizando producto:', id);

        // Buscar el producto existente
        const currentProduct = await Product.findById(id);
        if (!currentProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Parsear las imágenes existentes que queremos mantener
        let imagesToKeep = [];
        if (existingImages) {
            try {
                imagesToKeep = JSON.parse(existingImages);
                console.log('Imágenes a mantener:', imagesToKeep);
            } catch (error) {
                console.error('Error parsing existingImages:', error);
                imagesToKeep = [];
            }
        }

        // Identificar qué imágenes eliminar de Cloudinary
        const currentImageUrls = currentProduct.images.map(img => img.url);
        const imagesToDelete = currentImageUrls.filter(
            imageUrl => !imagesToKeep.includes(imageUrl)
        );

        console.log('Imágenes a eliminar:', imagesToDelete);

        // Eliminar imágenes de Cloudinary que ya no se necesitan
        for (const imageUrl of imagesToDelete) {
            try {
                const publicId = extractPublicIdFromUrl(imageUrl);
                if (publicId) {
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                    console.log('Imagen eliminada de Cloudinary:', publicId);
                }
            } catch (error) {
                console.error('Error eliminando imagen de Cloudinary:', error);
            }
        }

        // Subir nuevas imágenes a Cloudinary
        const newImages = [];
        if (req.files && req.files.length > 0) {
            console.log('Subiendo nuevas imágenes:', req.files.length);

            for (const file of req.files) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "products",
                        allowed_formats: ["jpg", "png", "jpeg", "webp"]
                    });

                    newImages.push({
                        url: result.secure_url
                    });

                    console.log('Nueva imagen subida:', result.secure_url);
                } catch (error) {
                    console.error('Error subiendo imagen:', error);
                }
            }
        }

        // Combinar imágenes existentes que queremos mantener + nuevas imágenes
        const keptImages = imagesToKeep.map(url => ({ url }));
        const finalImages = [...keptImages, ...newImages];

        // VALIDACIÓN: Debe haber al menos una imagen
        if (!finalImages.length) {
            return res.status(400).json({
                message: "Debes mantener o subir al menos una imagen."
            });
        }

        console.log('Resultado final:', {
            imagenesAnteriores: currentProduct.images.length,
            imagenesAMantener: keptImages.length,
            imagenesNuevas: newImages.length,
            imagenesFinales: finalImages.length,
            imagenesEliminadas: imagesToDelete.length
        });

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                basePrice: parseFloat(basePrice),
                preparationTime,
                categoryId,
                images: finalImages,
                available
            },
            { new: true }
        ).populate('categoryId', 'name');

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

        console.log('Cambiando disponibilidad del producto:', id);

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

        // Obtener el producto antes de eliminarlo para borrar las imágenes de Cloudinary
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Eliminar todas las imágenes de Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                try {
                    const publicId = extractPublicIdFromUrl(image.url);
                    if (publicId) {
                        await cloudinary.uploader.destroy(`products/${publicId}`);
                        console.log('Imagen eliminada de Cloudinary:', publicId);
                    }
                } catch (error) {
                    console.error('Error eliminando imagen de Cloudinary:', error);
                }
            }
        }

        await Product.findByIdAndDelete(id);

        console.log('Producto eliminado exitosamente:', product.name);

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