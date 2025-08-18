import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedTimestamp = localStorage.getItem("cartTimestamp");

    if (savedCart && savedTimestamp) {
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (now - parseInt(savedTimestamp, 10) < oneHour) {
        setCart(JSON.parse(savedCart));
      } else {
        localStorage.removeItem("cart");
        localStorage.removeItem("cartTimestamp");
      }
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("cartTimestamp", Date.now().toString());
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
