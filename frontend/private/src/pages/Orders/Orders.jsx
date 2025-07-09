import React, { useState } from 'react';
import { Cookie, IceCream, Layers, Sandwich } from 'lucide-react';
import './Orders.css';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('waffles');
  const [selectedOptions, setSelectedOptions] = useState({
    waffles: { tamano: '', sabor: [], complemento: [], etcetera: [] },
    helados: { tamano: '', sabor: [], complemento: [], etcetera: [] },
    pancakes: { tamano: '', sabor: [], complemento: [], etcetera: [] },
    panes: { tamano: '', sabor: [], complemento: [], etcetera: [] }
  });
  const [quantity, setQuantity] = useState(1);

  const menuItems = {
    waffles: { icon: Cookie, name: 'Waffles', basePrice: 5.80 },
    helados: { icon: IceCream, name: 'Helados', basePrice: 4.50 },
    pancakes: { icon: Layers, name: 'Pancakes', basePrice: 6.20 },
    panes: { icon: Sandwich, name: 'Panes', basePrice: 3.80 }
  };

  const optionsData = {
    waffles: {
      tamano: [
        { id: 'opcion1', name: 'Mini', price: 0 },
        { id: 'opcion2', name: 'Regular', price: 1.20 },
        { id: 'opcion3', name: 'Grande', price: 2.50 },
        { id: 'opcion4', name: 'Jumbo', price: 3.80 },
        { id: 'opcion5', name: 'Familiar', price: 5.00 }
      ],
      sabor: [
        { id: 'opcion1', name: 'Original', price: 0 },
        { id: 'opcion2', name: 'Chocolate', price: 0.50 },
        { id: 'opcion3', name: 'Vainilla', price: 0.50 },
        { id: 'opcion4', name: 'Fresa', price: 0.80 },
        { id: 'opcion5', name: 'Canela', price: 0.60 },
        { id: 'opcion6', name: 'Limón', price: 0.70 },
        { id: 'opcion7', name: 'Nutella', price: 1.20 },
        { id: 'opcion8', name: 'Red Velvet', price: 1.50 },
        { id: 'opcion9', name: 'Coco', price: 0.40 },
        { id: 'opcion10', name: 'Maple', price: 0.80 }
      ],
      complemento: [
        { id: 'opcion1', name: 'Mantequilla', price: 0.50 },
        { id: 'opcion2', name: 'Miel', price: 1.00 },
        { id: 'opcion3', name: 'Jarabe Maple', price: 0.80 },
        { id: 'opcion4', name: 'Chantilly', price: 0.30 },
        { id: 'opcion5', name: 'Helado', price: 1.40 },
        { id: 'opcion6', name: 'Frutas Frescas', price: 1.60 },
        { id: 'opcion7', name: 'Nutella', price: 1.50 },
        { id: 'opcion8', name: 'Dulce de Leche', price: 1.20 },
        { id: 'opcion9', name: 'Chocolate Chips', price: 0.90 },
        { id: 'opcion10', name: 'Caramelo', price: 1.20 }
      ],
      etcetera: [
        { id: 'opcion1', name: 'Extra Crujiente', price: 0.20 },
        { id: 'opcion2', name: 'Sin Gluten', price: 0.80 },
        { id: 'opcion3', name: 'Vegano', price: 0.50 },
        { id: 'opcion4', name: 'Integral', price: 0.30 },
        { id: 'opcion5', name: 'Proteína Extra', price: 1.00 },
        { id: 'opcion6', name: 'Bajo en Azúcar', price: 0.30 },
        { id: 'opcion7', name: 'Caliente', price: 0.20 },
        { id: 'opcion8', name: 'Para Llevar', price: 0.10 },
        { id: 'opcion9', name: 'Doble Porción', price: 2.50 },
        { id: 'opcion10', name: 'Presentación Especial', price: 1.00 }
      ]
    },
    helados: {
      tamano: [
        { id: 'opcion1', name: 'Una Bola', price: 0 },
        { id: 'opcion2', name: 'Dos Bolas', price: 1.20 },
        { id: 'opcion3', name: 'Tres Bolas', price: 2.50 },
        { id: 'opcion4', name: 'Sundae', price: 3.80 },
        { id: 'opcion5', name: 'Banana Split', price: 5.00 }
      ],
      sabor: [
        { id: 'opcion1', name: 'Vainilla', price: 0 },
        { id: 'opcion2', name: 'Chocolate', price: 0.50 },
        { id: 'opcion3', name: 'Fresa', price: 0.50 },
        { id: 'opcion4', name: 'Cookies & Cream', price: 0.80 },
        { id: 'opcion5', name: 'Menta Chip', price: 0.60 },
        { id: 'opcion6', name: 'Caramelo Salado', price: 0.70 },
        { id: 'opcion7', name: 'Pistacho', price: 1.20 },
        { id: 'opcion8', name: 'Ron con Pasas', price: 1.50 },
        { id: 'opcion9', name: 'Limón', price: 0.40 },
        { id: 'opcion10', name: 'Coconut', price: 0.80 }
      ],
      complemento: [
        { id: 'opcion1', name: 'Chantilly', price: 0.50 },
        { id: 'opcion2', name: 'Frutas', price: 1.00 },
        { id: 'opcion3', name: 'Granola', price: 0.80 },
        { id: 'opcion4', name: 'Sprinkles', price: 0.30 },
        { id: 'opcion5', name: 'Jarabe Chocolate', price: 0.40 },
        { id: 'opcion6', name: 'Cerezas', price: 0.60 },
        { id: 'opcion7', name: 'Salsa Fresa', price: 0.50 },
        { id: 'opcion8', name: 'Canela', price: 0.20 },
        { id: 'opcion9', name: 'Almendras', price: 0.90 },
        { id: 'opcion10', name: 'Brownie', price: 1.20 }
      ],
      etcetera: [
        { id: 'opcion1', name: 'Sin Lactosa', price: 0.20 },
        { id: 'opcion2', name: 'Sugar Free', price: 0.30 },
        { id: 'opcion3', name: 'Yogurt Frozen', price: 0.50 },
        { id: 'opcion4', name: 'Orgánico', price: 0.80 },
        { id: 'opcion5', name: 'Probióticos', price: 1.00 },
        { id: 'opcion6', name: 'Bajo en Grasa', price: 0.30 },
        { id: 'opcion7', name: 'Extra Frío', price: 0.10 },
        { id: 'opcion8', name: 'Keto', price: 1.20 },
        { id: 'opcion9', name: 'Copa Premium', price: 0.60 },
        { id: 'opcion10', name: 'Milkshake', price: 1.40 }
      ]
    },
    pancakes: {
      tamano: [
        { id: 'opcion1', name: 'Stack de 2', price: 0 },
        { id: 'opcion2', name: 'Stack de 3', price: 1.20 },
        { id: 'opcion3', name: 'Stack de 4', price: 2.50 },
        { id: 'opcion4', name: 'Stack Jumbo', price: 3.80 },
        { id: 'opcion5', name: 'Mega Stack', price: 5.00 }
      ],
      sabor: [
        { id: 'opcion1', name: 'Clásico', price: 0 },
        { id: 'opcion2', name: 'Chocolate Chip', price: 0.50 },
        { id: 'opcion3', name: 'Blueberry', price: 0.50 },
        { id: 'opcion4', name: 'Banana', price: 0.80 },
        { id: 'opcion5', name: 'Avena', price: 0.60 },
        { id: 'opcion6', name: 'Buttermilk', price: 0.70 },
        { id: 'opcion7', name: 'Red Velvet', price: 1.20 },
        { id: 'opcion8', name: 'Lemon Ricotta', price: 1.50 },
        { id: 'opcion9', name: 'Cinnamon', price: 0.40 },
        { id: 'opcion10', name: 'Protein', price: 0.80 }
      ],
      complemento: [
        { id: 'opcion1', name: 'Mantequilla', price: 0.50 },
        { id: 'opcion2', name: 'Jarabe Maple', price: 1.00 },
        { id: 'opcion3', name: 'Miel', price: 0.80 },
        { id: 'opcion4', name: 'Whipped Cream', price: 0.30 },
        { id: 'opcion5', name: 'Frutas del Bosque', price: 1.40 },
        { id: 'opcion6', name: 'Compota', price: 1.60 },
        { id: 'opcion7', name: 'Nutella', price: 1.50 },
        { id: 'opcion8', name: 'Peanut Butter', price: 1.20 },
        { id: 'opcion9', name: 'Bacon', price: 1.90 },
        { id: 'opcion10', name: 'Huevo Frito', price: 1.20 }
      ],
      etcetera: [
        { id: 'opcion1', name: 'Extra Esponjoso', price: 0.20 },
        { id: 'opcion2', name: 'Sin Gluten', price: 0.80 },
        { id: 'opcion3', name: 'Vegano', price: 0.50 },
        { id: 'opcion4', name: 'Integral', price: 0.30 },
        { id: 'opcion5', name: 'High Protein', price: 1.00 },
        { id: 'opcion6', name: 'Low Carb', price: 0.90 },
        { id: 'opcion7', name: 'Caliente', price: 0.20 },
        { id: 'opcion8', name: 'Mini Pancakes', price: 0.50 },
        { id: 'opcion9', name: 'Forma Especial', price: 0.80 },
        { id: 'opcion10', name: 'Desayuno Completo', price: 2.40 }
      ]
    },
    panes: {
      tamano: [
        { id: 'opcion1', name: 'Rebanada', price: 0 },
        { id: 'opcion2', name: 'Tostada Doble', price: 1.20 },
        { id: 'opcion3', name: 'Sandwich', price: 2.50 },
        { id: 'opcion4', name: 'Baguette', price: 3.80 },
        { id: 'opcion5', name: 'Pan Completo', price: 5.00 }
      ],
      sabor: [
        { id: 'opcion1', name: 'Blanco', price: 0 },
        { id: 'opcion2', name: 'Integral', price: 0.50 },
        { id: 'opcion3', name: 'Centeno', price: 0.50 },
        { id: 'opcion4', name: 'Multigrano', price: 0.80 },
        { id: 'opcion5', name: 'Avena', price: 0.60 },
        { id: 'opcion6', name: 'Brioche', price: 0.70 },
        { id: 'opcion7', name: 'Focaccia', price: 1.20 },
        { id: 'opcion8', name: 'Sourdough', price: 1.50 },
        { id: 'opcion9', name: 'Pita', price: 0.40 },
        { id: 'opcion10', name: 'Ciabatta', price: 0.80 }
      ],
      complemento: [
        { id: 'opcion1', name: 'Mantequilla', price: 0.50 },
        { id: 'opcion2', name: 'Mermelada', price: 1.00 },
        { id: 'opcion3', name: 'Miel', price: 0.80 },
        { id: 'opcion4', name: 'Queso Crema', price: 0.30 },
        { id: 'opcion5', name: 'Aguacate', price: 1.40 },
        { id: 'opcion6', name: 'Jamón', price: 1.60 },
        { id: 'opcion7', name: 'Queso', price: 1.50 },
        { id: 'opcion8', name: 'Tomate', price: 0.20 },
        { id: 'opcion9', name: 'Lechuga', price: 0.30 },
        { id: 'opcion10', name: 'Hummus', price: 1.20 }
      ],
      etcetera: [
        { id: 'opcion1', name: 'Tostado', price: 0.20 },
        { id: 'opcion2', name: 'Sin Gluten', price: 0.80 },
        { id: 'opcion3', name: 'Vegano', price: 0.50 },
        { id: 'opcion4', name: 'Artesanal', price: 0.80 },
        { id: 'opcion5', name: 'Recién Horneado', price: 0.50 },
        { id: 'opcion6', name: 'Bajo en Sodio', price: 0.30 },
        { id: 'opcion7', name: 'Caliente', price: 0.20 },
        { id: 'opcion8', name: 'Para Llevar', price: 0.10 },
        { id: 'opcion9', name: 'Cortado Especial', price: 0.40 },
        { id: 'opcion10', name: 'Con Semillas', price: 0.60 }
      ]
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleOptionChange = (category, optionId, isMultiple = false) => {
    setSelectedOptions(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [category]: isMultiple 
          ? prev[activeTab][category].includes(optionId)
            ? prev[activeTab][category].filter(id => id !== optionId)
            : [...prev[activeTab][category], optionId]
          : optionId
      }
    }));
  };

  const calculatePrice = () => {
    const basePrice = menuItems[activeTab].basePrice;
    const current = selectedOptions[activeTab];
    
    if (!optionsData[activeTab]) return basePrice;
    
    let totalPrice = basePrice;
    
    // Tamaño (radio button)
    if (current.tamano && optionsData[activeTab].tamano) {
      const tamanoOption = optionsData[activeTab].tamano.find(opt => opt.id === current.tamano);
      if (tamanoOption) totalPrice += tamanoOption.price;
    }
    
    // Sabor (multiple)
    if (optionsData[activeTab].sabor) {
      current.sabor.forEach(saborId => {
        const saborOption = optionsData[activeTab].sabor.find(opt => opt.id === saborId);
        if (saborOption) totalPrice += saborOption.price;
      });
    }
    
    // Complemento (multiple)
    if (optionsData[activeTab].complemento) {
      current.complemento.forEach(complementoId => {
        const complementoOption = optionsData[activeTab].complemento.find(opt => opt.id === complementoId);
        if (complementoOption) totalPrice += complementoOption.price;
      });
    }
    
    // Etcetera (multiple)
    if (optionsData[activeTab].etcetera) {
      current.etcetera.forEach(etcId => {
        const etcOption = optionsData[activeTab].etcetera.find(opt => opt.id === etcId);
        if (etcOption) totalPrice += etcOption.price;
      });
    }
    
    return totalPrice;
  };

  const getSelectedOptionName = (category, optionId) => {
    if (!optionsData[activeTab] || !optionsData[activeTab][category]) return '';
    const option = optionsData[activeTab][category].find(opt => opt.id === optionId);
    return option ? option.name : '';
  };

  const getCurrentSelections = () => {
    const current = selectedOptions[activeTab];
    const selections = [];
    
    if (current.tamano) {
      selections.push(`tamaño: ${getSelectedOptionName('tamano', current.tamano)}`);
    }
    
    if (current.sabor.length > 0) {
      const sabores = current.sabor.map(id => getSelectedOptionName('sabor', id));
      selections.push(`sabor: ${sabores.join(', ')}`);
    }
    
    if (current.complemento.length > 0) {
      const complementos = current.complemento.map(id => getSelectedOptionName('complemento', id));
      selections.push(`complemento: ${complementos.join(', ')}`);
    }
    
    if (current.etcetera.length > 0) {
      const etcs = current.etcetera.map(id => getSelectedOptionName('etcetera', id));
      selections.push(`etcetera: ${etcs.join(', ')}`);
    }
    
    return selections;
  };

  const unitPrice = calculatePrice();
  const subtotal = unitPrice * quantity;

  return (
    <div className="order-container">
      <div className="main-content">
        {/* Header con pestañas */}
        <div className="header-tabs">
          {Object.entries(menuItems).map(([key, item]) => {
            const IconComponent = item.icon;
            return (
              <button
                key={key}
                className={`tab-button ${activeTab === key ? 'active' : ''}`}
                onClick={() => handleTabChange(key)}
              >
                <IconComponent size={28} />
              </button>
            );
          })}
        </div>

        {/* Sección de opciones */}
        <div className="options-section">
          {/* Tamaño */}
          <div className="option-group">
            <h3>Tamaño</h3>
            <div className="options-grid">
              {optionsData[activeTab]?.tamano?.map(option => (
                <label key={option.id} className="option-item">
                  <input
                    type="radio"
                    name="tamano"
                    value={option.id}
                    checked={selectedOptions[activeTab].tamano === option.id}
                    onChange={() => handleOptionChange('tamano', option.id)}
                  />
                  <span className="option-label">{option.name}</span>
                </label>
              )) || []}
            </div>
          </div>

          {/* Sabor */}
          <div className="option-group">
            <h3>Sabor</h3>
            <div className="options-grid">
              {optionsData[activeTab]?.sabor?.map(option => (
                <label key={option.id} className="option-item">
                  <input
                    type="checkbox"
                    checked={selectedOptions[activeTab].sabor.includes(option.id)}
                    onChange={() => handleOptionChange('sabor', option.id, true)}
                  />
                  <span className="option-label">{option.name}</span>
                </label>
              )) || []}
            </div>
          </div>

          {/* Complemento */}
          <div className="option-group">
            <h3>Complemento</h3>
            <div className="options-grid">
              {optionsData[activeTab]?.complemento?.map(option => (
                <label key={option.id} className="option-item">
                  <input
                    type="checkbox"
                    checked={selectedOptions[activeTab].complemento.includes(option.id)}
                    onChange={() => handleOptionChange('complemento', option.id, true)}
                  />
                  <span className="option-label">{option.name}</span>
                </label>
              )) || []}
            </div>
          </div>

          {/* Etcetera */}
          <div className="option-group">
            <h3>Etcetera</h3>
            <div className="options-grid">
              {optionsData[activeTab]?.etcetera?.map(option => (
                <label key={option.id} className="option-item">
                  <input
                    type="checkbox"
                    checked={selectedOptions[activeTab].etcetera.includes(option.id)}
                    onChange={() => handleOptionChange('etcetera', option.id, true)}
                  />
                  <span className="option-label">{option.name}</span>
                </label>
              )) || []}
            </div>
          </div>
        </div>

        {/* Cantidad y botones */}
        <div className="bottom-section">
          <div className="quantity-section">
            <label>cantidad:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="add-btn">Agregar {quantity}</button>
            <button className="pay-btn">pago</button>
          </div>
        </div>
      </div>

      {/* Resumen lateral */}
      <div className="summary-section">
        <h3>resumen</h3>
        <div className="summary-content">
          <div className="product-summary">
            <div className="product-name">
              {menuItems[activeTab].name} 
              <span className="product-quantity">{quantity}</span>
            </div>
            <div className="product-selections">
              {getCurrentSelections().map((selection, index) => (
                <div key={index} className="selection-item">
                  {selection}
                </div>
              ))}
            </div>
            <div className="product-price">
              precio: {unitPrice.toFixed(2)} $
            </div>
          </div>
        </div>
        
        <div className="summary-totals">
          <div className="subtotal">
            <span>subtotal: {subtotal.toFixed(2)}</span>
          </div>
          <div className="discount">
            <span>descuento: 0.00</span>
            <button className="edit-btn">(editar)</button>
          </div>
          <div className="total">
            <strong>Total: {subtotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;