import React from 'react';

function PaymentMethod() {
    const [opcion, setOpcion] = React.useState(null);

  const seleccionarOpcion = (op) => {
    setOpcion(op);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', fontFamily: 'Arial' }}>
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

      {/* Campos adicionales si se elige tarjeta */}
      {opcion === 'tarjeta' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Nombre del titular"
            style={{
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
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="MM/AA"
              maxLength="5"
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                flex: 1,
              }}
            />
            <input
              type="text"
              placeholder="CVC"
              maxLength="4"
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                flex: 1,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentMethod;