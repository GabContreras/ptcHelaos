import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useCategoriesManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);

    // Estados del formulario
    const [name, setName] = useState('');

    // GET - Obtener todas las categorías
    const fetchCategories = async () => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver las categorías.');
            return;
        }

        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver las categorías.');
            setCategories([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}/category`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar las categorías: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError('No se pudieron cargar las categorías. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar categoría
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');
            
            const dataToSend = {
                name: name.trim()
            };

            // Validaciones
            if (!dataToSend.name) {
                setError('El nombre de la categoría es obligatorio');
                return;
            }

            if (dataToSend.name.length < 2) {
                setError('El nombre debe tener al menos 2 caracteres');
                return;
            }
            
            let response;
            
            if (isEditing) {
                // Actualizar categoría existente (PUT)                
                response = await authenticatedFetch(`${API_BASE}/category/${currentCategoryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nueva categoría (POST)
                response = await authenticatedFetch(`${API_BASE}/category`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 400 && errorData.message) {
                    if (errorData.message.includes('ya existe')) {
                        throw new Error('Ya existe una categoría con este nombre');
                    }
                }
                
                throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la categoría`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Categoría ${isEditing ? 'actualizada' : 'creada'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de categorías
            await fetchCategories();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} categoría:`, error);
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la categoría`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const startDeleteCategory = (categoryId) => {
        if (!categoryId) {
            console.error('ID de categoría no válido');
            setError('Error: ID de categoría no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar categorías');
            return;
        }
        
        // Buscar la categoría para mostrar en el modal
        const category = categories.find(cat => cat._id === categoryId);
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteCategory = async () => {
        if (!categoryToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
                        
            const response = await authenticatedFetch(`${API_BASE}/category/${categoryToDelete._id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('La categoría ya no existe o fue eliminada previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar esta categoría');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar la categoría: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Categoría "${categoryToDelete.name}" eliminada exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setCategoryToDelete(null);
            
            // Actualizar la lista de categorías
            await fetchCategories();
            
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            setError(error.message || 'Error al eliminar la categoría');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteCategory = () => {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setName('');
        setIsEditing(false);
        setCurrentCategoryId(null);
        setError('');
    };

    // Preparar la edición de una categoría
    const handleEditCategory = (category) => {
        setName(category.name || '');
        setIsEditing(true);
        setCurrentCategoryId(category._id);
        setShowModal(true);
    };

    // Manejar agregar nueva categoría
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        fetchCategories();
    };

    return {
        // Estados
        categories,
        setCategories,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        categoryToDelete,
        setCategoryToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentCategoryId,
        setCurrentCategoryId,
        
        // Estados del formulario
        name,
        setName,
        
        // Funciones
        fetchCategories,
        handleSubmit,
        startDeleteCategory,
        confirmDeleteCategory,
        cancelDeleteCategory,
        resetForm,
        handleEditCategory,
        handleAddNew,
        handleRefresh,
    };
}