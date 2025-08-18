import React from "react";
import { useCart } from "../context/CartContext";
import ItemCard from "./ItemCartCard";

function Cart() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  
  // Debug: mostrar estructura completa del carrito
  console.log('Carrito completo:', cart);
  console.log('Primer item del carrito:', cart[0]);

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Tu Carrito ({cart.length} items)</h2>
        {cart.length > 0 && (
          <p className="cart-total">Total: ${total.toFixed(2)}</p>
        )}
      </div>
      
      <div className="items">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
            <p>¡Agrega algunos productos deliciosos!</p>
          </div>
        ) : (
          cart.map(item => {
            // Debug: mostrar datos de cada item
            console.log('Item individual:', {
              cartItemId: item.cartItemId,
              name: item.name,
              basePrice: item.basePrice,
              totalPrice: item.totalPrice,
              customization: item.customization,
              allData: item
            });
            
            return (
              <ItemCard
                key={item.cartItemId} // Usar el ID único del carrito
                item={item} // Ahora el item contiene todos los datos del producto
                onRemove={() => removeFromCart(item.cartItemId)} // Usar el ID único para remover
              />
            );
          })
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="cart-actions">
          <div className="cart-summary">
            <p><strong>Total a pagar: ${total.toFixed(2)}</strong></p>
          </div>
          <button 
            className="btn-clear-cart"
            onClick={clearCart}
          >
            Vaciar carrito
          </button>
          <button 
            className="btn-checkout"
            onClick={() => {
              // Aquí puedes agregar la lógica para proceder al checkout
              console.log('Procediendo al checkout con:', cart);
            }}
          >
            Proceder al pago
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;