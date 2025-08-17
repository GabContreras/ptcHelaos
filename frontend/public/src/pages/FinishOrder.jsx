import React, { useState } from 'react';
import Cart from "../components/Cart"
import PaymentMethod from '../components/PaymentMethod';
import '../styles/FinishOrder.css';
import { useCart } from '../context/CartContext';
import LocationPicker from "../components/LocationPicker";

function FinishOrder() {

    const { total } = useCart();

    const envio = 2.0;
    const totalFinal = total + envio;

  return (
    <>
    <div className="finishOrder">
            <div className='resume'>
                <h1>Tu pedido:</h1>
                <div className='cart'>
                    <Cart/>
                </div>
            </div>
            <div className='orderDetails'>
                <div className="direction">
                        
                    <h2>Selecciona la dirección de entrega:</h2>

                    <LocationPicker />
                        
                    <div className="details"> 
                        <h4>Punto de referencia (opcional):</h4>
                        <textarea
                            rows={5}
                            maxLength={300}
                            placeholder="(Ejemplo:) Esquina de la plaza mayor, frente a la iglesia principal."
                        ></textarea>
                    </div>   

                    <div className="details">
                        <h4>Instrucciones de entrega (opcional):</h4>
                        <textarea
                            rows={5}
                            maxLength={300}
                            placeholder="(Ejemplo:) Entregar en la puerta principal, llamar al timbre y esperar."
                        ></textarea>
                    </div>
                </div>
                <div className="total">
                    <PaymentMethod 
                    subtotal={`$ ${total.toFixed(2)}`}
                    envio={`$ ${envio.toFixed(2)}`}
                    total={`$ ${totalFinal.toFixed(2)}`}
                    />
                </div>
            </div>
        </div>
    </>
  );
}

export default FinishOrder;