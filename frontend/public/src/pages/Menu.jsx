import React, { createContext ,useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronDown, X, ArrowLeft, ArrowRight, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/Menu.css';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { usePublicProducts } from '../hooks/MenuHook/usePublicProducts';

const Menu = () => {
  // Hook para productos públicos (mantener tu lógica existente)
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

  const handleAddToCart = () => {
    addToCart({
      product: selectedItem,
      customization: needsCustomization(selectedItem.name) ? customization : null,
      totalPrice: needsCustomization(selectedItem.name) ? calculateTotalPrice() : selectedItem.basePrice,
      timestamp: new Date().toISOString()
    });
    closeModal();
  };

  // Estado para el carrusel de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Datos de personalización
  const rollIceSizes = [
    { id: 1, name: "Un Sabor (Pequeño)", price: 3.00, maxFlavors: 1 },
    { id: 2, name: "Dos Sabores (Mediano)", price: 3.50, maxFlavors: 2 },
    { id: 3, name: "Tres Sabores (Grande)", price: 4.00, maxFlavors: 3 }
  ];

  const crepeSizes = [
    { id: 1, name: "Un Sabor (Pequeño)", price: 4.00, maxFlavors: 1 },
    { id: 2, name: "Dos Sabores (Mediano)", price: 4.50, maxFlavors: 2 },
    { id: 3, name: "Tres Sabores (Grande)", price: 5.00, maxFlavors: 3 }
  ];

  const coneIceRollSizes = [
    { id: 1, name: "Un Sabor (Pequeño)", price: 3.50, maxFlavors: 1 },
    { id: 2, name: "Dos Sabores (Mediano)", price: 4.00, maxFlavors: 2 },
    { id: 3, name: "Tres Sabores (Grande)", price: 4.50, maxFlavors: 3 }
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

  // Función para obtener imágenes del producto (mantener tu lógica existente)
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

  // Función para cambiar imagen en el carrusel (mantener tu lógica existente)
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

  // Funciones del modal (actualizar para incluir personalización)
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
    // Si es un producto con sabor fijo, saltar directamente a selección de sabores
    if (hasFixedFlavor(selectedItem.name)) {
      setCustomizationStep(1);
    } else {
      setCustomizationStep(0);
    }
  };

  // Función para manejar la búsqueda (mantener tu lógica existente)
  const handleSearch = (e) => {
    filterBySearch(e.target.value);
  };

  // Función para formatear precio (mantener tu lógica existente)
  const formatPrice = (basePrice) => {
    if (typeof basePrice === 'number') {
      return basePrice.toFixed(2);
    }
    if (typeof basePrice === 'string' && !isNaN(parseFloat(basePrice))) {
      return parseFloat(basePrice).toFixed(2);
    }
    return 'N/A';
  };

  // NUEVAS FUNCIONES PARA EL SISTEMA DE PERSONALIZACIÓN

  // Determinar si un producto necesita personalización
  const needsCustomization = (productName) => {
    const customizableProducts = [
      'Helado de Rollo',
      'Crepas', 
      'Cono con Helados de Rollo',
      'Mini Donitas',
      'Wafles'
    ];
    return customizableProducts.includes(productName);
  };

  // Obtener opciones de tamaño según el producto
  const getSizeOptions = (productName) => {
    switch (productName) {
      case 'Helado de Rollo':
        return rollIceSizes;
      case 'Crepas':
        return crepeSizes;
      case 'Cono con Helados de Rollo':
        return coneIceRollSizes;
      default:
        return [];
    }
  };

  // Determinar si un producto tiene sabor fijo (Mini Donitas y Wafles)
  const hasFixedFlavor = (productName) => {
    return ['Mini Donitas', 'Wafles'].includes(productName);
  };

  // Funciones de personalización
  const selectSize = (size) => {
    setCustomization(prev => ({ ...prev, size, flavors: [] }));
    setCustomizationStep(1);
  };

  const toggleFlavor = (flavor) => {
    setCustomization(prev => {
      const currentFlavors = prev.flavors;
      const maxFlavors = hasFixedFlavor(selectedItem.name) ? 1 : prev.size?.maxFlavors || 1;
      
      if (currentFlavors.includes(flavor)) {
        return {
          ...prev,
          flavors: currentFlavors.filter(f => f !== flavor)
        };
      } else if (currentFlavors.length < maxFlavors) {
        return {
          ...prev,
          flavors: [...currentFlavors, flavor]
        };
      }
      return prev;
    });
  };

  const toggleTopping = (topping) => {
    setCustomization(prev => ({
      ...prev,
      toppings: prev.toppings.includes(topping)
        ? prev.toppings.filter(t => t !== topping)
        : [...prev.toppings, topping]
    }));
  };

  const nextStep = () => {
    if (customizationStep < 2) {
      setCustomizationStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (customizationStep > 0) {
      setCustomizationStep(prev => prev - 1);
    }
  };

  // Calcular precio total
  const calculateTotalPrice = () => {
    let total = 0;
    
    if (hasFixedFlavor(selectedItem.name)) {
      total = selectedItem.basePrice;
    } else if (customization.size) {
      total = customization.size.price;
    } else {
      total = selectedItem.basePrice;
    }
    
    // Agregar precio de toppings
    total += customization.toppings.length * 0.25;
    
    return total;
  };

  // Verificar si se puede continuar al siguiente paso
  const canProceedToNextStep = () => {
    switch (customizationStep) {
      case 0:
        return hasFixedFlavor(selectedItem.name) || customization.size !== null;
      case 1:
        const maxFlavors = hasFixedFlavor(selectedItem.name) ? 1 : customization.size?.maxFlavors || 1;
        return customization.flavors.length === maxFlavors;
      case 2:
        return true;
      default:
        return false;
    }
  };

  // Función para agregar al carrito
  /* const addToCart = () => {
    const orderDetails = {
      product: selectedItem,
      customization: customization,
      totalPrice: calculateTotalPrice(),
      timestamp: new Date().toISOString()
    };
    
    console.log('Agregando al carrito:', orderDetails);
    // Aquí puedes implementar la lógica para agregar al carrito
    // Por ejemplo, llamar a una función de tu hook o contexto de carrito
    alert('Producto agregado al carrito exitosamente!');
    closeModal();
  };*/

  // Renderizar componente de imagen con carrusel (mantener tu lógica existente)
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

  // NUEVA FUNCIÓN PARA RENDERIZAR LOS PASOS DE PERSONALIZACIÓN
  const renderCustomizationStep = () => {
    if (!selectedItem) return null;

    const isFixedFlavor = hasFixedFlavor(selectedItem.name);
    const sizeOptions = getSizeOptions(selectedItem.name);

    switch (customizationStep) {
      case 0:
        // Paso 1: Seleccionar tamaño (solo para productos que lo requieren)
        if (isFixedFlavor) {
          // Para productos con sabor fijo, saltar directamente a selección de sabores
          return <div className="customization-loading">Cargando...</div>;
        }
        
        return (
          <div className="customization-step">
            <div className="step-header">
              <h3 className="step-title">Elige tu tamaño</h3>
              <p className="step-description">Selecciona el tamaño que prefieras</p>
            </div>
            
            <div className="size-options-grid">
              {sizeOptions.map((size) => (
                <div
                  key={size.id}
                  onClick={() => selectSize(size)}
                  className={`size-option ${customization.size?.id === size.id ? 'selected' : ''}`}
                >
                  <div className="size-option-content">
                    <h4 className="size-name">{size.name}</h4>
                    <p className="size-price">${size.price.toFixed(2)}</p>
                    <p className="size-info">
                      Hasta {size.maxFlavors} {size.maxFlavors === 1 ? 'sabor' : 'sabores'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {customization.size && (
              <div className="step-actions">
                <button onClick={nextStep} className="btn-continue">
                  Continuar
                </button>
              </div>
            )}
          </div>
        );

      case 1:
        // Paso 2: Seleccionar sabores
        const maxFlavors = isFixedFlavor ? 1 : customization.size?.maxFlavors || 1;
        const selectedFlavorsCount = customization.flavors.length;
        
        return (
          <div className="customization-step">
            <div className="step-header">
              <h3 className="step-title">Elige tus sabores</h3>
              <p className="step-description">
                Selecciona {maxFlavors === 1 ? '1 sabor' : `hasta ${maxFlavors} sabores`}
              </p>
              <div className="flavor-counter">
                {selectedFlavorsCount} de {maxFlavors} sabores seleccionados
              </div>
            </div>
            
            <div className="flavors-grid">
              {flavors.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => toggleFlavor(flavor)}
                  disabled={!customization.flavors.includes(flavor) && selectedFlavorsCount >= maxFlavors}
                  className={`flavor-option ${
                    customization.flavors.includes(flavor) ? 'selected' : ''
                  } ${!customization.flavors.includes(flavor) && selectedFlavorsCount >= maxFlavors ? 'disabled' : ''}`}
                >
                  {flavor}
                </button>
              ))}
            </div>
            
            <div className="step-actions">
              {!isFixedFlavor && (
                <button onClick={prevStep} className="btn-back">
                  Atrás
                </button>
              )}
              
              {canProceedToNextStep() && (
                <button onClick={nextStep} className="btn-continue">
                  Continuar
                </button>
              )}
            </div>
          </div>
        );

      case 2:
        // Paso 3: Seleccionar toppings y resumen
        return (
          <div className="customization-step">
            <div className="step-header">
              <h3 className="step-title">Agrega toppings</h3>
              <p className="step-description">Cada topping cuesta $0.25 adicional</p>
            </div>
            
            <div className="toppings-grid">
              {toppings.map((topping) => (
                <button
                  key={topping}
                  onClick={() => toggleTopping(topping)}
                  className={`topping-option ${customization.toppings.includes(topping) ? 'selected' : ''}`}
                >
                  {topping} (+$0.25)
                </button>
              ))}
            </div>
            
            {/* Resumen del pedido */}
            <div className="order-summary">
              <h4 className="summary-title">Resumen de tu pedido</h4>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label">Producto:</span>
                  <span className="summary-value">{selectedItem.name}</span>
                </div>
                
                {customization.size && (
                  <div className="summary-row">
                    <span className="summary-label">Tamaño:</span>
                    <span className="summary-value">{customization.size.name}</span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span className="summary-label">Sabores:</span>
                  <span className="summary-value">{customization.flavors.join(', ')}</span>
                </div>
                
                {customization.toppings.length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Toppings:</span>
                    <span className="summary-value">{customization.toppings.join(', ')}</span>
                  </div>
                )}
                
                <div className="summary-divider"></div>
                
                <div className="summary-row">
                  <span className="summary-label">Precio base:</span>
                  <span className="summary-value">
                    ${isFixedFlavor ? formatPrice(selectedItem.basePrice) : formatPrice(customization.size?.price || 0)}
                  </span>
                </div>
                
                {customization.toppings.length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Toppings ({customization.toppings.length}):</span>
                    <span className="summary-value">${(customization.toppings.length * 0.25).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-row">
                  <span className="summary-label">Total:</span>
                  <span className="summary-value">${calculateTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="step-actions">
              <button onClick={prevStep} className="btn-back">
                Atrás
              </button>
              
              <button onClick={handleAddToCart} className="btn-add-to-cart">
                Agregar al carrito - ${calculateTotalPrice().toFixed(2)}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
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
                        if (needsCustomization(selectedItem.name)) {
                          setIsCustomizing(true);
                        } else {
                          addToCart({
                            product: selectedItem,
                            customization: null,
                            totalPrice: selectedItem.basePrice,
                            timestamp: new Date().toISOString()
                          });
                          closeModal();
                        }
                      }}
                    >
                      {needsCustomization(selectedItem.name) ? 'Personalizar producto' : 'Añadir al carrito'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="customization-modal">
                  <div className="customization-header">
                    <h1 className="customization-main-title">
                      Personaliza tu {selectedItem.name}
                    </h1>
                  </div>
                  
                  {renderCustomizationStep()}

                  <div className="step-actions mt-4">
                    <button 
                      className="action-btn"
                      onClick={() => {
                        if (needsCustomization(selectedItem.name)) {
                          setIsCustomizing(true);
                        } else {
                          handleAddToCart();
                        }
                      }}
                    >
                      {needsCustomization(selectedItem.name) ? 'Personalizar producto' : 'Añadir al carrito'}
                    </button>
                  </div>
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