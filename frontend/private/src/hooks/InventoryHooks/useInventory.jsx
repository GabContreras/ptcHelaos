import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useInventoryManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    // Estados principales
    const [inventories, setInventories] = useState([]);
    const [allBatches, setAllBatches] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [batchMovements, setBatchMovements] = useState([]);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showOperationModal, setShowOperationModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Estados de edición
    const [isEditingInventory, setIsEditingInventory] = useState(false);
    const [currentInventoryId, setCurrentInventoryId] = useState(null);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [inventoryToDelete, setInventoryToDelete] = useState(null);
    const [batchToDelete, setBatchToDelete] = useState(null);
    
    // Estados del formulario de inventario
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [supplier, setSupplier] = useState('');
    const [extraPrice, setExtraPrice] = useState('');
    const [unitType, setUnitType] = useState('');
    const [description, setDescription] = useState('');
    
    // Estados del formulario de lote
    const [quantity, setQuantity] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [notes, setNotes] = useState('');
    const [reason, setReason] = useState('');
    
    // Estados del formulario de operación
    const [operationType, setOperationType] = useState('salida');
    const [operationQuantity, setOperationQuantity] = useState('');
    const [operationReason, setOperationReason] = useState('');
    const [selectedBatchId, setSelectedBatchId] = useState('');
    
    // Tipos de unidades disponibles
    const unitTypes = [
        'kilogramos', 'kilos', 'unidades', 'litros', 'libras', 'gramos'
    ];
    
    // Tipos de operaciones
    const operationTypes = [
        { value: 'entrada', label: 'Entrada (Agregar stock)' },
        { value: 'salida', label: 'Salida (Consumir stock)' },
        { value: 'daño', label: 'Daño (Marcar como dañado)' }
    ];

    // GET - Obtener todos los inventarios
    const fetchInventories = async () => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver el inventario.');
            return;
        }

        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver el inventario.');
            setInventories([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}inventory`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar inventarios: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setInventories(data);
        } catch (error) {
            setError('No se pudieron cargar los inventarios. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // GET - Obtener todas las categorías
    const fetchCategories = async () => {
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
            console.warn('No se pudieron cargar las categorías:', error.message);
            setCategories([]);
        }
    };

    // GET - Obtener todos los lotes
    const fetchAllBatches = async () => {
        try {
            setIsLoading(true);
            const response = await authenticatedFetch(`${API_BASE}inventory/batch`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar lotes: ${response.status}`);
            }
            
            const data = await response.json();
            setAllBatches(data);
        } catch (error) {
            setError('No se pudieron cargar los lotes. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // GET - Obtener movimientos de un lote específico
    const fetchBatchMovements = async (batchId) => {
        if (!batchId) return;
        
        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}inventory/batch/${batchId}/movements`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar movimientos del lote: ${response.status}`);
            }
            
            const data = await response.json();
            setBatchMovements(data);
        } catch (error) {
            setError('No se pudieron cargar los movimientos del lote. ' + error.message);
            setBatchMovements([]);
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar inventario
    const handleInventorySubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');

            // Validaciones
            if (!name.trim()) {
                setError('El nombre del inventario es obligatorio');
                return;
            }
            
            if (!categoryId) {
                setError('La categoría es obligatoria');
                return;
            }

            if (!unitType) {
                setError('El tipo de unidad es obligatorio');
                return;
            }

            const dataToSend = {
                name: name.trim(),
                categoryId,
                supplier: supplier.trim(),
                extraPrice: Number(extraPrice) || 0,
                unitType,
                description: description.trim()
            };

            let response;
            
            if (isEditingInventory) {
                response = await authenticatedFetch(`${API_BASE}inventory/${currentInventoryId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
            } else {
                response = await authenticatedFetch(`${API_BASE}inventory`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                
                if (response.status === 400 && errorData.isExisting) {
                    throw new Error('Ya existe un inventario con este nombre');
                }
                
                throw new Error(errorData.message || `Error al ${isEditingInventory ? 'actualizar' : 'crear'} el inventario`);
            }
            
            setSuccess(`Inventario ${isEditingInventory ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            await fetchInventories();
            setShowInventoryModal(false);
            resetInventoryForm();
            
        } catch (error) {
            console.error('Error al manejar inventario:', error);
            setError(error.message || `Error al ${isEditingInventory ? 'actualizar' : 'crear'} el inventario`);
        } finally {
            setIsLoading(false);
        }
    };

    // POST - Crear nuevo lote
    const handleBatchSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedInventory) {
            setError('Selecciona un inventario primero');
            return;
        }
        
        try {
            setIsLoading(true);
            setError('');

            // Validaciones
            if (!quantity || Number(quantity) <= 0) {
                setError('La cantidad debe ser mayor a 0');
                return;
            }

            const dataToSend = {
                quantity: Number(quantity),
                expirationDate: expirationDate || null,
                purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
                notes: notes.trim(),
                reason: reason.trim() || 'Lote inicial'
            };

            const response = await authenticatedFetch(`${API_BASE}inventory/${selectedInventory}/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el lote');
            }
            
            setSuccess('Lote creado exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            
            await fetchInventories();
            setShowBatchModal(false);
            resetBatchForm();
            
        } catch (error) {
            console.error('Error al crear lote:', error);
            setError(error.message || 'Error al crear el lote');
        } finally {
            setIsLoading(false);
        }
    };

    // PUT - Operaciones en lotes
    const handleOperationSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedBatchId) {
            setError('Selecciona un lote');
            return;
        }
        
        try {
            setIsLoading(true);
            setError('');

            // Validaciones
            if (!operationQuantity || Number(operationQuantity) <= 0) {
                setError('La cantidad debe ser mayor a 0');
                return;
            }

            if (!operationReason.trim()) {
                setError('La razón es obligatoria');
                return;
            }

            const response = await authenticatedFetch(`${API_BASE}inventory/batch/${selectedBatchId}/operation`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operationType,
                    quantity: Number(operationQuantity),
                    reason: operationReason.trim()
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al realizar la operación');
            }
            
            const operationLabel = operationTypes.find(op => op.value === operationType)?.label || 'Operación';
            setSuccess(`${operationLabel} realizada exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            await fetchInventories();
            setShowOperationModal(false);
            resetOperationForm();
            
        } catch (error) {
            console.error('Error al realizar operación:', error);
            setError(error.message || 'Error al realizar la operación');
        } finally {
            setIsLoading(false);
        }
    };

    // PUT - Toggle estado activo/inactivo del inventario
    const toggleInventoryStatus = async (inventoryId, newStatus) => {
        try {
            setIsLoading(true);
            setError('');

            const response = await authenticatedFetch(`${API_BASE}inventory/${inventoryId}/toggleStatus`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cambiar estado del inventario');
            }

            setSuccess(`Inventario ${newStatus ? 'activado' : 'desactivado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);

            await fetchInventories();

        } catch (error) {
            console.error('Error al cambiar estado:', error);
            setError(error.message || 'Error al cambiar estado del inventario');
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación de inventario
    const startDeleteInventory = (inventoryId) => {
        const inventory = inventories.find(inv => inv._id === inventoryId);
        setInventoryToDelete(inventory);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación de inventario
    const confirmDeleteInventory = async () => {
        if (!inventoryToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}inventory/${inventoryToDelete._id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                
                if (response.status === 400) {
                    throw new Error('No se puede eliminar el inventario porque tiene lotes activos');
                }
                
                throw new Error(errorData.message || 'Error al eliminar el inventario');
            }
            
            setSuccess(`Inventario "${inventoryToDelete.name}" eliminado exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            setShowDeleteModal(false);
            setInventoryToDelete(null);
            
            if (selectedInventory === inventoryToDelete._id) {
                setSelectedInventory(null);
            }
            
            await fetchInventories();
            
        } catch (error) {
            console.error('Error al eliminar inventario:', error);
            setError(error.message || 'Error al eliminar el inventario');
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteInventory = () => {
        setShowDeleteModal(false);
        setInventoryToDelete(null);
    };

    const cancelDeleteBatch = () => {
        setShowBatchDeleteModal(false);
        setBatchToDelete(null);
    };

    // Funciones de reset
    const resetInventoryForm = () => {
        setName('');
        setCategoryId('');
        setSupplier('');
        setExtraPrice('');
        setUnitType('');
        setDescription('');
        setIsEditingInventory(false);
        setCurrentInventoryId(null);
        setError('');
    };

    const resetBatchForm = () => {
        setQuantity('');
        setExpirationDate('');
        setPurchaseDate('');
        setNotes('');
        setReason('');
        setError('');
    };

    const resetOperationForm = () => {
        setOperationType('salida');
        setOperationQuantity('');
        setOperationReason('');
        setSelectedBatchId('');
        setError('');
    };

    // Manejadores de eventos
    const handleAddNewInventory = () => {
        resetInventoryForm();
        setShowInventoryModal(true);
    };

    const handleEditInventory = (inventory) => {
        setName(inventory.name || '');
        setCategoryId(inventory.categoryId?._id || inventory.categoryId || '');
        setSupplier(inventory.supplier || '');
        setExtraPrice(inventory.extraPrice?.toString() || '');
        setUnitType(inventory.unitType || '');
        setDescription(inventory.description || '');
        setIsEditingInventory(true);
        setCurrentInventoryId(inventory._id);
        setShowInventoryModal(true);
    };

    const handleSelectInventory = (inventoryId) => {
        setSelectedInventory(inventoryId);
    };

    const handleSelectBatch = (batchId) => {
        setSelectedBatch(batchId);
        fetchBatchMovements(batchId);
    };

    const handleAddBatch = () => {
        if (!selectedInventory) {
            setError('Selecciona un inventario primero');
            return;
        }
        resetBatchForm();
        setReason('Lote inicial');
        setShowBatchModal(true);
    };

    const handleWithdrawFromBatch = (batchId = null) => {
        if (!selectedInventory) {
            setError('Selecciona un inventario primero');
            return;
        }
        resetOperationForm();
        setOperationType('salida');
        setOperationReason('Consumo de ingrediente');
        if (batchId) {
            setSelectedBatchId(batchId);
        }
        setShowOperationModal(true);
    };

    const handleToggleInventoryStatus = (inventory) => {
        toggleInventoryStatus(inventory._id, !inventory.isActive);
    };

    const handleRefresh = () => {
        fetchInventories();
    };

    // Funciones utilitarias
    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'En uso': return '#10b981';
            case 'Agotado': return '#f59e0b';
            case 'Vencido': return '#ef4444';
            case 'Dañado': return '#8b5cf6';
            default: return '#6b7280';
        }
    };

    const getBatchStatus = (batch) => {
        if (!batch) return 'Desconocido';
        
        // Si la cantidad es 0, está agotado
        if (batch.quantity === 0) return 'Agotado';
        
        // Si no hay fecha de vencimiento, usar el estado del batch
        if (!batch.expirationDate) {
            return batch.status || 'En uso';
        }
        
        // Verificar si está vencido (solo si hay fecha de vencimiento)
        const now = new Date();
        const expiration = new Date(batch.expirationDate);
        
        // Si la fecha de vencimiento es válida y ya pasó
        if (!isNaN(expiration.getTime()) && expiration < now) {
            return 'Vencido';
        }
        
        // En cualquier otro caso, devolver el estado original del batch
        return batch.status || 'En uso';
    };

    const getActiveBatches = (inventory) => {
        if (!inventory || !inventory.batchId) return [];
        return inventory.batchId.filter(batch => 
            batch.status === 'En uso' && batch.quantity > 0
        );
    };

    const getMovementTypeLabel = (type) => {
        switch (type) {
            case 'entrada': return 'Entrada';
            case 'salida': return 'Salida';
            case 'daño': return 'Daño';
            default: return type;
        }
    };

    const getMovementTypeColor = (type) => {
        switch (type) {
            case 'entrada': return '#10b981'; // Verde
            case 'salida': return '#ef4444';  // Rojo
            case 'daño': return '#f59e0b';    // Naranja
            default: return '#6b7280';       // Gris
        }
    };

    return {
        // Estados principales
        inventories,
        allBatches,
        categories,
        selectedInventory,
        setSelectedInventory,
        selectedBatch,
        setSelectedBatch,
        batchMovements,
        isLoading,
        error,
        setError,
        success,
        
        // Estados de modales
        showInventoryModal,
        setShowInventoryModal,
        showBatchModal,
        setShowBatchModal,
        showOperationModal,
        setShowOperationModal,
        showDeleteModal,
        showBatchDeleteModal,
        inventoryToDelete,
        batchToDelete,
        
        // Estados de formularios
        isEditingInventory,
        currentInventoryId,
        
        // Estados del formulario de inventario
        name,
        setName,
        categoryId,
        setCategoryId,
        supplier,
        setSupplier,
        extraPrice,
        setExtraPrice,
        unitType,
        setUnitType,
        description,
        setDescription,
        
        // Estados del formulario de lote
        quantity,
        setQuantity,
        expirationDate,
        setExpirationDate,
        purchaseDate,
        setPurchaseDate,
        notes,
        setNotes,
        reason,
        setReason,
        
        // Estados del formulario de operación
        operationType,
        setOperationType,
        operationQuantity,
        setOperationQuantity,
        operationReason,
        setOperationReason,
        selectedBatchId,
        setSelectedBatchId,
        
        // Datos de referencia
        unitTypes,
        operationTypes,
        
        // Funciones principales
        fetchInventories,
        fetchAllBatches,
        fetchCategories,
        fetchBatchMovements,
        handleInventorySubmit,
        handleBatchSubmit,
        handleOperationSubmit,
        startDeleteInventory,
        confirmDeleteInventory,
        cancelDeleteInventory,
        cancelDeleteBatch,
        resetInventoryForm,
        resetBatchForm,
        resetOperationForm,
        
        // Manejadores de eventos
        handleAddNewInventory,
        handleEditInventory,
        handleSelectInventory,
        handleSelectBatch,
        handleAddBatch,
        handleWithdrawFromBatch,
        handleToggleInventoryStatus,
        handleRefresh,
        
        // Funciones utilitarias
        formatDate,
        formatCurrency,
        getStatusColor,
        getBatchStatus,
        getActiveBatches,
        getMovementTypeLabel,
        getMovementTypeColor
    };
}