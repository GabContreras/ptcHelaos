import React from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Copy,
  DollarSign,
  Check,
  X,
  Truck,
  Store,
  Edit
} from 'lucide-react';
import './OrdersCard.css';

const OrdersCard = ({ 
  order, 
  isExpanded, 
  onToggleExpand, 
  onStatusUpdate, 
  onContactClient,
  onMarkCompleted,
  loading = false 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'pendiente': '#f59e0b',
      'recibido': '#10b981',
      'en preparación': '#8b5cf6',
      'en camino': '#3b82f6',
      'entregado': '#6b7280',
      'cancelado': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pendiente': Clock,
      'recibido': Check,
      'en preparación': Package,
      'en camino': Truck,
      'entregado': Check,
      'cancelado': X
    };
    const IconComponent = icons[status] || Package;
    return <IconComponent size={16} />;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const MiniMap = ({ address }) => (
    <div className="mini-map">
      <div className="map-placeholder">
        <MapPin className="map-icon" size={20} />
        <div className="coordinates">
          Ver ubicación
        </div>
      </div>
      <button 
        className="copy-link-btn"
        onClick={() => navigator.clipboard.writeText(address)}
        title="Copiar dirección"
      >
        <Copy size={10} />
        copiar
      </button>
    </div>
  );

  // Función para renderizar productos de forma defensiva
  const renderProducts = () => {
    if (!order.products || order.products.length === 0) {
      return <p>No hay productos en esta orden</p>;
    }

    return order.products.map((product, index) => {
      // Manejar diferentes estructuras de datos
      const productName = product.productId?.name || product.product?.name || 'Producto desconocido';
      const quantity = product.quantity || 1;
      const subtotal = product.subtotal || product.totalPrice || 0;
      
      return (
        <div key={index} className="product-detail">
          <div className="product-header">
            <span className="product-name">{productName}</span>
            <span className="product-quantity">x{quantity}</span>
            <span className="product-price">{formatCurrency(subtotal)}</span>
          </div>
          <div className="product-specs">
            {/* Renderizar sabores si existen */}
            {product.flavors && product.flavors.length > 0 && (
              <div className="spec-item">
                <span className="spec-label">Sabores:</span>
                <span className="spec-value">
                  {product.flavors.map(f => 
                    f.ingredientId?.name || f.name || 'Sabor'
                  ).join(', ')}
                </span>
              </div>
            )}
            
            {/* Renderizar toppings si existen */}
            {product.toppings && product.toppings.length > 0 && (
              <div className="spec-item">
                <span className="spec-label">Toppings:</span>
                <span className="spec-value">
                  {product.toppings.map(t => 
                    t.ingredientId?.name || t.name || 'Topping'
                  ).join(', ')}
                </span>
              </div>
            )}
            
            {/* Renderizar extras si existen */}
            {product.additions && product.additions.length > 0 && (
              <div className="spec-item">
                <span className="spec-label">Extras:</span>
                <span className="spec-value">
                  {product.additions.map(a => 
                    a.ingredientId?.name || a.name || 'Extra'
                  ).join(', ')}
                </span>
              </div>
            )}
            
            {/* Instrucciones especiales */}
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

  return (
    <div className={`order-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="order-header" onClick={onToggleExpand}>
        <div className="order-info">
          <div className="order-number">
            <span className="order-label">orden:</span>
            <span className="order-id">#{order._id?.slice(-6) || 'N/A'}</span>
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

          <div className={`order-type ${order.orderType === 'delivery' ? 'type-delivery' : 'type-local'}`}>
            {order.orderType === 'delivery' ? <Truck size={14} /> : <Store size={14} />}
            {order.orderType === 'delivery' ? 'Delivery' : 'Local'}
          </div>

          <div className="order-status">
            <span 
              className={`status-badge status-${order.orderStatus?.replace(/\s+/g, '-')}`}
              style={{ backgroundColor: getStatusColor(order.orderStatus) }}
            >
              {getStatusIcon(order.orderStatus)}
              {order.orderStatus || 'Sin estado'}
            </span>
          </div>

          <div className="order-time">
            <span>
              <Clock size={14} />
              {formatTime(order.createdAt)}
            </span>
            <span className="estimated-time">{order.estimatedTime || '15-20 min'}</span>
          </div>
        </div>

        <div className="expand-icon">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {isExpanded && (
        <div className="order-details">
          <div className="details-grid">
            {/* Dirección (solo para delivery) */}
            {order.orderType === 'delivery' && order.deliveryAddress && (
              <div className="address-section">
                <h4>
                  <MapPin size={16} />
                  Dirección de Entrega
                </h4>
                <div className="address-content">
                  <span className="address-text">{order.deliveryAddress}</span>
                  <MiniMap address={order.deliveryAddress} />
                </div>
              </div>
            )}

            {/* Productos */}
            <div className="products-section">
              <h4>
                <Package size={16} />
                Productos ({order.products?.length || 0})
              </h4>
              {renderProducts()}
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
              <span>{formatCurrency(order.products?.reduce((sum, p) => sum + (p.subtotal || p.totalPrice || 0), 0) || order.totalAmount)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="payment-info">
              <div className="payment-method">
                <span>Método de pago:</span>
              </div>
              <span className="payment-badge">{order.paymentMethod || 'efectivo'}</span>
            </div>
            <div className="payment-info">
              <div className="payment-method">
                <span>Estado de pago:</span>
              </div>
              <span className={`payment-badge ${order.paymentStatus === 'pagado' ? '' : 'payment-pending'}`}>
                {order.paymentStatus || 'pendiente'}
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div className="order-actions">
            <button 
              className="action-btn btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onContactClient && onContactClient(order);
              }}
              disabled={loading}
            >
              <Phone size={16} />
              Contactar
            </button>
            
            <button 
              className="action-btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onStatusUpdate && onStatusUpdate(order);
              }}
              disabled={loading}
            >
              <Edit size={16} />
              Actualizar Estado
            </button>
            
            {order.orderStatus !== 'entregado' && order.orderStatus !== 'cancelado' && (
              <button 
                className="action-btn btn-success"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkCompleted && onMarkCompleted(order);
                }}
                disabled={loading}
              >
                <Check size={16} />
                Marcar Completado
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersCard;