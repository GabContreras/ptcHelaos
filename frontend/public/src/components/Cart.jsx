import React from "react";
import { useCart } from "../context/CartContext";
import ItemCard from "./ItemCartCard"

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="cart">
      <div className="items">
        {cart.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          cart.map(item => (
            <ItemCard
              key={item._id}
              item={item}
              onRemove={() => removeFromCart(item._id)}
            />
          ))
        )}
      </div>
      {cart.length > 0 && (
        <button onClick={clearCart}>Vaciar carrito</button>
      )}
    </div>
  );
}

export default Cart;