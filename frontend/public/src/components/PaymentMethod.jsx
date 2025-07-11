import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './PaymentMethod.css';
import Button from '../assets/Button'; // Adjust the import path as necessary

function PaymentMethod({ subtotal, descuento, total, envio }) {
  const [opcion, setOpcion] = React.useState(null);

  const navigate = useNavigate();

  const seleccionarOpcion = (op) => {
    setOpcion(op);
  };

  const handlePago = () => {
    Swal.fire({
      title: '¡Pedido realizado!',
      text: 'Tu pedido fue procesado exitosamente.',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Regresar al inicio',
      cancelButtonText: 'Rastrear mi pedido',
      customClass: {
        container: 'swal2-blur'
    }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate('/AboutUs');
      }
    });
  };

  return (
    <div className="payment-container">
      <h3 className="payment-title">Selecciona un método de pago:</h3>

        <div className="payment-methods">
            <div className="payment-options">
                <button
                onClick={() => seleccionarOpcion('efectivo')}
                className={`payment-button ${opcion === 'efectivo' ? 'selected' : ''}`}
                >
                Efectivo
                </button>

                <button
                onClick={() => seleccionarOpcion('tarjeta')}
                className={`payment-button ${opcion === 'tarjeta' ? 'selected' : ''}`}
                >
                Tarjeta
                </button>
            </div>

            {opcion === 'tarjeta' && (
                <div className="card-details">
                    <div className="card-form">
                        <input type="text" placeholder="Nombre del titular" className="card-input" />
                        <input type="text" placeholder="Número de tarjeta" maxLength="16" className="card-input" />
                    </div>
                    <div className="card-form-row">
                        <input type="text" placeholder="MM/AA" maxLength="5" className="card-input-small" />
                        <input type="text" placeholder="CVC" maxLength="3" className="card-input-small" />
                    </div>
                </div>
            )}
        </div>

      <div className="summary">
        <h4>subtotal: {subtotal}</h4>
        <h4>método de pago: {opcion ? opcion : 'Selecciona un método'}</h4>
        <h4>envio: {envio}</h4>
        <h4>descuento: {descuento}</h4>
        <h2>Total: {total}</h2>
        <Button titulo="Pagar" color="#33A9FE" tipoColor="background" onClick={handlePago}/>
      </div>

    </div>
  );
}

export default PaymentMethod;
