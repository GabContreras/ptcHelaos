import React, { useState } from 'react';
import { ChevronDown, X, ArrowLeft, ArrowRight } from 'lucide-react';
import '../styles/Menu.css';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import imagen1 from "../imgs/item1menu.png"
import imagen2 from "../imgs/item2menu.png"
import imagen3 from "../imgs/item3menu.png"
import imagen4 from "../imgs/item4menu.png"
import imagen5 from "../imgs/item5menu.png"
import imagen6 from "../imgs/item6menu.png"

const Menu = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizationStep, setCustomizationStep] = useState(0);
  const [customization, setCustomization] = useState({
    size: null,
    flavors: [],
    toppings: []
  });

  const menuItems = [
    {
      id: 1,
      title: "Helado de rollo",
      description: "El especial de la casa, personalízalo como más te guste.",
      fullDescription: "Delicioso helado enrollado artesanalmente frente a ti. Puedes elegir entre diversos sabores base como vainilla, chocolate, fresa o matcha. Añade tus ingredientes favoritos: frutas frescas, galletas Oreo, chocolate, caramelo y mucho más. Una experiencia única y personalizable.",
      price: "$8.99",
      image: imagen1,
      isSpecial: true
    },
    {
      id: 2,
      title: "Crepes con Chocolate",
      description: "Deliciosos crepes rellenos de chocolate y decorados con fresas frescas.",
      fullDescription: "Crepes franceses tradicionales hechos con masa ligera y esponjosa, rellenos de chocolate belga derretido y decorados con fresas frescas de temporada. Servidos con crema batida casera y un toque de azúcar glass.",
      price: "$7.50",
      image: imagen2,
      isSpecial: false
    },
    {
      id: 3,
      title: "Mini Pancakes",
      description: "Esponjosos mini pancakes servidos con miel y frutas frescas.",
      fullDescription: "Una torre de mini pancakes americanos súper esponjosos, servidos con miel pura de abeja, frutas frescas de temporada y un toque de mantequilla derretida. Perfectos para compartir o disfrutar solo.",
      price: "$6.99",
      image: imagen3,
      isSpecial: false
    },
    {
      id: 4,
      title: "Rollos de Canela",
      description: "Deliciosos rollos de canela caseros con glaseado de vainilla.",
      fullDescription: "Rollos de canela horneados diariamente en nuestro local, con una mezcla perfecta de canela y azúcar moreno. Cubiertos con nuestro glaseado de vainilla casero que se derrite al contacto con el rollo caliente.",
      price: "$5.99",
      image: imagen4,
      isSpecial: false
    },
    {
      id: 5,
      title: "Tarta de Oreo",
      description: "Exquisita tarta de oreo con crema y decoración elegante.",
      fullDescription: "Impresionante tarta de tres capas con base de galletas Oreo trituradas, relleno de crema de queso con trozos de Oreo y cobertura de crema batida. Decorada con galletas enteras y un drizzle de chocolate negro.",
      price: "$12.99",
      image: imagen5,
      isSpecial: false
    },
    {
      id: 6,
      title: "Rollitos de Mango",
      description: "Rollitos frescos rellenos de mango y crema, decorados con frutas.",
      fullDescription: "Rollitos de crepe rellenos de mango fresco en cubos y crema pastelera ligera. Decorados con frutas tropicales frescas y un toque de coco rallado. Una opción refrescante y tropical perfecta para cualquier momento.",
      price: "$9.50",
      image: imagen6,
      isSpecial: false
    }
  ];

  const sizes = [
    { id: 1, name: "Un Sabor (Pequeño)", price: 6.99 },
    { id: 2, name: "Dos Sabores (Mediano)", price: 8.99 },
    { id: 3, name: "Tres Sabores (Grande)", price: 10.99 }
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
    setCustomizationStep(0);
  };

  const nextStep = () => {
    setCustomizationStep(customizationStep + 1);
  };

  const prevStep = () => {
    setCustomizationStep(customizationStep - 1);
  };

  const selectSize = (size) => {
    setCustomization({ ...customization, size });
  };

  const toggleFlavor = (flavor) => {
    const maxFlavors = customization.size ? customization.size.id : 1;
    if (customization.flavors.includes(flavor)) {
      setCustomization({
        ...customization,
        flavors: customization.flavors.filter(f => f !== flavor)
      });
    } else if (customization.flavors.length < maxFlavors) {
      setCustomization({
        ...customization,
        flavors: [...customization.flavors, flavor]
      });
    }
  };

  const toggleTopping = (topping) => {
    if (customization.toppings.includes(topping)) {
      setCustomization({
        ...customization,
        toppings: customization.toppings.filter(t => t !== topping)
      });
    } else {
      setCustomization({
        ...customization,
        toppings: [...customization.toppings, topping]
      });
    }
  };

  const calculateTotal = () => {
    const basePrice = customization.size ? customization.size.price : 0;
    const toppingsPrice = customization.toppings.length * 0.25;
    return basePrice + toppingsPrice;
  };

  const renderCustomizationStep = () => {
    switch (customizationStep) {
      case 0:
        return (
          <div className="customization-step">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Seleccione el tamaño</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className={`size-option ${customization.size?.id === size.id ? 'selected' : ''}`}
                  onClick={() => selectSize(size)}
                >
                  <div className="size-number">{size.id}</div>
                  <div className="size-name">{size.name}</div>
                  <div className="size-price">${size.price}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="step-indicators">
                <span className="step-dot active"></span>
                <span className="step-dot"></span>
                <span className="step-dot"></span>
                <span className="step-dot"></span>
              </div>
              <button
                className="next-btn"
                onClick={nextStep}
                disabled={!customization.size}
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 1:
        const maxFlavors = customization.size ? customization.size.id : 1;
        return (
          <div className="customization-step">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Seleccione los sabores</h2>
                <div className="flavors-container">
                  {Array.from({ length: maxFlavors }, (_, i) => (
                    <div key={i} className="flavor-dropdown">
                      <select
                        value={customization.flavors[i] || ''}
                        onChange={(e) => {
                          const newFlavors = [...customization.flavors];
                          newFlavors[i] = e.target.value;
                          setCustomization({ ...customization, flavors: newFlavors });
                        }}
                        className="w-full p-3 rounded-lg border-2 border-purple-300 bg-purple-100 text-gray-700 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Sabor {i + 1}</option>
                        {flavors.map((flavor) => (
                          <option key={flavor} value={flavor}>{flavor}</option>
                        ))}
                      </select>
                      <ChevronDown className="dropdown-icon" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="fruits-image">
                <img src="/api/placeholder/300/200" alt="Frutas frescas" className="rounded-lg" />
              </div>
            </div>
            <div className="flex justify-between items-center mt-8">
              <button className="back-btn" onClick={prevStep}>
                <ArrowLeft size={20} />
                Atrás
              </button>
              <div className="step-indicators">
                <span className="step-dot"></span>
                <span className="step-dot active"></span>
                <span className="step-dot"></span>
                <span className="step-dot"></span>
              </div>
              <button
                className="next-btn"
                onClick={nextStep}
                disabled={customization.flavors.filter(f => f).length < maxFlavors}
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="customization-step">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Seleccione los complementos</h2>
            <p className="text-gray-600 mb-6">Cada complemento agrega un costo de $ 0.25 centavos extra al helado</p>
            <div className="toppings-grid">
              {toppings.map((topping) => (
                <label key={topping} className="topping-checkbox">
                  <input
                    type="checkbox"
                    checked={customization.toppings.includes(topping)}
                    onChange={() => toggleTopping(topping)}
                  />
                  <span className="checkmark"></span>
                  {topping}
                </label>
              ))}
            </div>
            <div className="flex justify-between items-center mt-8">
              <button className="back-btn" onClick={prevStep}>
                <ArrowLeft size={20} />
                Atrás
              </button>
              <div className="step-indicators">
                <span className="step-dot"></span>
                <span className="step-dot"></span>
                <span className="step-dot active"></span>
                <span className="step-dot"></span>
              </div>
              <button className="next-btn" onClick={nextStep}>
                Siguiente
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="customization-step">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Orden Final</h2>
            <p className="text-gray-600 mb-6">Revisemos si todo está correcto con la orden</p>
            <div className="order-summary">
              <div className="order-icon">
                <div className="ice-cream-icon">🍦</div>
              </div>
              <div className="order-details">
                <div className="order-item">
                  <strong>Tamaño:</strong> {customization.size?.name}
                </div>
                <div className="order-item">
                  <strong>Sabores:</strong> {customization.flavors.filter(f => f).join(', ')}
                </div>
                {customization.toppings.length > 0 && (
                  <div className="order-item">
                    <strong>Complementos:</strong> {customization.toppings.join(', ')}
                  </div>
                )}
                <div className="order-total">
                  <strong>Total: ${calculateTotal().toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8">
              <button className="back-btn" onClick={prevStep}>
                <ArrowLeft size={20} />
                Atrás
              </button>
              <div className="step-indicators">
                <span className="step-dot"></span>
                <span className="step-dot"></span>
                <span className="step-dot"></span>
                <span className="step-dot active"></span>
              </div>
              <button className="add-to-cart-btn" onClick={closeModal}>
                Añadir al carrito
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-card">
              <div className="card-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                <button className="view-more-btn" onClick={() => openModal(item)}>
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedItem && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
              
              {!isCustomizing ? (
                <div className="modal-body">
                  <div className="modal-image">
                    <img src={selectedItem.image} alt={selectedItem.title} />
                  </div>
                  
                  <div className="modal-info">
                    <h2 className="modal-title">{selectedItem.title}</h2>
                    
                    <div className="modal-section">
                      <h3 className="modal-subtitle">Descripción:</h3>
                      <p className="modal-description">{selectedItem.fullDescription}</p>
                    </div>
                    
                    <div className="modal-section">
                      <h3 className="modal-subtitle">Precio:</h3>
                      <p className="modal-price">{selectedItem.price}</p>
                    </div>
                    
                    <button 
                      className="action-btn"
                      onClick={selectedItem.isSpecial ? startCustomization : closeModal}
                    >
                      {selectedItem.isSpecial ? 'Personalizar helado' : 'Añadir al carrito'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="customization-modal">
                  <div className="customization-header">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Personaliza tu helado</h1>
                  </div>
                  {renderCustomizationStep()}
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