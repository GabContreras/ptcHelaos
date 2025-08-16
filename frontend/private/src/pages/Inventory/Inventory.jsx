import React, { useEffect, useState } from 'react';
import { useInventoryManager } from '../../hooks/InventoryHooks/useInventory';
import UniversalModal from '../../components/Modals/UniversalModal/UniversalModal';
import toast, { Toaster } from 'react-hot-toast';
import { Edit, Plus, Power, PowerOff, Minus, Package, Clock, AlertCircle, History } from 'lucide-react';
import './Inventory.css';

const InventoryPage = () => {
    const {
        // Estados principales
        inventories,
        allBatches,
        categories,
        selectedInventory,
        setSelectedInventory,
        selectedBatch,
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
        handleInventorySubmit,
        handleBatchSubmit,
        handleOperationSubmit,
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
        
        // Funciones utilitarias
        formatDate,
        formatCurrency,
        getStatusColor,
        getBatchStatus,
        getActiveBatches,
        getMovementTypeLabel,
        getMovementTypeColor
    } = useInventoryManager();

    // Estados locales para pestañas y filtros
    const [activeTab, setActiveTab] = useState('inventarios');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(16);

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchInventories();
        fetchCategories();
    }, []);

    // Cargar lotes cuando se cambia al tab de lotes
    useEffect(() => {
        if (activeTab === 'lotes') {
            fetchAllBatches();
        }
    }, [activeTab]);

    // Mostrar notificaciones de error y éxito
    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    useEffect(() => {
        if (success) toast.success(success);
    }, [success]);

    // Manejar cambio de pestañas
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedInventory(null);
        setSelectedBatch(null);
        setCurrentPage(1);
    };

    // Renderizar tarjeta de inventario
    const renderInventoryCard = (inventory) => (
        <div 
            key={inventory._id} 
            className={`inventory-card ${selectedInventory === inventory._id ? 'selected' : ''} ${!inventory.isActive ? 'inactive' : ''}`}
            onClick={() => inventory.isActive && handleSelectInventory(inventory._id)}
        >
            <div className="inventory-header">
                <h3>{inventory.name}</h3>
                <div className="inventory-actions">
                    <button 
                        className="action-btn edit-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditInventory(inventory);
                        }}
                        title="Editar inventario"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        className={`action-btn toggle-btn ${inventory.isActive ? 'active' : 'inactive'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleInventoryStatus(inventory);
                        }}
                        title={inventory.isActive ? 'Desactivar' : 'Activar'}
                    >
                        {inventory.isActive ? <Power size={16} /> : <PowerOff size={16} />}
                    </button>
                </div>
            </div>
            
            <div className="inventory-info">
                <div className="info-item">
                    <span className="info-label">Categoría:</span>
                    <span className="info-value">{inventory.categoryId?.name || 'Sin categoría'}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Proveedor:</span>
                    <span className="info-value">{inventory.supplier || 'No especificado'}</span>
                </div>
            </div>
            
            <div className="inventory-stock">
                <span className="stock-label">Stock total:</span>
                <span className="stock-amount">
                    {inventory.currentStock} {inventory.unitType}
                </span>
            </div>
            
            <div className="inventory-status">
                <span className={`status-badge ${inventory.isActive ? 'active' : 'inactive'}`}>
                    {inventory.isActive ? 'Activo' : 'Inactivo'}
                </span>
            </div>
        </div>
    );

    // Renderizar tarjeta de lote (para vista de todos los lotes)
    const renderBatchCard = (batch, index) => {
        const status = getBatchStatus(batch);
        
        return (
            <div 
                key={batch._id || index} 
                className={`batch-card-full ${selectedBatch === batch._id ? 'selected' : ''}`}
                onClick={() => handleSelectBatch(batch._id)}
            >
                <div className="batch-header">
                    <h4>Lote #{index + 1}</h4>
                    <span 
                        className="batch-status"
                        style={{ backgroundColor: getStatusColor(status) }}
                    >
                        {status}
                    </span>
                </div>
                
                <div className="batch-details">
                    <div className="batch-row">
                        <span className="batch-label">Cantidad:</span>
                        <span className="batch-value">{batch.quantity}</span>
                    </div>
                    <div className="batch-row">
                        <span className="batch-label">Fecha de compra:</span>
                        <span className="batch-value">{formatDate(batch.purchaseDate)}</span>
                    </div>
                    <div className="batch-row">
                        <span className="batch-label">Fecha de vencimiento:</span>
                        <span className="batch-value">{formatDate(batch.expirationDate)}</span>
                    </div>
                    <div className="batch-row">
                        <span className="batch-label">Notas:</span>
                        <span className="batch-value">{batch.notes || 'Sin notas'}</span>
                    </div>
                    <div className="batch-row">
                        <span className="batch-label">Movimientos:</span>
                        <span className="batch-value">{batch.movements?.length || 0}</span>
                    </div>
                </div>
            </div>
        );
    };

    // Renderizar lote activo en panel lateral
    const renderActiveBatch = (batch, index) => {
        const status = getBatchStatus(batch);
        const isExpiringSoon = batch.expirationDate && 
            new Date(batch.expirationDate) - new Date() < 7 * 24 * 60 * 60 * 1000;
        
        return (
            <div key={batch._id || index} className="batch-card">
                <div className="batch-header">
                    <h4>Lote #{index + 1}</h4>
                    <span 
                        className="batch-status"
                        style={{ backgroundColor: getStatusColor(status) }}
                    >
                        {status}
                    </span>
                </div>
                
                <div className="batch-info">
                    <div className="batch-row">
                        <span className="batch-label">Cantidad:</span>
                        <span className="batch-value">{batch.quantity}</span>
                    </div>
                    <div className="batch-row">
                        <span className="batch-label">Compra:</span>
                        <span className="batch-value">{formatDate(batch.purchaseDate)}</span>
                    </div>
                    <div className="batch-row">
                        <span className="batch-label">Vencimiento:</span>
                        <span className={`batch-value ${isExpiringSoon ? 'expiring' : ''}`}>
                            {formatDate(batch.expirationDate)}
                            {isExpiringSoon && <AlertCircle size={14} className="warning-icon" />}
                        </span>
                    </div>
                </div>
                
                {status === 'En uso' && (
                    <div className="batch-actions">
                        <button 
                            className="withdraw-btn"
                            onClick={() => handleWithdrawFromBatch(batch._id)}
                        >
                            <Minus size={14} />
                            Retirar
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Renderizar movimiento individual
    const renderMovement = (movement, index) => (
        <div key={index} className="movement-card">
            <div className="movement-header">
                <span 
                    className="movement-type"
                    style={{ backgroundColor: getMovementTypeColor(movement.type) }}
                >
                    {getMovementTypeLabel(movement.type)}
                </span>
                <span className="movement-date">{formatDate(movement.date)}</span>
            </div>
            <div className="movement-details">
                <div className="movement-row">
                    <span className="movement-label">Cantidad:</span>
                    <span className="movement-value">{movement.quantity}</span>
                </div>
                <div className="movement-row">
                    <span className="movement-label">Razón:</span>
                    <span className="movement-value">{movement.reason}</span>
                </div>
                <div className="movement-row">
                    <span className="movement-label">Empleado:</span>
                    <span className="movement-value">
                        {movement.employeeId === 'admin' 
                            ? 'Administrador' 
                            : movement.employeeId?.name || 'No especificado'
                        }
                    </span>
                </div>
            </div>
        </div>
    );

    // Obtener inventario seleccionado
    const selectedInventoryData = inventories.find(inv => inv._id === selectedInventory);
    const activeBatches = selectedInventoryData ? getActiveBatches(selectedInventoryData) : [];

    // Obtener lote seleccionado
    const selectedBatchData = allBatches.find(batch => batch._id === selectedBatch);

    return (
        <div className="inventory-page">
            {/* Mostrar indicador de carga */}
            {isLoading && (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                    <span>Cargando...</span>
                </div>
            )}

            {/* Header con pestañas */}
            <div className="header-tabs">
                <button
                    className={`tab-button ${activeTab === 'inventarios' ? 'active' : ''}`}
                    onClick={() => handleTabChange('inventarios')}
                >
                    <Package size={16} />
                    Inventarios
                </button>
                <button
                    className={`tab-button ${activeTab === 'lotes' ? 'active' : ''}`}
                    onClick={() => handleTabChange('lotes')}
                >
                    <Clock size={16} />
                    Todos los Lotes
                </button>
            </div>

            {/* Información de resultados */}
            {!isLoading && (
                <div className="results-info">
                    <span>
                        {activeTab === 'inventarios' 
                            ? `Mostrando ${inventories.length} inventarios`
                            : `Mostrando ${allBatches.length} lotes`
                        }
                    </span>
                </div>
            )}

            {/* Contenido principal */}
            <div className="inventory-container">
                <div className="main-content">
                    {activeTab === 'inventarios' ? (
                        <div className="inventories-list">
                            {inventories.length > 0 ? (
                                inventories.map(renderInventoryCard)
                            ) : (
                                !isLoading && (
                                    <div className="no-data-message">
                                        <p>No hay inventarios registrados. Agrega el primer inventario.</p>
                                    </div>
                                )
                            )}
                            
                            {/* Botón agregar inventario */}
                            {!isLoading && (
                                <div className="add-inventory-container" onClick={handleAddNewInventory}>
                                    <button className="add-inventory-btn-inline">
                                        <div className="add-icon">+</div>
                                        <span className="add-text">Agregar Inventario</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="batches-list">
                            {allBatches.length > 0 ? (
                                allBatches.map(renderBatchCard)
                            ) : (
                                !isLoading && (
                                    <div className="no-data-message">
                                        <p>No hay lotes disponibles.</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Panel lateral */}
                <div className="side-panel">
                    {activeTab === 'inventarios' ? (
                        selectedInventoryData ? (
                            <>
                                <div className="inventory-details">
                                    <h3>{selectedInventoryData.name}</h3>
                                    <div className="detail-category">
                                        {selectedInventoryData.categoryId?.name || 'Sin categoría'}
                                    </div>
                                    
                                    <div className="detail-info">
                                        <div className="detail-row">
                                            <span className="detail-label">Proveedor:</span>
                                            <span className="detail-value">{selectedInventoryData.supplier || 'No especificado'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Stock total:</span>
                                            <span className="detail-value">
                                                {selectedInventoryData.currentStock} {selectedInventoryData.unitType}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Precio extra:</span>
                                            <span className="detail-value">{formatCurrency(selectedInventoryData.extraPrice)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Estado:</span>
                                            <span className={`detail-value ${selectedInventoryData.isActive ? 'active' : 'inactive'}`}>
                                                {selectedInventoryData.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lotes activos */}
                                <div className="active-batches-section">
                                    <div className="section-header">
                                        <h4>Lotes Activos ({activeBatches.length})</h4>
                                        <button 
                                            className="add-batch-btn"
                                            onClick={handleAddBatch}
                                            title="Agregar nuevo lote"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    
                                    {activeBatches.length > 0 ? (
                                        <div className="batches-list-sidebar">
                                            {activeBatches.map(renderActiveBatch)}
                                        </div>
                                    ) : (
                                        <div className="no-batches">
                                            <p>No hay lotes activos</p>
                                            <button className="add-first-batch-btn" onClick={handleAddBatch}>
                                                Agregar primer lote
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Sección de operaciones rápidas */}
                                <div className="quick-operations">
                                    <h4>Operaciones Rápidas</h4>
                                    <button 
                                        className="quick-op-btn withdraw"
                                        onClick={() => handleWithdrawFromBatch()}
                                        disabled={activeBatches.length === 0}
                                    >
                                        <Minus size={16} />
                                        Retirar del Stock
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <Package size={48} className="no-selection-icon" />
                                <h3>Selecciona un inventario</h3>
                                <p>Selecciona un inventario activo para ver sus detalles y lotes disponibles</p>
                            </div>
                        )
                    ) : (
                        selectedBatchData ? (
                            <>
                                <div className="batch-details-full">
                                    <h3>Lote Seleccionado</h3>
                                    <div className="detail-category">
                                        {getBatchStatus(selectedBatchData)}
                                    </div>
                                    
                                    <div className="detail-info">
                                        <div className="detail-row">
                                            <span className="detail-label">Cantidad:</span>
                                            <span className="detail-value">{selectedBatchData.quantity}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Fecha de compra:</span>
                                            <span className="detail-value">{formatDate(selectedBatchData.purchaseDate)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Fecha de vencimiento:</span>
                                            <span className="detail-value">{formatDate(selectedBatchData.expirationDate)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Notas:</span>
                                            <span className="detail-value">{selectedBatchData.notes || 'Sin notas'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Movimientos del lote */}
                                <div className="movements-section">
                                    <div className="section-header">
                                        <h4>
                                            <History size={16} />
                                            Movimientos ({batchMovements.length})
                                        </h4>
                                    </div>
                                    
                                    {batchMovements.length > 0 ? (
                                        <div className="movements-list">
                                            {batchMovements.map(renderMovement)}
                                        </div>
                                    ) : (
                                        <div className="no-movements">
                                            <p>No hay movimientos registrados</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <Clock size={48} className="no-selection-icon" />
                                <h3>Selecciona un lote</h3>
                                <p>Selecciona un lote para ver sus detalles y movimientos</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Modal de inventario usando UniversalModal */}
            <UniversalModal
                isOpen={showInventoryModal}
                onClose={() => {
                    setShowInventoryModal(false);
                    resetInventoryForm();
                }}
                type="form"
                title={isEditingInventory ? 'Editar Inventario' : 'Nuevo Inventario'}
                size="large"
            >
                <form onSubmit={handleInventorySubmit} className="inventory-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Nombre *</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nombre del inventario"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="categoryId">Categoría *</label>
                            <select
                                id="categoryId"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                disabled={isLoading}
                                required
                            >
                                <option value="">Seleccionar categoría...</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="unitType">Tipo de Unidad *</label>
                            <select
                                id="unitType"
                                value={unitType}
                                onChange={(e) => setUnitType(e.target.value)}
                                disabled={isLoading}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {unitTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="supplier">Proveedor</label>
                            <input
                                type="text"
                                id="supplier"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                                placeholder="Nombre del proveedor"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="extraPrice">Precio Extra</label>
                            <input
                                type="number"
                                id="extraPrice"
                                value={extraPrice}
                                onChange={(e) => setExtraPrice(e.target.value)}
                                placeholder="0.00"
                                disabled={isLoading}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Descripción del inventario"
                                disabled={isLoading}
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                setShowInventoryModal(false);
                                resetInventoryForm();
                            }}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="save-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : isEditingInventory ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </UniversalModal>

            {/* Modal de nuevo lote */}
            <UniversalModal
                isOpen={showBatchModal}
                onClose={() => {
                    setShowBatchModal(false);
                    resetBatchForm();
                }}
                type="form"
                title="Nuevo Lote"
                size="large"
            >
                <form onSubmit={handleBatchSubmit} className="batch-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="quantity">Cantidad *</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Cantidad del lote"
                                disabled={isLoading}
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="purchaseDate">Fecha de Compra</label>
                            <input
                                type="date"
                                id="purchaseDate"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                disabled={isLoading}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="expirationDate">Fecha de Vencimiento</label>
                            <input
                                type="date"
                                id="expirationDate"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                disabled={isLoading}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reason">Razón</label>
                            <input
                                type="text"
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Ej: Lote inicial, Reposición..."
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="notes">Notas</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Notas adicionales sobre el lote..."
                                disabled={isLoading}
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                setShowBatchModal(false);
                                resetBatchForm();
                            }}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="save-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando...' : 'Crear Lote'}
                        </button>
                    </div>
                </form>
            </UniversalModal>

            {/* Modal de operaciones */}
            <UniversalModal
                isOpen={showOperationModal}
                onClose={() => {
                    setShowOperationModal(false);
                    resetOperationForm();
                }}
                type="form"
                title="Operación en Lote"
                size="medium"
            >
                <form onSubmit={handleOperationSubmit} className="operation-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="selectedBatchId">Lote *</label>
                            <select
                                id="selectedBatchId"
                                value={selectedBatchId}
                                onChange={(e) => setSelectedBatchId(e.target.value)}
                                disabled={isLoading}
                                required
                            >
                                <option value="">Seleccionar lote...</option>
                                {activeBatches.map((batch, index) => (
                                    <option key={batch._id} value={batch._id}>
                                        Lote #{index + 1} - {batch.quantity} disponible
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="operationType">Tipo de Operación</label>
                            <select
                                id="operationType"
                                value={operationType}
                                onChange={(e) => setOperationType(e.target.value)}
                                disabled={isLoading}
                            >
                                {operationTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="operationQuantity">Cantidad *</label>
                            <input
                                type="number"
                                id="operationQuantity"
                                value={operationQuantity}
                                onChange={(e) => setOperationQuantity(e.target.value)}
                                placeholder="Cantidad a operar"
                                disabled={isLoading}
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="operationReason">Razón *</label>
                            <input
                                type="text"
                                id="operationReason"
                                value={operationReason}
                                onChange={(e) => setOperationReason(e.target.value)}
                                placeholder="Motivo de la operación..."
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                setShowOperationModal(false);
                                resetOperationForm();
                            }}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="save-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Procesando...' : 'Confirmar Operación'}
                        </button>
                    </div>
                </form>
            </UniversalModal>

            {/* Modal de confirmación de eliminación */}
            <UniversalModal
                isOpen={showDeleteModal}
                onClose={cancelDeleteInventory}
                onConfirm={confirmDeleteInventory}
                type="delete"
                title="Eliminar Inventario"
                message="¿Estás seguro de que deseas eliminar este inventario?"
                itemName={inventoryToDelete?.name || ""}
                isLoading={isLoading}
            />

            <Toaster position="top-right" />
        </div>
    );
};

export default InventoryPage;