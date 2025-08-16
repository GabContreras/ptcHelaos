import React from 'react';
import NavBar from '../components/NavBar';
import Cart from "../components/Cart"
import PaymentMethod from '../components/PaymentMethod';
import '../styles/FinishOrder.css';
import Button from '../assets/Button';

function FinishOrder() {
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
                    <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7751.636619526111!2d-89.20199709999994!3d13.729447400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2ssv!4v1751664838209!5m2!1ses-419!2ssv" 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                    
                    <h4>Punto de referencia (opcional):</h4>
                    <textarea
                        rows={3}
                        maxLength={300}
                        placeholder="(Ejemplo:) Esquina de la plaza mayor, frente a la iglesia principal."
                    ></textarea>

                    <h4>Instrucciones de entrega (opcional):</h4>
                    <textarea
                        rows={3}
                        maxLength={300}
                        placeholder="(Ejemplo:) Entregar en la puerta principal, llamar al timbre y esperar."
                    ></textarea>
                </div>
                <div className="total">
                    <PaymentMethod 
                    subtotal="$ 30.50"
                    envio="$ 02.00"
                    descuento="$ 02.10"
                    total="$ 27.40"
                    />
                </div>
            </div>
        </div>
    </>
  );
}

export default FinishOrder;