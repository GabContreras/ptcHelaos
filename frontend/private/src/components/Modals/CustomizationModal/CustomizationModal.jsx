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
  // Estado local DENTRO del modal
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
    if (sizeOption) {
      price = sizeOption.price; // Usar el precio del tamaño directamente
    }
    
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

  // Obtener el límite máximo de sabores según el tamaño seleccionado
  const getMaxFlavors = () => {
    if (!localCustomizations.size) return 1;
    const sizeOption = customizationOptions.sizes.find(s => s.id === localCustomizations.size);
    return sizeOption ? sizeOption.maxFlavors : 1;
  };

  // Manejar cambios localmente
  const handleLocalChange = (type, value, isMultiple = false) => {
    setLocalCustomizations(prev => {
      if (type === 'quantity') {
        return { ...prev, quantity: Math.max(1, parseInt(value) || 1) };
      }
      
      if (type === 'specialInstructions') {
        return { ...prev, specialInstructions: value };
      }

      if (type === 'size') {
        // Al cambiar el tamaño, resetear los sabores para evitar conflictos
        return { 
          ...prev, 
          size: value,
          flavors: [] // Limpiar sabores al cambiar tamaño
        };
      }

      if (isMultiple) {
        const currentValues = prev[type] || [];
        
        // Limitar sabores al máximo permitido por el tamaño
        if (type === 'flavors') {
          const maxFlavors = getMaxFlavors();
          if (!currentValues.includes(value) && currentValues.length >= maxFlavors) {
            return prev; // No agregar más sabores si se alcanzó el límite
          }
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

    // Verificar que se haya seleccionado al menos un sabor
    if (localCustomizations.flavors.length === 0) {
      alert('Por favor selecciona al menos un sabor');
      return;
    }

    // Obtener los nombres de las opciones seleccionadas
    const sizeOption = customizationOptions.sizes.find(s => s.id === localCustomizations.size);
    const flavorNames = localCustomizations.flavors.map(id => 
      customizationOptions.flavors.find(f => f.id === id)?.name
    ).filter(Boolean);
    const toppingNames = localCustomizations.toppings.map(id => 
      customizationOptions.toppings.find(t => t.id === id)?.name
    ).filter(Boolean);
    const additionNames = localCustomizations.additions.map(id => 
      customizationOptions.additions.find(a => a.id === id)?.name
    ).filter(Boolean);
    
    // Crear el objeto con el formato correcto que espera useOrder
    const itemData = {
      product,
      customizations: {
        ...localCustomizations,
        sizeName: sizeOption?.name,
        flavorNames,
        toppingNames,
        additionNames
      },
      totalPrice: localPrice
    };

    console.log('Enviando al carrito desde modal:', itemData);
    onAddToCart(itemData);
  };

  // Verificar si un sabor está disponible
  const isFlavorAvailable = (flavor) => {
    return flavor.available !== false; // Permitir si no está definido o es true
  };

  // Verificar si un topping está disponible
  const isToppingAvailable = (topping) => {
    return topping.available !== false; // Permitir si no está definido o es true
  };

  if (!isOpen || !product) return null;

  const maxFlavors = getMaxFlavors();
  const selectedFlavorsCount = localCustomizations.flavors.length;

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
                  {size.name} {size.price > 0 && `(${size.price.toFixed(2)})`}
                  <br />
                  <small style={{opacity: 0.7}}>
                    Hasta {size.maxFlavors} {size.maxFlavors === 1 ? 'sabor' : 'sabores'}
                  </small>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sabores - Solo mostrar si se ha seleccionado un tamaño */}
        {localCustomizations.size && (
          <div className="option-group">
            <h3>
              Sabores (selecciona {maxFlavors === 1 ? '1 sabor' : `hasta ${maxFlavors} sabores`})
              <span style={{marginLeft: '10px', fontSize: '14px', opacity: 0.7}}>
                {selectedFlavorsCount} de {maxFlavors} seleccionados
              </span>
            </h3>
            <div className="options-grid">
              {customizationOptions.flavors.map(flavor => {
                const isSelected = localCustomizations.flavors.includes(flavor.id);
                const available = isFlavorAvailable(flavor);
                const canSelect = available && (isSelected || selectedFlavorsCount < maxFlavors);
                
                return (
                  <label 
                    key={flavor.id} 
                    className={`option-item ${!canSelect ? 'disabled' : ''} ${!available ? 'unavailable' : ''}`}
                  >
                    <input
                      type="checkbox"
                      value={flavor.id}
                      checked={isSelected}
                      onChange={(e) => handleLocalChange('flavors', e.target.value, true)}
                      disabled={!canSelect}
                    />
                    <span className="option-label">
                      {flavor.name} {flavor.price > 0 && `(+$${flavor.price.toFixed(2)})`}
                      {!available && <small style={{display: 'block', color: '#ef4444'}}>No disponible</small>}
                      {!isSelected && selectedFlavorsCount >= maxFlavors && available && 
                        <small style={{display: 'block', color: '#f59e0b'}}>Límite alcanzado</small>
                      }
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Toppings */}
        <div className="option-group">
          <h3>Toppings (opcional)</h3>
          <div className="options-grid">
            {customizationOptions.toppings.map(topping => {
              const available = isToppingAvailable(topping);
              
              return (
                <label 
                  key={topping.id} 
                  className={`option-item ${!available ? 'unavailable' : ''}`}
                >
                  <input
                    type="checkbox"
                    value={topping.id}
                    checked={localCustomizations.toppings.includes(topping.id)}
                    onChange={(e) => handleLocalChange('toppings', e.target.value, true)}
                    disabled={!available}
                  />
                  <span className="option-label">
                    {topping.name} {topping.price > 0 && `(+$${topping.price.toFixed(2)})`}
                    {!available && <small style={{display: 'block', color: '#ef4444'}}>No disponible</small>}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Adiciones */}
        <div className="option-group">
          <h3>Extras (opcional)</h3>
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
          <h3>Instrucciones especiales (opcional)</h3>
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

        {/* Resumen de selección actual */}
        {localCustomizations.size && (
          <div className="selection-summary" style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <h4 style={{marginBottom: '12px', color: '#1e293b'}}>Resumen de tu selección:</h4>
            <div style={{fontSize: '14px', color: '#64748b', lineHeight: '1.5'}}>
              <div><strong>Tamaño:</strong> {customizationOptions.sizes.find(s => s.id === localCustomizations.size)?.name}</div>
              {selectedFlavorsCount > 0 && (
                <div><strong>Sabores ({selectedFlavorsCount}):</strong> {
                  localCustomizations.flavors.map(id => 
                    customizationOptions.flavors.find(f => f.id === id)?.name
                  ).filter(Boolean).join(', ')
                }</div>
              )}
              {localCustomizations.toppings.length > 0 && (
                <div><strong>Toppings:</strong> {
                  localCustomizations.toppings.map(id => 
                    customizationOptions.toppings.find(t => t.id === id)?.name
                  ).filter(Boolean).join(', ')
                }</div>
              )}
              {localCustomizations.additions.length > 0 && (
                <div><strong>Extras:</strong> {
                  localCustomizations.additions.map(id => 
                    customizationOptions.additions.find(a => a.id === id)?.name
                  ).filter(Boolean).join(', ')
                }</div>
              )}
            </div>
          </div>
        )}

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
            disabled={!localCustomizations.size || selectedFlavorsCount === 0 || loading}
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