import React, { createContext ,useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronDown, X, ArrowLeft, ArrowRight, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/Menu.css';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { usePublicProducts } from '../hooks/MenuHook/usePublicProducts';

const Menu = () => {
  // Hook para productos públicos
  const {
    products,
    filteredProducts,
    isLoading,
    error,
    searchTerm,
    filterBySearch,
    resetFilters,
    getProductById
  } = usePublicProducts();

  const {addToCart} = useCart();

  // Estados del modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizationStep, setCustomizationStep] = useState(0);
  const [customization, setCustomization] = useState({
    size: null,
    flavors: [],
    toppings: []
  });

  // Estado para el carrusel de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Datos de personalización
  const sizes = [
    { id: 1, name: "Un Sabor (Pequeño)", price: 6.99 },
    { id: 2, name: "Dos Sabores (Mediano)", price: 8.99 },
    { id: 3, name: "Tres Sabores (Grande)", price: 10.99 }
  ];

  const flavors = [
    "Vainilla", "Chocolate", "Fresa", "Matcha", "Cookies & Cream", 
    "Caramelo", "Mango", "Coco", "Piña", "Frambuesa"
  ];

  const toppings = [
    "Maní", "Pistacho", "Mango", "Crispy", "Jalea de mora", "Mora",
    "Galleta", "Jalea de chocolate", "Piña", "Pixie", "Nueces", "Jalea de piña",
    "Chocolate", "Almendras", "Jalea de Caramelo", "Jalea de Fresa", "Fresa", "Uva"
  ];

  // Función para obtener imágenes del producto
  const getProductImages = (product) => {
    if (!product) return ['/api/placeholder/300/200'];
    
    // Debug: mostrar estructura del producto en consola
    if (process.env.NODE_ENV === 'development') {
      console.log('Producto:', product.name, 'Images data:', product.images);
    }
    
    // Si el producto tiene un array de imágenes (formato: [{url: "...", _id: "..."}])
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const urls = product.images.map(img => {
        // Si es un objeto con propiedad url
        if (typeof img === 'object' && img.url) {
          return img.url;
        }
        // Si es directamente una string
        if (typeof img === 'string') {
          return img;
        }
        return '/api/placeholder/300/200';
      }).filter(url => url && url !== '/api/placeholder/300/200'); // Filtrar URLs válidas
      
      // Si encontramos URLs válidas, usarlas; sino, usar placeholder
      if (urls.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log('URLs extraídas:', urls);
        }
        return urls;
      }
    }
    
    // Si tiene una sola imagen (propiedad image)
    if (product.image) {
      return [product.image];
    }
    
    // Imagen por defecto
    return ['/api/placeholder/300/200'];
  };

  // Función para cambiar imagen en el carrusel
  const changeImage = (productId, direction) => {
    const product = filteredProducts.find(p => p._id === productId);
    const images = getProductImages(product);
    const currentIndex = currentImageIndex[productId] || 0;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: newIndex
    }));
  };

  // Funciones del modal
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setIsCustomizing(false);
    setCustomizationStep(0);
    setCustomization({ size: null, flavors: [], toppings: [] });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setIsCustomizing(false);
    setCustomizationStep(0);
    setCustomization({ size: null, flavors: [], toppings: [] });
  };

  const startCustomization = () => {
    setIsCustomizing(true);
    setCustomizationStep(0);
  };

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    filterBySearch(e.target.value);
  };

  // Función para formatear precio
  const formatPrice = (basePrice) => {
    if (typeof basePrice === 'number') {
      return basePrice.toFixed(2);
    }
    if (typeof basePrice === 'string' && !isNaN(parseFloat(basePrice))) {
      return parseFloat(basePrice).toFixed(2);
    }
    return 'N/A';
  };

  // Renderizar componente de imagen con carrusel
  const ImageCarousel = ({ product, isModal = false }) => {
    const images = getProductImages(product);
    const currentIndex = currentImageIndex[product._id] || 0;
    const hasMultipleImages = images.length > 1;

    const imageClass = isModal ? "modal-image" : "card-image";

    // Función para manejar error de imagen
    const handleImageError = (e, imageIndex) => {
      console.log(`Error loading image at index ${imageIndex}:`, images[imageIndex]);
      // Si la imagen principal falla, usar placeholder
      if (imageIndex === currentIndex) {
        e.target.src = '/api/placeholder/300/200';
      }
    };

    return (
      <div className={`${imageClass} image-carousel-container`}>
        <img 
          src={images[currentIndex]} 
          alt={`${product.name} - imagen ${currentIndex + 1}`}
          onError={(e) => handleImageError(e, currentIndex)}
          loading="lazy"
        />
        
        {hasMultipleImages && (
          <>
            <button 
              className="image-nav-btn image-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                changeImage(product._id, 'prev');
              }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={18} />
            </button>
            
            <button 
              className="image-nav-btn image-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                changeImage(product._id, 'next');
              }}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={18} />
            </button>
            
            <div className="image-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`image-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => ({
                      ...prev,
                      [product._id]: index
                    }));
                  }}
                  aria-label={`Ver imagen ${index + 1} de ${images.length}`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Contador de imágenes */}
        {hasMultipleImages && (
          <div className="image-counter">
            {currentIndex + 1}/{images.length}
          </div>
        )}
      </div>
    );
  };

  // Placeholder para renderCustomizationStep (mantén tu lógica existente)
  const renderCustomizationStep = () => {
    return (
      <div className="customization-step">
        <p>Aquí va tu lógica de personalización existente</p>
      </div>
    );
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Nuestro menú</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-400 mx-auto rounded-full"></div>
          </div>
          
          {/* Barra de búsqueda profesional y limpia */}
          <div className="mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button
                      onClick={resetFilters}
                      className="search-clear-btn"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                {/* Indicador de resultados */}
                {searchTerm && (
                  <div className="search-results-indicator">
                    <Filter size={16} />
                    <span>
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Botón para limpiar filtros */}
              {searchTerm && (
                <div className="text-center mt-4">
                  <button
                    onClick={resetFilters}
                    className="clear-filters-btn"
                  >
                    Ver todos los productos
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Estado de carga */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="loading-spinner"></div>
              <p className="mt-2 text-gray-600">Cargando productos...</p>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Mensaje cuando no hay productos */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="no-products-message">
              <p>
                {searchTerm 
                  ? 'No se encontraron productos que coincidan con tu búsqueda.' 
                  : 'No hay productos disponibles en este momento.'}
              </p>
              {searchTerm && (
                <button
                  onClick={resetFilters}
                  className="show-all-btn"
                >
                  Ver todos los productos
                </button>
              )}
            </div>
          )}

          {/* Grid de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <div key={item._id} className="menu-card">
                <ImageCarousel product={item} />
                <div className="card-content">
                  <h3 className="card-title">{item.name}</h3>
                  <p className="card-description">{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-purple-600">
                      ${formatPrice(item.basePrice)}
                    </span>
                    </div>
                    <div>
                    <button 
                      className="view-more-btn" 
                      onClick={() => openModal(item)}
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {isModalOpen && selectedItem && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>
                
                {!isCustomizing ? (
                  <div className="modal-body">
                    <ImageCarousel product={selectedItem} isModal={true} />
                    
                    <div className="modal-info">
                      <h2 className="modal-title">{selectedItem.name}</h2>
                      
                      <div className="modal-section">
                        <h3 className="modal-subtitle">Descripción:</h3>
                        <p className="modal-description">
                          {selectedItem.fullDescription || selectedItem.description}
                        </p>
                      </div>
                      
                      <div className="modal-section">
                        <h3 className="modal-subtitle">Precio:</h3>
                        <p className="modal-price">
                          ${formatPrice(selectedItem.basePrice)}
                        </p>
                      </div>
                      
                      <button 
                        className="action-btn"
                        onClick={() => {
                          addToCart(selectedItem);
                          closeModal();
                          //selectedItem.isSpecial ? startCustomization : closeModal
                        }}
                      >
                        {selectedItem.isSpecial ? 'Personalizar producto' : 'Añadir al carrito'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="customization-modal">
                    <div className="customization-header">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Personaliza tu {selectedItem.name}
                      </h1>
                    </div>
                    {renderCustomizationStep()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Menu;