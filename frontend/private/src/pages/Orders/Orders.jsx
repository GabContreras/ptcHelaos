import React, { useState } from 'react';
import { MapPin, Clock, Phone, User, Package, ChevronDown, ChevronUp, Star, Copy } from 'lucide-react';
import './Orders.css';

const Delivery = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const orders = [
    {
      id: '00',
      status: 'en preparacion',
      client: {
        name: 'Nombre Apellido',
        phone: '0000-0000',
        rating: 4.5
      },
      address: 'Calle Principal #123, San Salvador',
      coordinates: { lat: 13.7028, lng: -89.2181 },
      products: [
        {
          name: 'Producto 3',
          quantity: 1,
          size: 'opcion 2',
          flavors: ['opcion 2', 'opcion 8'],
          complements: ['opcion 6'],
          extras: ['opcion 8'],
          price: 5.80
        }
      ],
      subtotal: 13.45,
      discount: 0.00,
      total: 15.95,
      estimatedTime: '25-30 min',
      orderTime: '14:30',
      paymentMethod: 'contra entrega'
    },
    {
      id: '01',
      status: 'recibido',
      client: {
        name: 'María González',
        phone: '2222-3333',
        rating: 5.0
      },
      address: 'Colonia Escalón, Block A, Casa 45',
      coordinates: { lat: 13.7089, lng: -89.2348 },
      products: [
        {
          name: 'Producto 1',
          quantity: 2,
          size: 'opcion 2',
          flavors: ['opcion 2', 'opcion 8'],
          complements: ['opcion 6'],
          extras: ['opcion 8'],
          price: 7.65
        }
      ],
      subtotal: 18.30,
      discount: 0.00,
      total: 18.30,
      estimatedTime: '20-25 min',
      orderTime: '14:45',
      paymentMethod: 'tarjeta'
    },
    {
      id: '02',
      status: 'recibido',
      client: {
        name: 'Carlos Mendoza',
        phone: '7777-8888',
        rating: 4.2
      },
      address: 'Centro Comercial Galerías, Local 234',
      coordinates: { lat: 13.6929, lng: -89.2182 },
      products: [
        {
          name: 'Producto 2',
          quantity: 1,
          size: 'grande',
          flavors: ['chocolate', 'vainilla'],
          complements: ['crema'],
          extras: ['extra dulce'],
          price: 8.50
        }
      ],
      subtotal: 8.50,
      discount: 1.00,
      total: 7.50,
      estimatedTime: '30-35 min',
      orderTime: '15:00',
      paymentMethod: 'efectivo'
    },
    {
      id: '03',
      status: 'en camino',
      client: {
        name: 'Ana Rodríguez',
        phone: '5555-6666',
        rating: 4.8
      },
      address: 'Zona Rosa, Edificio Torre Sur, Apt 502',
      coordinates: { lat: 13.7156, lng: -89.2456 },
      products: [
        {
          name: 'Producto 4',
          quantity: 3,
          size: 'mediano',
          flavors: ['fresa'],
          complements: ['frutas', 'miel'],
          extras: [],
          price: 6.25
        }
      ],
      subtotal: 18.75,
      discount: 0.50,
      total: 18.25,
      estimatedTime: '10-15 min',
      orderTime: '14:15',
      paymentMethod: 'contra entrega'
    }
  ];

  const handleOrderClick = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en preparacion': return '#f59e0b';
      case 'recibido': return '#10b981';
      case 'en camino': return '#3b82f6';
      case 'entregado': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en preparacion': return <Package size={16} />;
      case 'recibido': return <Clock size={16} />;
      case 'en camino': return <MapPin size={16} />;
      default: return <Package size={16} />;
    }
  };

  const MiniMap = ({ coordinates, address }) => (
    <div className="mini-map">
      <div className="map-placeholder">
        <MapPin className="map-icon" />
        <div className="coordinates">
          {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
        </div>
      </div>
      <div className="map-overlay">
        <button className="copy-link-btn">
          <Copy size={12} />
          copiar link
        </button>
      </div>
    </div>
  );

  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h1>Gestión de Delivery</h1>
        <div className="delivery-stats">
          <div className="stat-card">
            <span className="stat-number">4</span>
            <span className="stat-label">Órdenes activas</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">25 min</span>
            <span className="stat-label">Tiempo promedio</span>
          </div>
        </div>
      </div>

      <div className="orders-container">
        {orders.map((order) => (
          <div key={order.id} className={`order-card ${expandedOrder === order.id ? 'expanded' : ''}`}>
            <div className="order-header" onClick={() => handleOrderClick(order.id)}>
              <div className="order-info">
                <div className="order-number">
                  <span className="order-label">orden:</span>
                  <span className="order-id">{order.id}</span>
                </div>
                
                <div className="client-info">
                  <div className="client-name">
                    <User size={16} />
                    {order.client.name}
                    <div className="client-rating">
                      <Star size={12} fill="currentColor" />
                      {order.client.rating}
                    </div>
                  </div>
                  <div className="client-phone">
                    <Phone size={14} />
                    {order.client.phone}
                  </div>
                </div>

                <div className="order-status">
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                <div className="order-time">
                  <Clock size={14} />
                  <span>{order.orderTime}</span>
                  <span className="estimated-time">{order.estimatedTime}</span>
                </div>
              </div>

              <div className="expand-icon">
                {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            <div className="order-preview">
              <div className="address-section">
                <span className="address-label">dirección:</span>
                <div className="address-content">
                  <MiniMap coordinates={order.coordinates} address={order.address} />
                  <span className="address-text">{order.address}</span>
                </div>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="order-details">
                <div className="products-section">
                  <h4>Productos:</h4>
                  {order.products.map((product, index) => (
                    <div key={index} className="product-detail">
                      <div className="product-header">
                        <span className="product-name">{product.name}</span>
                        <span className="product-quantity">x{product.quantity}</span>
                        <span className="product-price">${product.price}</span>
                      </div>
                      <div className="product-specs">
                        <div className="spec-item">
                          <span className="spec-label">tamaño:</span>
                          <span className="spec-value">{product.size}</span>
                        </div>
                        {product.flavors.length > 0 && (
                          <div className="spec-item">
                            <span className="spec-label">sabor:</span>
                            <span className="spec-value">{product.flavors.join(', ')}</span>
                          </div>
                        )}
                        {product.complements.length > 0 && (
                          <div className="spec-item">
                            <span className="spec-label">complemento:</span>
                            <span className="spec-value">{product.complements.join(', ')}</span>
                          </div>
                        )}
                        {product.extras.length > 0 && (
                          <div className="spec-item">
                            <span className="spec-label">extras:</span>
                            <span className="spec-value">{product.extras.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>descuento:</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="payment-method">
                    <span>forma de pago:</span>
                    <span className="payment-badge">{order.paymentMethod}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <button className="action-btn secondary">Contactar Cliente</button>
                  <button className="action-btn primary">Actualizar Estado</button>
                  <button className="action-btn success">Marcar Entregado</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="summary-panel">
        <div className="panel-content">
          <h3>Resumen del día</h3>
          <div className="daily-stats">
            <div className="daily-stat">
              <span className="stat-value">12</span>
              <span className="stat-text">Órdenes completadas</span>
            </div>
            <div className="daily-stat">
              <span className="stat-value">$245.80</span>
              <span className="stat-text">Ingresos totales</span>
            </div>
            <div className="daily-stat">
              <span className="stat-value">4.7</span>
              <span className="stat-text">Rating promedio</span>
            </div>
          </div>
          
          <button className="order-list-btn">
            Orden lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delivery;