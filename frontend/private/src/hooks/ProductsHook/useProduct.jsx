import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useProductsManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    // Estados del formulario
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [preparationTime, setPreparationTime] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [available, setAvailable] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // Nuevo estado para imágenes existentes

    // GET - Obtener todos los productos
    const fetchProducts = async () => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver los productos.');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}products`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError('No se pudieron cargar los productos. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // GET - Obtener categorías
    const fetchCategories = async () => {
        if (!isAuthenticated) return;

        try {
            const response = await authenticatedFetch(`${API_BASE}category`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar categorías: ${response.status}`);
            }
            
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    // Manejar selección de imágenes
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length > 5) {
            setError('Máximo 5 imágenes permitidas');
            return;
        }

        // Validar tamaño de archivos (max 5MB por imagen)
        const maxSize = 5 * 1024 * 1024; // 5MB
        for (let file of files) {
            if (file.size > maxSize) {
                setError(`La imagen ${file.name} es muy grande. Máximo 5MB por imagen.`);
                return;
            }
        }

        // Validar tipos de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        for (let file of files) {
            if (!allowedTypes.includes(file.type)) {
                setError(`Tipo de archivo no válido: ${file.name}. Solo se permiten JPG, PNG y WebP.`);
                return;
            }
        }

        setSelectedImages(files);
        
        // Crear previsualizaciones
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
        setError('');
    };

    // Limpiar previsualizaciones
    const clearImagePreviews = () => {
        imagePreview.forEach(url => URL.revokeObjectURL(url));
        setImagePreview([]);
        setSelectedImages([]);
    };

    // Eliminar imagen del preview
    const removeImagePreview = (index) => {
        const updatedFiles = [...selectedImages];
        const updatedPreviews = [...imagePreview];
        
        // Liberar URL del objeto
        URL.revokeObjectURL(updatedPreviews[index]);
        
        // Eliminar del array
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);
        
        setSelectedImages(updatedFiles);
        setImagePreview(updatedPreviews);
    };

    // Agregar más imágenes
    const addMoreImages = (files) => {
        const totalImages = selectedImages.length + files.length + existingImages.length;
        
        if (totalImages > 5) {
            setError('Máximo 5 imágenes permitidas en total');
            return;
        }

        const newFiles = [...selectedImages, ...files];
        const newPreviews = [...imagePreview];
        
        files.forEach(file => {
            newPreviews.push(URL.createObjectURL(file));
        });
        
        setSelectedImages(newFiles);
        setImagePreview(newPreviews);
    };

    // POST/PUT - Crear o actualizar producto
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');

            // Validaciones
            if (!name.trim()) {
                setError('El nombre es obligatorio');
                return;
            }
            
            if (!categoryId) {
                setError('La categoría es obligatoria');
                return;
            }

            if (!description.trim()) {
                setError('La descripción es obligatoria');
                return;
            }

            if (!basePrice || parseFloat(basePrice) <= 0) {
                setError('El precio debe ser mayor a 0');
                return;
            }

            // Para productos nuevos, al menos una imagen es obligatoria
            if (!isEditing && selectedImages.length === 0) {
                setError('Al menos una imagen es obligatoria');
                return;
            }

            // Para productos editados, verificar que tengan al menos una imagen (existente o nueva)
            if (isEditing && selectedImages.length === 0 && existingImages.length === 0) {
                setError('Debes mantener o subir al menos una imagen');
                return;
            }

            // Crear FormData para enviar archivos
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('categoryId', categoryId);
            formData.append('description', description.trim());
            formData.append('preparationTime', preparationTime.trim() || '');
            formData.append('basePrice', parseFloat(basePrice));
            formData.append('available', available);

            // Agregar imágenes nuevas al FormData
            selectedImages.forEach(image => {
                formData.append('images', image);
            });

            // Si estamos editando, enviar las URLs de las imágenes existentes que queremos mantener
            if (isEditing) {
                const imagesToKeep = existingImages.map(img => img.url);
                formData.append('existingImages', JSON.stringify(imagesToKeep));
                console.log('Imágenes existentes a mantener:', imagesToKeep);
            }
            
            let response;
            
            if (isEditing) {
                // Actualizar producto existente (PUT)                
                response = await authenticatedFetch(`${API_BASE}products/${currentProductId}`, {
                    method: 'PUT',
                    body: formData,
                });
            } else {
                // Crear nuevo producto (POST)
                response = await authenticatedFetch(`${API_BASE}products`, {
                    method: 'POST',
                    body: formData,
                });
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 400 && errorData.message) {
                    if (errorData.message.includes('duplicate') || 
                        errorData.message.includes('name')) {
                        throw new Error('Ya existe un producto con este nombre');
                    }
                }
                
                throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el producto`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Producto ${isEditing ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de productos
            await fetchProducts();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} producto:`, error);
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el producto`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const startDeleteProduct = (productId) => {
        if (!productId) {
            console.error('ID de producto no válido');
            setError('Error: ID de producto no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar productos');
            return;
        }
        
        // Buscar el producto para mostrar en el modal
        const product = products.find(product => product._id === productId);
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
                        
            const response = await authenticatedFetch(`${API_BASE}products/${productToDelete._id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('El producto ya no existe o fue eliminado previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar este producto');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar el producto porque tiene datos relacionados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar el producto: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Producto "${productToDelete.name}" eliminado exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setProductToDelete(null);
            
            // Actualizar la lista de productos
            await fetchProducts();
            
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            setError(error.message || 'Error al eliminar el producto');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteProduct = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setName('');
        setCategoryId('');
        setDescription('');
        setPreparationTime('');
        setBasePrice('');
        setAvailable(true);
        clearImagePreviews();
        setExistingImages([]); // Limpiar imágenes existentes
        setIsEditing(false);
        setCurrentProductId(null);
        setError('');
    };

    // Preparar la edición de un producto
    const handleEditProduct = (product) => {
        setName(product.name || '');
        setCategoryId(product.categoryId?._id || product.categoryId || '');
        setDescription(product.description || '');
        setPreparationTime(product.preparationTime || '');
        setBasePrice(product.basePrice?.toString() || '');
        setAvailable(product.available !== undefined ? product.available : true);
        
        // Cargar las imágenes existentes del producto
        const productImages = product.images || [];
        setExistingImages(productImages);
        
        // Limpiar imágenes nuevas
        clearImagePreviews();
        
        setIsEditing(true);
        setCurrentProductId(product._id);
        setShowModal(true);
    };

    // Manejar agregar nuevo producto
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        fetchProducts();
        fetchCategories();
    };

    return {
        // Estados
        products,
        setProducts,
        categories,
        setCategories,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        productToDelete,
        setProductToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentProductId,
        setCurrentProductId,
        
        // Estados del formulario
        name,
        setName,
        categoryId,
        setCategoryId,
        description,
        setDescription,
        preparationTime,
        setPreparationTime,
        basePrice,
        setBasePrice,
        available,
        setAvailable,
        selectedImages,
        setSelectedImages,
        imagePreview,
        setImagePreview,
        existingImages,
        setExistingImages,
        
        // Funciones
        fetchProducts,
        fetchCategories,
        handleImageChange,
        clearImagePreviews,
        addMoreImages,
        removeImagePreview,
        handleSubmit,
        startDeleteProduct,
        confirmDeleteProduct,
        cancelDeleteProduct,
        resetForm,
        handleEditProduct,
        handleAddNew,
        handleRefresh,
    };
}