import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { Cookie, IceCream, Layers, Sandwich, Plus, ShoppingCart, CreditCard, MapPin, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useOrder } from '../../hooks/OrdersHook/useOrder';
import { useOrderInventory } from '../../hooks/OrderInventoryHook/useOrderInventory';
import UniversalModal from '../../components/Modals/UniversalModal/UniversalModal';
import CustomizationModal from '../../components/Modals/CustomizationModal/CustomizationModal';
import CheckoutModal from '../../components/Modals/CheckoutModal/CheckoutModal';
import './TomaDeOrdenes.css';

const TomaDeOrdenes = () => {
  const {
    // Estados principales
    products,
    categories,
    cart,
    loading,
    error,
    success,
    setSuccess,

    // Estados de modal simplificados
    selectedProduct,
    showCustomizationModal,
    
    // Funciones principales
    fetchProducts,
    getFilteredProducts,
    openCustomizationModal,
    closeCustomizationModal,
    addToCart,
    removeFromCart,
    getCartTotal,
    clearCart,
    createOrder,
    clearMessages
  } = useOrder();

  // Hook para inventario real
  const {
    getFlavorNames,
    getToppingNames,
    getFlavorExtraPrice,
    getToppingExtraPrice,
    isFlavorAvailable,
    isToppingAvailable,
    isLoading: inventoryLoading,
    error: inventoryError
  } = useOrderInventory();

  // Estados locales para otros modales
  const [activeTab, setActiveTab] = React.useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  
  const activeTabRef = useRef(activeTab);

  // Cargar productos al montar
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Establecer primera categoría como activa
  useEffect(() => {
    if (categories.length > 0 && !activeTabRef.current) {
      const firstCategoryId = categories[0]._id;
      setActiveTab(firstCategoryId);
      activeTabRef.current = firstCategoryId;
    }
  }, [categories]);

  // Obtener icono de categoría
  const getCategoryIcon = useCallback((categoryName) => {
    const normalizedName = categoryName?.toLowerCase();
    
    if (normalizedName?.includes('waffle')) return Cookie;
    if (normalizedName?.includes('helado')) return IceCream;
    if (normalizedName?.includes('pancake')) return Layers;
    if (normalizedName?.includes('pan')) return Sandwich;
    
    const icons = [Cookie, IceCream, Layers, Sandwich];
    const index = categories.findIndex(cat => cat.name === categoryName);
    return icons[index] || Cookie;
  }, [categories]);

  // Obtener productos de la categoría activa
  const activeProducts = useMemo(() => {
    if (!activeTab) return [];
    return getFilteredProducts(activeTab);
  }, [getFilteredProducts, activeTab]);

  // Manejar cambio de pestaña
  const handleTabChange = useCallback((categoryId) => {
    if (activeTabRef.current !== categoryId) {
      setActiveTab(categoryId);
      activeTabRef.current = categoryId;
    }
  }, []);

  // FUNCIÓN: Determinar si un producto necesita personalización
  const needsCustomization = useCallback((productName) => {
    // Solo "Helado de Rollo" necesita personalización
    return productName === 'Helado de Rollo';
  }, []);

  // FUNCIÓN: Agregar producto directamente al carrito (sin personalización)
  const addSimpleProductToCart = useCallback((product) => {
    // Usar el mismo formato que espera la función addToCart del hook
    const itemData = {
      product,
      customizations: {
        quantity: 1,
        specialInstructions: '',
        size: null,
        flavors: [],
        toppings: [],
        additions: [],
        sizeName: null,
        flavorNames: [],
        toppingNames: [],
        additionNames: []
      },
      totalPrice: product.basePrice
    };
    
    addToCart(itemData);
    
    // Mensaje de éxito personalizado
    clearMessages();
    setTimeout(() => {
      setSuccess && setSuccess(`${product.name} agregado al carrito`);
      setTimeout(() => setSuccess && setSuccess(''), 2000);
    }, 100);
  }, [addToCart, clearMessages, setSuccess]);

  // Manejar selección de producto
  const handleProductSelect = useCallback((product) => {
    clearMessages();
    
    if (needsCustomization(product.name)) {
      // Solo abrir modal de personalización para Helado de Rollo
      openCustomizationModal(product);
    } else {
      // Agregar directamente al carrito
      addSimpleProductToCart(product);
    }
  }, [clearMessages, needsCustomization, openCustomizationModal, addSimpleProductToCart]);

  // Crear opciones de personalización dinámicas usando inventario real
  const dynamicCustomizationOptions = useMemo(() => {
    const flavors = getFlavorNames();
    const toppings = getToppingNames();
    
    return {
      sizes: [
        { id: 'small', name: 'Un Sabor (Pequeño)', price: 3.00, maxFlavors: 1 },
        { id: 'medium', name: 'Dos Sabores (Mediano)', price: 3.50, maxFlavors: 2 },
        { id: 'large', name: 'Tres Sabores (Grande)', price: 4.00, maxFlavors: 3 }
      ],
      flavors: flavors.map((flavorName, index) => ({
        id: `flavor_${index}`,
        name: flavorName,
        price: getFlavorExtraPrice(flavorName),
        available: isFlavorAvailable(flavorName)
      })),
      toppings: toppings.map((toppingName, index) => ({
        id: `topping_${index}`,
        name: toppingName,
        price: getToppingExtraPrice(toppingName),
        available: isToppingAvailable(toppingName)
      })),
      additions: [
        { id: 'butter', name: 'Mantequilla', price: 0.50 },
        { id: 'honey', name: 'Miel', price: 0.70 },
        { id: 'jam', name: 'Mermelada', price: 0.80 },
        { id: 'cheese', name: 'Queso Crema', price: 1.20 },
        { id: 'ham', name: 'Jamón', price: 1.60 },
        { id: 'avocado', name: 'Aguacate', price: 1.40 }
      ]
    };
  }, [getFlavorNames, getToppingNames, getFlavorExtraPrice, getToppingExtraPrice, isFlavorAvailable, isToppingAvailable]);

  // Callbacks para modales
  const handleCloseCheckoutModal = useCallback(() => {
    setShowCheckoutModal(false);
  }, []);

  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  const handleProceedToCheckout = useCallback(() => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    clearMessages();
    setShowCheckoutModal(true);
  }, [cart.length, clearMessages]);

  const handleCreateOrder = useCallback(async (orderData) => {
    const result = await createOrder(orderData);
    if (result.success) {
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
    }
  }, [createOrder]);

  // Modal de éxito
  const SuccessModal = React.memo(() => (
    <UniversalModal
      isOpen={showSuccessModal}
      onClose={handleCloseSuccessModal}
      type="success"
      title="¡Pedido Creado!"
      message="El pedido se ha registrado exitosamente y se ha enviado a cocina."
    />
  ), [showSuccessModal, handleCloseSuccessModal]);

  // Loading inicial
  if (loading && products.length === 0) {
    return (
      <div className="order-container">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <div className="main-content">
        {/* Mensajes de estado */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            {error}
            <button onClick={clearMessages} className="alert-close">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Mensaje de error de inventario */}
        {inventoryError && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            Error de inventario: {inventoryError}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={16} />
            {success}
            <button onClick={clearMessages} className="alert-close">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Mensaje de carga de inventario */}
        {inventoryLoading && (
          <div className="alert alert-info" style={{background: '#e3f2fd', color: '#1565c0', border: '1px solid #bbdefb'}}>
            <AlertCircle size={16} />
            Cargando sabores del inventario...
          </div>
        )}

        {/* Header con pestañas */}
        <div className="header-tabs">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.name);
            const isActive = activeTab === category._id;
            
            return (
              <button
                key={`tab-${category._id}`}
                className={`tab-button ${isActive ? 'active' : ''}`}
                onClick={() => handleTabChange(category._id)}
              >
                <IconComponent size={28} />
                <span className="tab-label">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Lista de productos */}
        <div className="products-section">
          <h2>Selecciona un producto</h2>
          {!activeTab ? (
            <div className="no-products">
              <p>Cargando categorías...</p>
            </div>
          ) : activeProducts.length === 0 ? (
            <div className="no-products">
              <p>No hay productos disponibles en esta categoría</p>
            </div>
          ) : (
            <div className="products-grid">
              {activeProducts.map((product) => (
                <div key={`product-${product._id}`} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.images?.[0]?.url || '/placeholder-product.jpg'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA2NUgxMTVWOTVIODVWNjVaIiBmaWxsPSIjRTJFOEYwIi8+PC9zdmc+';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-details">
                      <span className="product-price">${product.basePrice.toFixed(2)}</span>
                      <span className="product-time">{product.preparationTime}</span>
                    </div>
                  </div>
                  <button 
                    className="select-product-btn"
                    onClick={() => handleProductSelect(product)}
                    disabled={loading || inventoryLoading}
                  >
                    <Plus size={16} />
                    {needsCustomization(product.name) ? 'Personalizar' : 'Agregar al carrito'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón de checkout */}
        <div className="checkout-button-container">
          <button 
            className="checkout-btn"
            onClick={handleProceedToCheckout}
            disabled={cart.length === 0 || loading}
          >
            <ShoppingCart size={20} />
            Proceder al Pago ({cart.length} productos) - ${getCartTotal.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Resumen lateral */}
      <div className="summary-section">
        <h3>Resumen del Pedido</h3>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={48} />
            <p>Tu carrito está vacío</p>
            <small>Selecciona productos para comenzar</small>
          </div>
        ) : (
          <div className="cart-summary">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-summary">
                  <div className="item-header">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-quantity">x{item.customizations.quantity}</span>
                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="item-customizations">
                    {item.customizations.sizeName && (
                      <small>Tamaño: {item.customizations.sizeName}</small>
                    )}
                    {item.customizations.flavorNames.length > 0 && (
                      <small>Sabores: {item.customizations.flavorNames.join(', ')}</small>
                    )}
                    {item.customizations.toppingNames.length > 0 && (
                      <small>Toppings: {item.customizations.toppingNames.join(', ')}</small>
                    )}
                  </div>
                  <div className="item-price">${item.totalPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="cart-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${getCartTotal.toFixed(2)}</span>
              </div>
              <div className="total-row final-total">
                <strong>Total: ${getCartTotal.toFixed(2)}</strong>
              </div>
            </div>

            <div className="cart-actions">
              <button 
                className="clear-cart-btn"
                onClick={clearCart}
                disabled={loading}
              >
                Limpiar Carrito
              </button>
              <button 
                className="checkout-btn-sidebar"
                onClick={handleProceedToCheckout}
                disabled={loading}
              >
                <CreditCard size={16} />
                Pagar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <CustomizationModal
        isOpen={showCustomizationModal}
        onClose={closeCustomizationModal}
        product={selectedProduct}
        customizationOptions={dynamicCustomizationOptions} // USAR OPCIONES DINÁMICAS
        onAddToCart={addToCart}
        loading={loading || inventoryLoading}
      />
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={handleCloseCheckoutModal}
        cart={cart}
        onCreateOrder={handleCreateOrder}
        onRemoveFromCart={removeFromCart}
        loading={loading}
        error={error}
      />
      <SuccessModal />
    </div>
  );
};

export default TomaDeOrdenes;