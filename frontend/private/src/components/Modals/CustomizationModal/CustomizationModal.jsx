import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import UniversalModal from '../UniversalModal/UniversalModal';

const CustomizationModal = ({ 
  isOpen, 
  onClose, 
  product, 
  customizationOptions,
  onAddToCart,
  loading 
}) => {
  // Estado local DENTRO del modal - esto es clave
  const [localCustomizations, setLocalCustomizations] = useState({
    size: '',
    flavors: [],
    toppings: [],
    additions: [],
    specialInstructions: '',
    quantity: 1
  });

  const [localPrice, setLocalPrice] = useState(0);
  const formRef = useRef(null);

  // Resetear cuando se abre con nuevo producto
  useEffect(() => {
    if (isOpen && product) {
      setLocalCustomizations({
        size: '',
        flavors: [],
        toppings: [],
        additions: [],
        specialInstructions: '',
        quantity: 1
      });
    }
  }, [isOpen, product?._id]);

  // Calcular precio localmente
  useEffect(() => {
    if (!product) return;
    
    let price = product.basePrice;
    
    // Precio del tamaño
    const sizeOption = customizationOptions.sizes.find(s => s.id === localCustomizations.size);
    if (sizeOption) price += sizeOption.price;
    
    // Precios de sabores
    localCustomizations.flavors.forEach(flavorId => {
      const flavor = customizationOptions.flavors.find(f => f.id === flavorId);
      if (flavor) price += flavor.price;
    });
    
    // Precios de toppings
    localCustomizations.toppings.forEach(toppingId => {
      const topping = customizationOptions.toppings.find(t => t.id === toppingId);
      if (topping) price += topping.price;
    });
    
    // Precios de adiciones
    localCustomizations.additions.forEach(additionId => {
      const addition = customizationOptions.additions.find(a => a.id === additionId);
      if (addition) price += addition.price;
    });
    
    setLocalPrice(price * localCustomizations.quantity);
  }, [localCustomizations, product, customizationOptions]);

  // Manejar cambios localmente
  const handleLocalChange = (type, value, isMultiple = false) => {
    setLocalCustomizations(prev => {
      if (type === 'quantity') {
        return { ...prev, quantity: Math.max(1, parseInt(value) || 1) };
      }
      
      if (type === 'specialInstructions') {
        return { ...prev, specialInstructions: value };
      }

      if (isMultiple) {
        const currentValues = prev[type] || [];
        
        // Limitar sabores a máximo 3
        if (type === 'flavors' && !currentValues.includes(value) && currentValues.length >= 3) {
          return prev;
        }
        
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
          
        return { ...prev, [type]: newValues };
      } else {
        return { ...prev, [type]: value };
      }
    });
  };

  // Agregar al carrito con datos locales
  const handleAdd = () => {
    if (!localCustomizations.size) {
      alert('Por favor selecciona un tamaño');
      return;
    }
    
    onAddToCart({
      product,
      customizations: localCustomizations,
      totalPrice: localPrice
    });
  };

  if (!isOpen || !product) return null;

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      type="form"
      title={`Personalizar ${product.name}`}
      size="large"
    >
      <div ref={formRef} className="customization-form">
        {/* Información del producto */}
        <div className="product-info">
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <div className="base-price">Precio base: ${product.basePrice.toFixed(2)}</div>
        </div>

        {/* Tamaños */}
        <div className="option-group">
          <h3>Tamaño *</h3>
          <div className="options-grid">
            {customizationOptions.sizes.map(size => (
              <label key={size.id} className="option-item">
                <input
                  type="radio"
                  name="size"
                  value={size.id}
                  checked={localCustomizations.size === size.id}
                  onChange={(e) => handleLocalChange('size', e.target.value)}
                />
                <span className="option-label">
                  {size.name} {size.price > 0 && `(+$${size.price.toFixed(2)})`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sabores */}
        <div className="option-group">
          <h3>Sabores (máximo 3)</h3>
          <div className="options-grid">
            {customizationOptions.flavors.map(flavor => (
              <label key={flavor.id} className="option-item">
                <input
                  type="checkbox"
                  value={flavor.id}
                  checked={localCustomizations.flavors.includes(flavor.id)}
                  onChange={(e) => handleLocalChange('flavors', e.target.value, true)}
                />
                <span className="option-label">
                  {flavor.name} {flavor.price > 0 && `(+$${flavor.price.toFixed(2)})`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Toppings */}
        <div className="option-group">
          <h3>Toppings</h3>
          <div className="options-grid">
            {customizationOptions.toppings.map(topping => (
              <label key={topping.id} className="option-item">
                <input
                  type="checkbox"
                  value={topping.id}
                  checked={localCustomizations.toppings.includes(topping.id)}
                  onChange={(e) => handleLocalChange('toppings', e.target.value, true)}
                />
                <span className="option-label">
                  {topping.name} {topping.price > 0 && `(+$${topping.price.toFixed(2)})`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Adiciones */}
        <div className="option-group">
          <h3>Extras</h3>
          <div className="options-grid">
            {customizationOptions.additions.map(addition => (
              <label key={addition.id} className="option-item">
                <input
                  type="checkbox"
                  value={addition.id}
                  checked={localCustomizations.additions.includes(addition.id)}
                  onChange={(e) => handleLocalChange('additions', e.target.value, true)}
                />
                <span className="option-label">
                  {addition.name} {addition.price > 0 && `(+$${addition.price.toFixed(2)})`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Instrucciones especiales */}
        <div className="option-group full-width">
          <h3>Instrucciones especiales</h3>
          <textarea
            className="special-instructions"
            placeholder="Ej: Extra crujiente, sin azúcar, etc."
            value={localCustomizations.specialInstructions}
            onChange={(e) => handleLocalChange('specialInstructions', e.target.value)}
            rows={3}
          />
        </div>

        {/* Cantidad y precio */}
        <div className="bottom-section">
          <div className="quantity-section">
            <label>Cantidad:</label>
            <div className="quantity-controls">
              <button 
                type="button"
                className="quantity-btn"
                onClick={() => handleLocalChange('quantity', localCustomizations.quantity - 1)}
              >
                <Minus size={16} />
              </button>
              <span className="quantity-display">{localCustomizations.quantity}</span>
              <button 
                type="button"
                className="quantity-btn"
                onClick={() => handleLocalChange('quantity', localCustomizations.quantity + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className="price-display">
            <span className="total-price">Total: ${localPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button 
            type="button"
            className="cancel-button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className="save-button"
            onClick={handleAdd}
            disabled={!localCustomizations.size || loading}
          >
            <ShoppingCart size={16} />
            {loading ? 'Agregando...' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </UniversalModal>
  );
};

export default CustomizationModal;