import React, { useState } from 'react';
import { Edit, Plus } from 'lucide-react';
import './Storage.css';

const Storage = () => {
  const [activeTab, setActiveTab] = useState('materia-prima');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [consumeAmount, setConsumeAmount] = useState('0');
  const [consumeUnit, setConsumeUnit] = useState('Unidades');

  const tabs = [
    { id: 'frutales', name: 'Frutales' },
    { id: 'toppings', name: 'Toppings' },
    { id: 'materia-prima', name: 'Materia prima' },
    { id: 'herramientas', name: 'Herramientas' },
    { id: 'empaquetado', name: 'Empaquetado' }
  ];

  const ingredients = [
    {
      id: 1,
      name: 'Ingrediente 1',
      info1: 'info 1',
      info2: 'info 2',
      available: '000',
      unit: 'kg',
      category: 'categoria',
      provider: 'Super selectos',
      unitCost: 900.00,
      entryDate: 'dd/mm/yyyy',
      expirationDate: 'dd/mm/yyyy',
      status: 'Finalizadas'
    },
    {
      id: 2,
      name: 'Ingrediente 2',
      info1: 'info 1',
      info2: 'info 2',
      available: '000',
      unit: 'u',
      category: 'categoria',
      provider: 'Super selectos',
      unitCost: 900.00,
      entryDate: 'dd/mm/yyyy',
      expirationDate: 'dd/mm/yyyy',
      status: 'Finalizadas'
    },
    {
      id: 4,
      name: 'Ingrediente 4',
      info1: 'info 1',
      info2: 'info 2',
      available: '000',
      unit: 'kg',
      category: 'categoria',
      provider: 'Super selectos',
      unitCost: 900.00,
      entryDate: 'dd/mm/yyyy',
      expirationDate: 'dd/mm/yyyy',
      status: 'Finalizadas'
    },
    {
      id: 5,
      name: 'Ingrediente 5',
      info1: 'info 1',
      info2: 'info 2',
      available: '000',
      unit: 'u',
      category: 'categoria',
      provider: 'Super selectos',
      unitCost: 900.00,
      entryDate: 'dd/mm/yyyy',
      expirationDate: 'dd/mm/yyyy',
      status: 'Finalizadas'
    },
    {
      id: 6,
      name: 'Ingrediente 6',
      info1: 'info 1',
      info2: 'info 2',
      available: '000',
      unit: 'kg',
      category: 'categoria',
      provider: 'Super selectos',
      unitCost: 900.00,
      entryDate: 'dd/mm/yyyy',
      expirationDate: 'dd/mm/yyyy',
      status: 'Finalizadas'
    },
    {
      id: 3,
      name: 'Ingrediente 3',
      info1: 'info 1',
      info2: 'info 2',
      available: '000',
      unit: 'u',
      category: 'categoria',
      provider: 'Super selectos',
      unitCost: 900.00,
      entryDate: 'dd/mm/yyyy',
      expirationDate: 'dd/mm/yyyy',
      status: 'Finalizadas'
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleConsume = () => {
    console.log(`Consuming ${consumeAmount} ${consumeUnit} of ${selectedIngredient?.name}`);
    // Aquí iría la lógica para consumir del inventario
  };

  return (
    <div className="inventory-container">
      <div className="main-content">
        {/* Header con pestañas */}
        <div className="header-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Grid de ingredientes */}
        <div className="ingredients-grid">
          {ingredients.map(ingredient => (
            <div 
              key={ingredient.id} 
              className={`ingredient-card ${selectedIngredient?.id === ingredient.id ? 'selected' : ''}`}
              onClick={() => handleIngredientSelect(ingredient)}
            >
              <div className="ingredient-header">
                <h3>{ingredient.name}</h3>
                <button className="edit-btn">
                  <Edit size={16} />
                </button>
              </div>
              <div className="ingredient-info">
                <div className="info-item">{ingredient.info1}</div>
                <div className="info-item">{ingredient.info2}</div>
              </div>
              <div className="ingredient-stock">
                <span className="stock-label">disponible:</span>
                <span className="stock-amount">{ingredient.available} {ingredient.unit}</span>
              </div>
            </div>
          ))}
          
          {/* Botón agregar */}
          <div className="add-ingredient-card">
            <button className="add-btn">
              <div className="add-content">
                <span>Agregar</span>
                <Plus size={24} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Panel lateral */}
      <div className="side-panel">
        {selectedIngredient ? (
          <>
            <div className="ingredient-details">
              <h3>{selectedIngredient.name}</h3>
              <div className="detail-category">{selectedIngredient.category}</div>
              
              <div className="detail-info">
                <div className="info-line">{selectedIngredient.info1}</div>
                <div className="info-line">{selectedIngredient.info2}</div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Proveedor:</span>
                <span className="detail-value">{selectedIngredient.provider}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">disponible:</span>
                <span className="detail-value">{selectedIngredient.available} {selectedIngredient.unit}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Costo por unidad</span>
                <span className="detail-value">$ {selectedIngredient.unitCost.toFixed(2)}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Fecha de ingreso:</span>
                <span className="detail-value">{selectedIngredient.entryDate}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Fecha de expiración</span>
                <span className="detail-value">{selectedIngredient.expirationDate}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Estado:</span>
                <div className="status-dropdown">
                  <select value={selectedIngredient.status}>
                    <option value="Finalizadas">Finalizadas</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Disponible">Disponible</option>
                  </select>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-label">se agotaron en:</span>
                <span className="detail-value">{selectedIngredient.expirationDate}</span>
              </div>
            </div>

            {/* Sección de consumir */}
            <div className="consume-section">
              <div className="consume-row">
                <span className="consume-label">Consumir del lote</span>
                <div className="unit-dropdown">
                  <select 
                    value={consumeUnit} 
                    onChange={(e) => setConsumeUnit(e.target.value)}
                  >
                    <option value="Unidades">Unidades</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                  </select>
                </div>
              </div>
              
              <input
                type="number"
                value={consumeAmount}
                onChange={(e) => setConsumeAmount(e.target.value)}
                className="consume-input"
                min="0"
              />
              
              <button className="consume-btn" onClick={handleConsume}>
                Consumir
              </button>
            </div>
          </>
        ) : (
          <div className="no-selection">
            <p>Selecciona un ingrediente para ver los detalles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Storage;