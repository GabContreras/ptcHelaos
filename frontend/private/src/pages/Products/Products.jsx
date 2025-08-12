import React, { useEffect, useState } from "react";
import { useProductsManager } from "../../hooks/ProductsHook/useProduct";
import ProductsCard from "../../components/Cards/ProductsCard/ProductsCard";
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal";
import toast, { Toaster } from "react-hot-toast";
import "./Products.css";

const ProductsPage = () => {
  const {
    // Estados principales
    products,
    categories,
    showModal,
    setShowModal,
    showDeleteModal,
    productToDelete,
    isLoading,
    error,
    success,
    setError,
    isEditing,
    currentProductId,

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
    imagePreview,

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
  } = useProductsManager();

  // Estados locales para filtros y visualización
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("name-asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAvailable, setFilterAvailable] = useState("all");

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Función para filtrar productos
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (filterCategory) {
      filtered = filtered.filter((product) => {
        const prodCategoryId =
          typeof product.categoryId === "object"
            ? product.categoryId._id
            : product.categoryId;
        return prodCategoryId === filterCategory;
      });
    }

    // Filtro por disponibilidad
    if (filterAvailable !== "all") {
      const isAvailable = filterAvailable === "available";
      filtered = filtered.filter(
        (product) => product.available === isAvailable
      );
    }

    return filtered;
  };

  // Función para ordenar productos
  const getSortedProducts = (productsToSort) => {
    const sorted = [...productsToSort];

    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      case "name-desc":
        return sorted.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
      case "price-asc":
        return sorted.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
      case "price-desc":
        return sorted.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
      default:
        return sorted;
    }
  };

  // Obtener productos procesados
  const getProcessedProducts = () => {
    const filtered = getFilteredProducts();
    return getSortedProducts(filtered);
  };

  const processedProducts = getProcessedProducts();

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = processedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage, filterCategory, filterAvailable]);

  // Mostrar notificaciones
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);

  return (
    <div className="products-page">
      {/* Controles de filtros */}
      <div className="products-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-section">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">No disponibles</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
            <option value="price-asc">Precio menor</option>
            <option value="price-desc">Precio mayor</option>
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
          </select>
        </div>
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Cargando productos...</span>
        </div>
      )}

      {/* Información de resultados */}
      {!isLoading && (
        <div className="results-info">
          <span>
            Mostrando {currentProducts.length} de {processedProducts.length}{" "}
            productos
            {(searchTerm || filterCategory || filterAvailable !== "all") &&
              ` (filtrados de ${products.length} total)`}
          </span>
        </div>
      )}

      {/* Grid de productos */}
      <div className="products-grid">
        {currentProducts.length > 0
          ? currentProducts.map((product) => (
              <ProductsCard
                key={product._id}
                data={product}
                onEdit={() => handleEditProduct(product)}
                onDelete={() => startDeleteProduct(product._id)}
                isLoading={isLoading}
              />
            ))
          : !isLoading && (
              <div className="no-data-message">
                {searchTerm || filterCategory || filterAvailable !== "all" ? (
                  <>
                    <p>No se encontraron productos con los filtros aplicados</p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterCategory("");
                        setFilterAvailable("all");
                      }}
                      className="btn btn-secondary"
                    >
                      Limpiar filtros
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      No hay productos registrados. Agrega el primer producto.
                    </p>
                  </>
                )}
              </div>
            )}

        {/* Botón de agregar */}
        {!isLoading && (
          <div className="add-product-card" onClick={handleAddNew}>
            <div className="add-product-content">
              <div className="add-icon">+</div>
              <span className="add-text">Agregar Producto</span>
            </div>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Anterior
          </button>

          <span className="pagination-info">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de edición/creación */}
      <UniversalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        type="form"
        title={isEditing ? "Editar Producto" : "Nuevo Producto"}
        size="large"
      >
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nombre del Producto</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del producto"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">Categoría</label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isLoading}
                required
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "12px",
                  background: "#8B7CF6",
                  border: "none",
                  color: "white",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción del producto"
                disabled={isLoading}
                required
                rows="3"
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "12px",
                  background: "#8B7CF6",
                  border: "none",
                  color: "white",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "vertical",
                  minHeight: "100px",
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="preparationTime">Tiempo de Preparación</label>
              <input
                type="text"
                id="preparationTime"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                placeholder="ej: 10-15 min"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="basePrice">Precio Base ($)</label>
              <input
                type="number"
                id="basePrice"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="0.00"
                disabled={isLoading}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                Producto Disponible
              </label>
            </div>

            <div className="form-group full-width">
              <label htmlFor="images">
                Imágenes del Producto {!isEditing && "(Requerido)"}
              </label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={isLoading}
                key={selectedImages.length} // Force re-render when images change
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "12px",
                  background: "#8B7CF6",
                  border: "none",
                  color: "white",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              <small
                style={{
                  color: "#666",
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                  display: "block",
                }}
              >
                Máximo 5 imágenes. Formatos: JPG, PNG, WebP. Tamaño máximo: 5MB
                por imagen.
                {selectedImages.length > 0 &&
                  ` (${selectedImages.length}/5 seleccionadas)`}
              </small>
            </div>

            {/* Preview de imágenes */}
            {imagePreview.length > 0 && (
              <div className="form-group full-width">
                <label>Vista Previa de Imágenes</label>
                <div className="image-preview-grid">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImagePreview(index)}
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading
                ? "Guardando..."
                : isEditing
                ? "Actualizar"
                : "Guardar"}
            </button>
          </div>
        </form>
      </UniversalModal>

      {/* Modal de confirmación de eliminación */}
      <UniversalModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteProduct}
        onConfirm={confirmDeleteProduct}
        type="delete"
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto?"
        itemName={productToDelete?.name || ""}
        isLoading={isLoading}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default ProductsPage;
