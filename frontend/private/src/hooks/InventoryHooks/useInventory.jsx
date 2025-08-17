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
    const [showExpireModal, setShowExpireModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Estados de edición
    const [isEditingInventory, setIsEditingInventory] = useState(false);
    const [currentInventoryId, setCurrentInventoryId] = useState(null);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [inventoryToDelete, setInventoryToDelete] = useState(null);
    const [batchToDelete, setBatchToDelete] = useState(null);
    const [batchToExpire, setBatchToExpire] = useState(null);
    
    // Estados del formulario de inventario
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [supplier, setSupplier] = useState('');
    const [extraPrice, setExtraPrice] = useState('');
    const [unitType, setUnitType] = useState('');
    const [description, setDescription] = useState('');
    
    // Estados del formulario de lote (SIN batchIdentifier)
    const [quantity, setQuantity] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
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

    // Validar si el inventario está activo
    const validateInventoryActive = (inventoryId) => {
        const inventory = inventories.find(inv => inv._id === inventoryId);
        if (!inventory) {
            setError('Inventario no encontrado');
            return false;
        }
        
        if (!inventory.isActive) {
            setError('No se pueden realizar operaciones en un inventario inactivo');
            return false;
        }
        
        return true;
    };

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

    // POST - Crear nuevo lote (CON IDENTIFICADOR AUTOMÁTICO)
    const handleBatchSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedInventory) {
            setError('Selecciona un inventario primero');
            return;
        }

        // Validar que el inventario esté activo antes de crear lote
        if (!validateInventoryActive(selectedInventory)) {
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

            // Procesar fechas para asegurar formato correcto
            let processedPurchaseDate = purchaseDate;
            let processedExpirationDate = expirationDate;

            // Si no hay fecha de compra, usar fecha actual de El Salvador
            if (!processedPurchaseDate) {
                processedPurchaseDate = getCurrentDateSalvador();
            }

            // Convertir fechas a formato ISO pero manteniendo zona horaria local
            if (processedPurchaseDate) {
                const purchaseDateObj = new Date(processedPurchaseDate + 'T12:00:00');
                processedPurchaseDate = purchaseDateObj.toISOString();
            }

            if (processedExpirationDate) {
                const expirationDateObj = new Date(processedExpirationDate + 'T12:00:00');
                processedExpirationDate = expirationDateObj.toISOString();
            }

            const dataToSend = {
                quantity: Number(quantity),
                expirationDate: processedExpirationDate,
                purchaseDate: processedPurchaseDate,
                reason: reason.trim() || 'Lote inicial'
                // NO enviar batchIdentifier - se genera automáticamente en el backend
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
            
            const responseData = await response.json();
            
            setSuccess(`Lote creado exitosamente con ID: ${responseData.batchIdentifier || 'N/A'}`);
            setTimeout(() => setSuccess(''), 4000);
            
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

        // Validar que el inventario del lote esté activo
        if (!validateInventoryActive(selectedInventory)) {
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

    // Función para marcar lote como vencido
    const markBatchAsExpired = async () => {
        if (!batchToExpire) return;

        // Validar que el lote tenga fecha de vencimiento
        if (!batchToExpire.expirationDate) {
            setError('No se puede marcar como vencido un lote sin fecha de vencimiento');
            return;
        }

        // Validar que el inventario del lote esté activo
        if (!validateInventoryActive(selectedInventory)) {
            return;
        }
        
        try {
            setIsLoading(true);
            setError('');

            const response = await authenticatedFetch(`${API_BASE}inventory/batch/${batchToExpire._id}/operation`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operationType: 'vencido',
                    reason: 'Lote marcado manualmente como vencido'
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al marcar el lote como vencido');
            }
            
            setSuccess('Lote marcado como vencido exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            
            setShowExpireModal(false);
            setBatchToExpire(null);
            
            await fetchInventories();
            
        } catch (error) {
            console.error('Error al marcar lote como vencido:', error);
            setError(error.message || 'Error al marcar el lote como vencido');
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

    // Cancelar proceso de vencimiento
    const cancelExpireBatch = () => {
        setShowExpireModal(false);
        setBatchToExpire(null);
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
        setReason('');
        // NO resetear batchIdentifier porque ya no existe
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

        // Validar que el inventario esté activo
        if (!validateInventoryActive(selectedInventory)) {
            return;
        }

        resetBatchForm();
        setReason('Lote inicial');
        // Establecer fecha actual de El Salvador por defecto
        setPurchaseDate(getCurrentDateSalvador());
        setShowBatchModal(true);
    };

    const handleMarkAsExpired = (batchId) => {
        // Encontrar el lote
        const batch = allBatches.find(b => b._id === batchId) || 
                     inventories.flatMap(inv => inv.batchId || []).find(b => b._id === batchId);
        
        if (!batch) {
            setError('Lote no encontrado');
            return;
        }

        // Validar que el lote tenga fecha de vencimiento
        if (!batch.expirationDate) {
            setError('No se puede marcar como vencido un lote sin fecha de vencimiento');
            return;
        }

        // Validar que el inventario esté activo antes de marcar como vencido
        if (!validateInventoryActive(selectedInventory)) {
            return;
        }

        setBatchToExpire(batch);
        setShowExpireModal(true);
    };

    const handleWithdrawFromBatch = (batchId = null) => {
        if (!selectedInventory) {
            setError('Selecciona un inventario primero');
            return;
        }

        // Validar que el inventario esté activo
        if (!validateInventoryActive(selectedInventory)) {
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
        
        // Crear fecha en zona horaria de El Salvador (GMT-6)
        const date = new Date(dateString);
        
        // Agregar offset de zona horaria de El Salvador si es necesario
        const salvadorOffset = -6 * 60; // GMT-6 en minutos
        const userOffset = date.getTimezoneOffset();
        const offsetDifference = userOffset - salvadorOffset;
        
        // Ajustar la fecha para El Salvador
        const adjustedDate = new Date(date.getTime() + (offsetDifference * 60 * 1000));
        
        return adjustedDate.toLocaleDateString('es-SV', {
            timeZone: 'America/El_Salvador',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        
        // Crear fecha y forzar zona horaria de El Salvador
        const date = new Date(dateString);
        
        // Obtener componentes de fecha en zona horaria de El Salvador
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };

    const getCurrentDateSalvador = () => {
        // Obtener fecha actual en zona horaria de El Salvador
        const now = new Date();
        const salvadorTime = new Date(now.toLocaleString("en-US", {timeZone: "America/El_Salvador"}));
        
        const year = salvadorTime.getFullYear();
        const month = String(salvadorTime.getMonth() + 1).padStart(2, '0');
        const day = String(salvadorTime.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
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
        
        // Si ya está marcado como vencido explícitamente
        if (batch.status === 'Vencido') return 'Vencido';
        
        // Si la cantidad es 0, está agotado
        if (batch.quantity === 0) return 'Agotado';
        
        // Devolver el estado original del batch sin verificación automática de fechas
        return batch.status || 'En uso';
    };

    const getActiveBatches = (inventory) => {
        if (!inventory || !inventory.batchId) return [];
        return inventory.batchId.filter(batch => {
            // Solo incluir lotes que estén explícitamente marcados como "En uso" y tengan cantidad
            return batch.status === 'En uso' && batch.quantity > 0;
        });
    };

    const isExpiringSoon = (batch) => {
        if (!batch.expirationDate) return false;
        
        const now = new Date();
        const expiration = new Date(batch.expirationDate);
        const diffTime = expiration - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Retorna true si faltan 7 días o menos para vencer
        return diffDays <= 7 && diffDays >= 0;
    };

    const getMovementTypeLabel = (type) => {
        switch (type) {
            case 'entrada': return 'Entrada';
            case 'salida': return 'Salida';
            case 'daño': return 'Daño';
            case 'vencido': return 'Vencido';
            default: return type;
        }
    };

    const getMovementTypeColor = (type) => {
        switch (type) {
            case 'entrada': return '#10b981'; // Verde
            case 'salida': return '#ef4444';  // Rojo
            case 'daño': return '#f59e0b';    // Naranja
            case 'vencido': return '#8b5cf6'; // Púrpura
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
        showExpireModal,
        inventoryToDelete,
        batchToDelete,
        batchToExpire,
        
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
        
        // Estados del formulario de lote (SIN batchIdentifier)
        quantity,
        setQuantity,
        expirationDate,
        setExpirationDate,
        purchaseDate,
        setPurchaseDate,
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
        markBatchAsExpired,
        startDeleteInventory,
        confirmDeleteInventory,
        cancelDeleteInventory,
        cancelDeleteBatch,
        cancelExpireBatch,
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
        handleMarkAsExpired,
        handleToggleInventoryStatus,
        handleRefresh,
        
        // Funciones utilitarias
        formatDate,
        formatDateForInput,
        getCurrentDateSalvador,
        formatCurrency,
        getStatusColor,
        getBatchStatus,
        getActiveBatches,
        isExpiringSoon,
        getMovementTypeLabel,
        getMovementTypeColor,
        
        // Nueva función de validación
        validateInventoryActive
    };
}