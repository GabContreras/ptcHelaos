// ProductsCard.jsx - Componente para mostrar información de productos
import React, { useState } from 'react';
import './ProductsCard.css';

const ProductsCard = ({ data, onEdit, onDelete, isLoading }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Extraer información del producto
  const {
    _id,
    name = 'Sin nombre',
    categoryId,
    description = 'Sin descripción',
    images = [],
    available = true,
    preparationTime,
    basePrice = 0,
    createdAt
  } = data || {};

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getCategoryName = () => {
    if (typeof categoryId === 'object' && categoryId?.name) {
      return categoryId.name;
    }
    return 'Sin categoría';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const getImageUrl = () => {
    if (images.length > 0 && images[currentImageIndex]?.url) {
      return images[currentImageIndex].url;
    }
    // Placeholder image - you can replace this with your actual placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjAgODBIMTgwVjEyMEgxMjBWODBaIiBmaWxsPSIjRDBEMEQwIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjQTBBMEEwIi8+CjxwYXRoIGQ9Ik0xMzAgMTEwTDE0MCABQ0wxNTAgMTEwSDE0MEgxMzBaIiBmaWxsPSIjQTBBMEEwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTEwIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbjwvdGV4dD4KPC9zdmc+';
  };

  return (
    <div className={`product-card ${!available ? 'unavailable' : ''}`}>
      {/* Imagen del producto */}
      <div className="product-image-container">
        <img 
          src={getImageUrl()} 
          alt={name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjAgODBIMTgwVjEyMEgxMjBWODBaIiBmaWxsPSIjRDBEMEQwIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjQTBBMEEwIi8+CjxwYXRoIGQ9Ik0xMzAgMTEwTDE0MCABQ0wxNTAgMTEwSDE0MEgxMzBaIiBmaWxsPSIjQTBBMEEwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTEwIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbjwvdGV4dD4KPC9zdmc+';
          }}
        />
        
        {/* Navegación de imágenes */}
        {images.length > 1 && (
          <>
            <button 
              className="image-nav-btn prev-btn"
              onClick={prevImage}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button 
              className="image-nav-btn next-btn"
              onClick={nextImage}
              aria-label="Siguiente imagen"
            >
              ›
            </button>
            
            {/* Indicadores de imagen */}
            <div className="image-indicators">
              {images.map((_, index) => (
                <span 
                  key={index}
                  className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => goToImage(index, e)}
                />
              ))}
            </div>
          </>
        )}

        {/* Estado de disponibilidad */}
        <div className={`availability-badge ${available ? 'available' : 'unavailable'}`}>
          {available ? 'Disponible' : 'No disponible'}
        </div>
      </div>

      {/* Contenido del producto */}
      <div className="product-content">
        <div className="product-header">
          <h3 className="product-name">{name}</h3>
          <div className="product-category">
            <span className="category-badge">{getCategoryName()}</span>
          </div>
        </div>

        <p className="product-description">{description}</p>

        <div className="product-details">
          <div className="product-price">
            <span className="price-label">Precio:</span>
            <span className="price-value">{formatPrice(basePrice)}</span>
          </div>
          
          {preparationTime && (
            <div className="product-prep-time">
              <span className="prep-time-label">Tiempo:</span>
              <span className="prep-time-value">{preparationTime}</span>
            </div>
          )}
        </div>

        <div className="product-actions">
          <button 
            className="edit-btn"
            onClick={handleEdit}
            disabled={isLoading}
            title="Editar producto"
          >
            ✏️
          </button>
          <button 
            className="delete-btn"
            onClick={handleDelete}
            disabled={isLoading}
            title="Eliminar producto"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;