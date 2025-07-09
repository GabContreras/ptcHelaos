import React from 'react';

function PaymentMethod({subtotal, descuento, total}) {
    const [opcion, setOpcion] = React.useState(null);

  const seleccionarOpcion = (op) => {
    setOpcion(op);
  };

  return (
    <div style={{ fontFamily: 'Arial', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h3 style={{ marginBottom: '10px' }}>Selecciona un método de pago:</h3>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'center' }}>
        <button
          onClick={() => seleccionarOpcion('efectivo')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '2px solid #007bff',
            backgroundColor: opcion === 'efectivo' ? '#007bff' : 'white',
            color: opcion === 'efectivo' ? 'white' : '#007bff',
            cursor: 'pointer',
          }}
        >
          Efectivo
        </button>

        <button
          onClick={() => seleccionarOpcion('tarjeta')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '2px solid #007bff',
            backgroundColor: opcion === 'tarjeta' ? '#007bff' : 'white',
            color: opcion === 'tarjeta' ? 'white' : '#007bff',
            cursor: 'pointer',
          }}
        >
          Tarjeta
        </button>
      </div>

      {opcion === 'tarjeta' && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Nombre del titular"
            style={{
              width: '70%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
          <input
            type="text"
            placeholder="Número de tarjeta"
            maxLength="16"
            style={{
              width: '70%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
          <div style={{ width: '70%', display: 'flex', justifyContent: 'space-around'}}>
            <input
              type="text"
              placeholder="MM/AA"
              maxLength="5"
              style={{
                width: '45%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
              }}
            />
            <input
              type="text"
              placeholder="CVC"
              maxLength="4"
              style={{
                width: '45%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      )}

      <div>
        <h4>subtotal: {subtotal}</h4>
        <h4>descuento: {descuento}</h4>
        <h2>Total: {total}</h2>
      </div>

    </div>
  );
}

export default PaymentMethod;