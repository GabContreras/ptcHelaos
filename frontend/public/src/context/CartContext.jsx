import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Función para cargar el carrito desde localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      const cartTimestamp = localStorage.getItem('cartTimestamp');
      
      if (savedCart && cartTimestamp) {
        const now = new Date().getTime();
        const savedTime = parseInt(cartTimestamp);
        
        // Verificar si el carrito no ha expirado (24 horas)
        const CART_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
        
        if (now - savedTime < CART_EXPIRY) {
          const parsedCart = JSON.parse(savedCart);
          console.log('Carrito cargado desde localStorage:', parsedCart);
          return Array.isArray(parsedCart) ? parsedCart : [];
        } else {
          // Si el carrito ha expirado, limpiarlo
          console.log('Carrito expirado, limpiando localStorage');
          localStorage.removeItem('cart');
          localStorage.removeItem('cartTimestamp');
        }
      }
    } catch (error) {
      console.error('Error al cargar el carrito desde localStorage:', error);
      // Si hay error, limpiar localStorage corrupto
      localStorage.removeItem('cart');
      localStorage.removeItem('cartTimestamp');
    }
    return [];
  };

  // Inicializar el carrito desde localStorage
  const [cart, setCart] = useState(loadCartFromStorage);

  // Función para guardar el carrito en localStorage
  const saveCartToStorage = (cartData) => {
    try {
      if (cartData && cartData.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cartData));
        localStorage.setItem('cartTimestamp', new Date().getTime().toString());
        console.log('Carrito guardado en localStorage:', cartData);
      } else {
        // Si el carrito está vacío, remover del localStorage
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTimestamp');
        console.log('Carrito vacío, removido de localStorage');
      }
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error);
    }
  };

  // Efecto para guardar el carrito cada vez que cambie
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = (cartItem) => {
    try {
      // Validar que cartItem tenga la estructura correcta
      if (!cartItem || !cartItem.product || !cartItem.product._id) {
        console.error('Error: cartItem inválido', cartItem);
        return;
      }

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
        timestamp: cartItem.timestamp || new Date().toISOString(),
        // Agregar información de cuándo se agregó al carrito
        addedToCartAt: new Date().toISOString()
      };
      
      console.log('Agregando al carrito:', cartItemWithUniqueId);
      setCart((prev) => [...prev, cartItemWithUniqueId]);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };

  const removeFromCart = (cartItemId) => {
    try {
      console.log('Removiendo del carrito item con ID:', cartItemId);
      // Usar el cartItemId único para remover items específicos
      setCart((prev) => {
        const newCart = prev.filter((item) => item.cartItemId !== cartItemId);
        console.log('Carrito después de remover:', newCart);
        return newCart;
      });
    } catch (error) {
      console.error('Error al remover producto del carrito:', error);
    }
  };

  // Nueva función para remover por ID de producto (si necesitas mantener compatibilidad)
  const removeFromCartByProductId = (productId) => {
    try {
      console.log('Removiendo del carrito todos los items del producto:', productId);
      setCart((prev) => {
        const newCart = prev.filter((item) => item._id !== productId);
        console.log('Carrito después de remover por product ID:', newCart);
        return newCart;
      });
    } catch (error) {
      console.error('Error al remover producto por ID del carrito:', error);
    }
  };

  const clearCart = () => {
    try {
      console.log('Limpiando carrito completo');
      setCart([]);
      localStorage.removeItem("cart");
      localStorage.removeItem("cartTimestamp");
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
    }
  };

  // Función para obtener la cantidad de items en el carrito
  const getCartItemCount = () => {
    return cart.length;
  };

  // Función para verificar si un producto específico está en el carrito
  const isProductInCart = (productId) => {
    return cart.some(item => item._id === productId);
  };

  // Función para obtener todos los items de un producto específico
  const getProductItemsInCart = (productId) => {
    return cart.filter(item => item._id === productId);
  };

  // Calcular total con mejor manejo de errores
  const total = useMemo(() => {
    try {
      return cart.reduce((acc, item) => {
        const itemPrice = parseFloat(item.totalPrice) || 0;
        return acc + itemPrice;
      }, 0);
    } catch (error) {
      console.error('Error al calcular el total del carrito:', error);
      return 0;
    }
  }, [cart]);

  // Calcular subtotal (sin delivery fee si es que lo tienes)
  const subtotal = useMemo(() => {
    return total; // Por ahora es igual al total, pero puedes modificar si tienes fees adicionales
  }, [total]);

  // Log para debugging (solo en desarrollo)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Cart State Updated:', {
        itemCount: cart.length,
        total: total,
        items: cart.map(item => ({
          id: item.cartItemId,
          name: item.name,
          price: item.totalPrice
        }))
      });
    }
  }, [cart, total]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      removeFromCartByProductId,
      clearCart, 
      total,
      subtotal,
      getCartItemCount,
      isProductInCart,
      getProductItemsInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};