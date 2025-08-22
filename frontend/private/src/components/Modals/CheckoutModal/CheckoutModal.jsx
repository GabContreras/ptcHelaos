import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, MapPin, ShoppingCart, Trash2, AlertCircle } from 'lucide-react';
import UniversalModal from '../UniversalModal/UniversalModal';

const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  cart,
  onCreateOrder,
  onRemoveFromCart,
  loading,
  error 
}) => {
  // Estado local DENTRO del modal
  const [localCustomerInfo, setLocalCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  const [localOrderType, setLocalOrderType] = useState('local');
  const [localPaymentMethod, setLocalPaymentMethod] = useState('efectivo');
  const [localTotal, setLocalTotal] = useState(0);
  
  const formRef = useRef(null);

  // Calcular total local
  useEffect(() => {
    if (cart && cart.length > 0) {
      const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
      setLocalTotal(total);
    } else {
      setLocalTotal(0);
    }
  }, [cart]);

  // Resetear cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setLocalCustomerInfo({
        name: '',
        phone: '',
        address: ''
      });
      setLocalOrderType('local');
      setLocalPaymentMethod('efectivo');
    }
  }, [isOpen]);

  // Manejar cambios en info del cliente
  const handleCustomerInfoChange = (field, value) => {
    setLocalCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validar y crear orden
  const handleCreateOrder = () => {
    // Validaciones locales
    if (!localCustomerInfo.name.trim()) {
      alert('El nombre del cliente es obligatorio');
      return;
    }

    if (!localCustomerInfo.phone.trim()) {
      alert('El teléfono del cliente es obligatorio');
      return;
    }

    if (localOrderType === 'delivery' && !localCustomerInfo.address.trim()) {
      alert('La dirección es obligatoria para delivery');
      return;
    }

    // Pasar datos al componente padre
    onCreateOrder({
      customerInfo: localCustomerInfo,
      orderType: localOrderType,
      paymentMethod: localPaymentMethod
    });
  };

  if (!isOpen) return null;

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      type="form"
      title="Finalizar Pedido"
      size="large"
    >
      <div ref={formRef} className="checkout-form">
        {/* Información del cliente */}
        <div className="customer-section">
          <h3>Información del Cliente</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre completo *</label>
              <input
                type="text"
                placeholder="Ingresa el nombre del cliente"
                value={localCustomerInfo.name}
                onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                placeholder="0000-0000"
                value={localCustomerInfo.phone}
                onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tipo de orden */}
        <div className="order-type-section">
          <h3>Tipo de Orden</h3>
          <div className="order-type-options">
            <label className={`order-type-option ${localOrderType === 'local' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="orderType"
                value="local"
                checked={localOrderType === 'local'}
                onChange={(e) => setLocalOrderType(e.target.value)}
              />
              <div className="option-content">
                <ShoppingCart size={24} />
                <span>En Local</span>
              </div>
            </label>
            <label className={`order-type-option ${localOrderType === 'delivery' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="orderType"
                value="delivery"
                checked={localOrderType === 'delivery'}
                onChange={(e) => setLocalOrderType(e.target.value)}
              />
              <div className="option-content">
                <MapPin size={24} />
                <span>Delivery</span>
              </div>
            </label>
          </div>
        </div>

        {/* Dirección (solo para delivery) */}
        {localOrderType === 'delivery' && (
          <div className="address-section">
            <h3>Dirección de Entrega</h3>
            <div className="form-group full-width">
              <textarea
                placeholder="Ingresa la dirección completa de entrega"
                value={localCustomerInfo.address}
                onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Método de pago */}
        <div className="payment-section">
          <h3>Método de Pago</h3>
          <div className="payment-options">
            <label className={`payment-option ${localPaymentMethod === 'efectivo' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="efectivo"
                checked={localPaymentMethod === 'efectivo'}
                onChange={(e) => setLocalPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <span>💵</span>
                <span>Efectivo</span>
              </div>
            </label>
            <label className={`payment-option ${localPaymentMethod === 'tarjeta' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="tarjeta"
                checked={localPaymentMethod === 'tarjeta'}
                onChange={(e) => setLocalPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <CreditCard size={20} />
                <span>Tarjeta</span>
              </div>
            </label>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="order-summary-checkout">
          <h3>Resumen del Pedido</h3>
          <div className="cart-items">
            {cart && cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h4>{item.product.name}</h4>
                  <div className="item-customizations">
                    {item.customizations.sizeName && (
                      <span className="customization-detail">
                        Tamaño: {item.customizations.sizeName}
                      </span>
                    )}
                    {item.customizations.flavorNames && item.customizations.flavorNames.length > 0 && (
                      <span className="customization-detail">
                        Sabores: {item.customizations.flavorNames.join(', ')}
                      </span>
                    )}
                    {item.customizations.toppingNames && item.customizations.toppingNames.length > 0 && (
                      <span className="customization-detail">
                        Toppings: {item.customizations.toppingNames.join(', ')}
                      </span>
                    )}
                    {item.customizations.additionNames && item.customizations.additionNames.length > 0 && (
                      <span className="customization-detail">
                        Extras: {item.customizations.additionNames.join(', ')}
                      </span>
                    )}
                    {item.customizations.specialInstructions && (
                      <span className="customization-detail">
                        Notas: {item.customizations.specialInstructions}
                      </span>
                    )}
                  </div>
                  <span className="item-quantity">Cantidad: {item.customizations.quantity}</span>
                </div>
                <div className="item-price">${item.totalPrice.toFixed(2)}</div>
                <button 
                  type="button"
                  className="remove-item"
                  onClick={() => onRemoveFromCart(item.id)}
                  title="Eliminar producto"
                  disabled={loading}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <strong>Total: ${localTotal.toFixed(2)}</strong>
          </div>
        </div>

        {/* Mostrar errores */}
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Acciones */}
        <div className="form-actions">
          <button 
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className="save-button"
            onClick={handleCreateOrder}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard size={16} />
                Confirmar Pedido
              </>
            )}
          </button>
        </div>
      </div>
    </UniversalModal>
  );
};

export default CheckoutModal;