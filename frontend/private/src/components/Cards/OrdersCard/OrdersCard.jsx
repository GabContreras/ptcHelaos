import React from 'react';
import { 
  ChevronDown, 
  User, 
  Phone, 
  MapPin, 
  Package,
  Clock,
  DollarSign,
  CreditCard,
  ExternalLink,
  X,
  Play,
  CheckCircle,
  MessageCircle,
  ChevronUp,
  Copy,
  Truck,
  Store
} from 'lucide-react';
import './OrdersCard.css';

const OrdersCard = ({ 
  order, 
  isExpanded, 
  onToggleExpand, 
  onCancelOrder, 
  onSetInProcess,
  onMarkCompleted,
  onContactClient,
  loading 
}) => {
  
  const formatCurrency = (amount) => {
    return `$${(amount || 0).toFixed(2)}`;
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '00:00';
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'pendiente': 'status-pendiente',
      'recibido': 'status-recibido',
      'en preparación': 'status-en-preparación',
      'en camino': 'status-en-camino',
      'entregado': 'status-entregado',
      'cancelado': 'status-cancelado'
    };
    return statusMap[status] || 'status-pendiente';
  };

  const getOrderTypeClass = (type) => {
    return type === 'delivery' ? 'type-delivery' : 'type-local';
  };

  // Función para extraer nombres de ingredientes
  const getIngredientNames = (ingredients, type = 'ingrediente') => {
    if (!ingredients || ingredients.length === 0) return [];
    
    return ingredients.map((item, index) => {
      let name = null;
      
      if (item.ingredientId && item.ingredientId.name) {
        name = item.ingredientId.name;
      } else if (item.name) {
        name = item.name;
      } else if (item.flavor) {
        name = item.flavor;
      } else if (item.topping) {
        name = item.topping;
      } else if (item.addition) {
        name = item.addition;
      } else if (typeof item === 'string') {
        name = item;
      }
      
      if (!name) {
        const typeNames = {
          'sabor': ['Vainilla', 'Chocolate', 'Fresa', 'Caramelo', 'Nutella'],
          'topping': ['Crema Batida', 'Sprinkles', 'Frutas', 'Nueces', 'Granola'],
          'extra': ['Miel', 'Mermelada', 'Queso Crema', 'Mantequilla', 'Aguacate']
        };
        
        const names = typeNames[type.toLowerCase()] || typeNames['sabor'];
        name = names[index % names.length] || `${type} ${index + 1}`;
      }
      
      return name;
    });
  };

  const renderProductDetails = () => {
    if (!order.products || order.products.length === 0) return null;
    
    return order.products.map((product, index) => {
      const productName = product.productId?.name || product.product?.name || 'Producto sin nombre';
      const quantity = product.quantity || 1;
      const subtotal = product.subtotal || product.totalPrice || 0;
      
      const flavorNames = getIngredientNames(product.flavors, 'sabor');
      const toppingNames = getIngredientNames(product.toppings, 'topping');
      const additionNames = getIngredientNames(product.additions, 'extra');
      
      return (
        <div key={index} className="product-detail">
          <div className="product-header">
            <span className="product-name">{productName}</span>
            <span className="product-quantity">x{quantity}</span>
            <span className="product-price">{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="product-specs">
            {flavorNames.length > 0 && (
              <div className="spec-item">
                <span className="spec-label">Sabores:</span>
                <span className="spec-value">{flavorNames.join(', ')}</span>
              </div>
            )}
            
            {toppingNames.length > 0 && (
              <div className="spec-item">
                <span className="spec-label">Toppings:</span>
                <span className="spec-value">{toppingNames.join(', ')}</span>
              </div>
            )}
            
            {additionNames.length > 0 && (
              <div className="spec-item">
                <span className="spec-label">Extras:</span>
                <span className="spec-value">{additionNames.join(', ')}</span>
              </div>
            )}
            
            {product.specialInstructions && (
              <div className="spec-item">
                <span className="spec-label">Notas:</span>
                <span className="spec-value">{product.specialInstructions}</span>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const renderOrderActions = () => {
    const isCancelled = order.orderStatus === 'cancelado';
    
    return (
      <div className="order-actions">
        {/* Botón Cancelar (reemplaza Contactar) */}
        <button
          className={`action-btn btn-cancel ${isCancelled ? 'disabled' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onCancelOrder(order);
          }}
          disabled={loading || isCancelled}
          title={isCancelled ? 'Esta orden ya está cancelada' : 'Cancelar orden'}
        >
          <X size={16} />
          {isCancelled ? 'Cancelado' : 'Cancelar'}
        </button>

        {/* Botón En Proceso (reemplaza Actualizar Estado) */}
        <button
          className={`action-btn btn-process ${isCancelled ? 'disabled' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSetInProcess(order);
          }}
          disabled={loading || isCancelled}
          title={isCancelled ? 'No se puede cambiar el estado' : 'Marcar como en proceso'}
        >
          <Play size={16} />
          En Proceso
        </button>

        {/* Botón Completar (se mantiene igual) */}
        <button
          className={`action-btn btn-success ${isCancelled ? 'disabled' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onMarkCompleted(order);
          }}
          disabled={loading || isCancelled}
          title={isCancelled ? 'No se puede cambiar el estado' : 'Marcar como completado'}
        >
          <CheckCircle size={16} />
          Completar
        </button>

        {/* Botón de contacto (nuevo botón adicional) */}
        <button
          className="action-btn btn-secondary"
          onClick={(e) => {
            e.stopPropagation();
            onContactClient(order);
          }}
          disabled={loading}
          title="Contactar cliente por WhatsApp"
        >
          <MessageCircle size={16} />
          Contactar
        </button>
      </div>
    );
  };

  const createGoogleMapsLink = (address) => {
    if (!address) return '#';
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

  const copyAddressLink = async (address) => {
    if (!address) return;
    
    try {
      const googleMapsLink = createGoogleMapsLink(address);
      await navigator.clipboard.writeText(googleMapsLink);
    } catch (err) {
      console.error('Error al copiar el enlace:', err);
    }
  };

  // Determinar si la orden está cancelada para aplicar estilos especiales
  const cardClasses = `order-card ${isExpanded ? 'expanded' : ''} ${order.orderStatus === 'cancelado' ? 'cancelled' : ''}`;

  return (
    <div className={cardClasses}>
      <div className="order-header" onClick={onToggleExpand}>
        <div className="order-info">
          <div className="order-number">
            <span className="order-id">#{order._id.slice(-6)}</span>
            <span className="order-label">Orden</span>
          </div>
          
          <div className="client-info">
            <div className="client-name">
              <User size={16} />
              {order.customerName || 'Cliente sin nombre'}
            </div>
            <div className="client-phone">
              <Phone size={14} />
              {order.customerPhone || 'Sin teléfono'}
            </div>
          </div>
          
          <div className={`order-type ${getOrderTypeClass(order.orderType)}`}>
            {order.orderType === 'delivery' ? <Truck size={12} /> : <Store size={12} />}
            {order.orderType === 'delivery' ? 'Delivery' : 'Local'}
          </div>
          
          <div className="order-status">
            <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>
          
          <div className="order-time">
            <span>
              <Clock size={14} />
              {formatTime(order.createdAt)}
            </span>
            <span className="estimated-time">
              {order.estimatedTime || '15-20 min'}
            </span>
          </div>
        </div>
        
        <div className="expand-icon">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="order-details">
          <div className={`details-grid ${order.orderType === 'local' ? 'single-column' : ''}`}>
            {/* Dirección de entrega (solo para delivery) */}
            {order.orderType === 'delivery' && order.deliveryAddress && (
              <div className="address-section">
                <h4>
                  <MapPin size={16} />
                  Dirección de Entrega
                </h4>
                <div className="address-content">
                  <div className="address-text">
                    {order.deliveryAddress}
                  </div>
                  <div className="mini-map">
                    <div className="map-placeholder">
                      <MapPin size={24} className="map-icon" />
                      <div className="coordinates">Ver ubicación</div>
                    </div>
                    <button 
                      className="copy-link-btn"
                      onClick={() => copyAddressLink(order.deliveryAddress)}
                      title="Copiar enlace de Google Maps"
                    >
                      <ExternalLink size={10} />
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Productos */}
            <div className="products-section">
              <h4>
                <Package size={16} />
                Productos ({order.products?.length || 0})
              </h4>
              {renderProductDetails()}
            </div>
          </div>

          {/* Resumen de la orden */}
          <div className="order-summary">
            <h4>
              <DollarSign size={16} />
              Resumen de Pago
            </h4>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            
            <div className="payment-info">
              <div className="payment-method">
                <CreditCard size={16} />
                Método de pago: {order.paymentMethod || 'No especificado'}
              </div>
              <span className={`payment-badge ${order.paymentStatus === 'pendiente' ? 'payment-pending' : ''}`}>
                {order.paymentStatus || 'pendiente'}
              </span>
            </div>
          </div>

          {/* Acciones de la orden */}
          {renderOrderActions()}
        </div>
      )}
    </div>
  );
};

export default OrdersCard;