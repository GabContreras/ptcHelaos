// Categories.jsx - Página principal de categorías con responsive mejorado
import React, { useEffect, useState } from 'react';
import { useCategoriesManager } from '../../hooks/CategoriesHook/useCategories';
import UniversalModal from '../../components/Modals/UniversalModal/UniversalModal';
import toast, { Toaster } from 'react-hot-toast';
import './Categories.css';

const CategoriesPage = () => {
  const {
    // Estados principales
    categories,
    showModal,
    setShowModal,
    showDeleteModal,
    categoryToDelete,
    isLoading,
    error,
    success,
    setError,
    isEditing,
    currentCategoryId,
    
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
  } = useCategoriesManager();

  // Estados locales para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Función para filtrar categorías por búsqueda
  const getFilteredCategories = () => {
    if (!searchTerm.trim()) return categories;
    
    return categories.filter(category => 
      category.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredCategories = getFilteredCategories();
  
  // Mostrar notificaciones de error y éxito
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);

  // Renderizar vista de cards para mobile
  const renderMobileCards = () => (
    <div className="categories-cards-container">
      {filteredCategories.map(category => (
        <div key={category._id} className="category-card">
          <div className="category-card-content">
            <h3 className="category-card-name">{category.name}</h3>
            <div className="category-card-actions">
              <button 
                className="edit-btn-card"
                onClick={() => handleEditCategory(category)}
                disabled={isLoading}
                title="Actualizar categoría"
              >
                ✏️ Actualizar
              </button>
              <button 
                className="delete-btn-card"
                onClick={() => startDeleteCategory(category._id)}
                disabled={isLoading}
                title="Eliminar categoría"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Renderizar tabla para desktop
  const renderDesktopTable = () => (
    <div className="categories-table-container">
      <table className="categories-table">
        <thead>
          <tr>
            <th>Nombre Marca</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="2" className="loading-cell">
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <span>Cargando categorías...</span>
                </div>
              </td>
            </tr>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <tr key={category._id}>
                <td className="category-name">{category.name}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditCategory(category)}
                      disabled={isLoading}
                      title="Actualizar categoría"
                    >
                      Actualizar
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => startDeleteCategory(category._id)}
                      disabled={isLoading}
                      title="Eliminar categoría"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-data-cell">
                {searchTerm ? (
                  <div className="no-data-message">
                    <p>No se encontraron categorías que coincidan con "{searchTerm}"</p>
                    <button onClick={() => setSearchTerm('')} className="clear-search-btn">
                      Limpiar búsqueda
                    </button>
                  </div>
                ) : (
                  <div className="no-data-message">
                    <p>No hay categorías registradas.</p>
                    <button onClick={handleAddNew} className="add-first-btn">
                      Agregar primera categoría
                    </button>
                  </div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Renderizar mensaje vacío para mobile
  const renderMobileEmptyState = () => (
    <div className="mobile-empty-state">
      {searchTerm ? (
        <div className="no-data-message">
          <p>No se encontraron categorías que coincidan con "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className="clear-search-btn">
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <div className="no-data-message">
          <p>No hay categorías registradas.</p>
          <button onClick={handleAddNew} className="add-first-btn">
            Agregar primera categoría
          </button>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="categories-page">
      <div className="categories-container">
        <h1 className="page-title">Gestión de Categorías</h1>
        
        {/* Header con búsqueda y botón agregar */}
        <div className="categories-header">
          <div className="search-section">
            <input
              type="text"
              placeholder={isMobile ? "Buscar marca..." : "Buscar por nombre de marca..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className="add-category-btn"
            onClick={handleAddNew}
            disabled={isLoading}
          >
            {isMobile ? '+ Agregar' : 'Agregar'}
          </button>
        </div>

        {/* Contenido principal - cambia según el dispositivo */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>Cargando categorías...</span>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {isMobile ? (
              // Vista móvil con cards
              filteredCategories.length > 0 ? (
                renderMobileCards()
              ) : (
                renderMobileEmptyState()
              )
            ) : (
              // Vista desktop con tabla
              renderDesktopTable()
            )}
          </>
        )}

        {/* Información de resultados */}
        {!isLoading && filteredCategories.length > 0 && (
          <div className="results-info">
            <span>
              {isMobile ? 
                `${filteredCategories.length} categorías` :
                `Mostrando ${filteredCategories.length} categorías`
              }
              {searchTerm && ` (filtradas de ${categories.length} total)`}
            </span>
          </div>
        )}

        {/* Botón flotante para mobile */}
        {isMobile && !isLoading && (
          <button 
            className="floating-add-btn"
            onClick={handleAddNew}
            disabled={isLoading}
            title="Agregar categoría"
          >
            +
          </button>
        )}
      </div>
      
      {/* Modal de edición/creación usando UniversalModal */}
      <UniversalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        type="form"
        title={isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
        size="small"
      >
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Nombre de la Categoría</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa el nombre de la categoría"
              disabled={isLoading}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setShowModal(false);
                resetForm();
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
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </UniversalModal>
      
      {/* Modal de confirmación de eliminación usando UniversalModal */}
      <UniversalModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteCategory}
        onConfirm={confirmDeleteCategory}
        type="delete"
        title="Eliminar Categoría"
        message="¿Estás seguro de que deseas eliminar esta categoría?"
        itemName={categoryToDelete?.name || ""}
        isLoading={isLoading}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default CategoriesPage;