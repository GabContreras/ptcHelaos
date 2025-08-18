import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (cartItem) => {
    // Crear un item único para el carrito con un ID especial
    const cartItemWithUniqueId = {
      ...cartItem,
      cartItemId: `${cartItem.product._id}_${Date.now()}_${Math.random()}`, // ID único para cada item del carrito
      _id: cartItem.product._id, // Mantener el ID original del producto para compatibilidad
      // Agregar todos los datos del producto al nivel raíz para fácil acceso
      ...cartItem.product,
      // Mantener los datos específicos del carrito
      customization: cartItem.customization,
      totalPrice: cartItem.totalPrice,
      timestamp: cartItem.timestamp
    };
    
    setCart((prev) => [...prev, cartItemWithUniqueId]);
  };

  const removeFromCart = (cartItemId) => {
    // Usar el cartItemId único para remover items específicos
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Nueva función para remover por ID de producto (si necesitas mantener compatibilidad)
  const removeFromCartByProductId = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    localStorage.removeItem("cartTimestamp");
  };

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      removeFromCartByProductId,
      clearCart, 
      total 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);