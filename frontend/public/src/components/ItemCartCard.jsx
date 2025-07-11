import React, { useState } from 'react';

function ItemCard({ imagen, titulo, resumen,  tamano, topp1, topp2, compl1, compl2, precio }) {
  const [expandido, setExpandido] = React.useState(false);

  const toggleExpandido = () => {
    setExpandido(!expandido);
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'flex-start',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '500px',
        margin: '8px auto',
        boxShadow: '2px 2px 12px #00000025',
      }}
    >
      <img
        src={imagen}
        alt={titulo}
        style={{
          width: '70px',
          height: '70px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginRight: '16px',
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px' }}>{titulo}</h3>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#28a745' }}>
            ${precio}
          </p>
        </div>

        <p style={{ margin: 0 }}>{resumen}</p>

        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
          {expandido ? (
            <div>
              <p style={{ margin: '4px 0' }}>Tamaño: {tamano}</p>
              <p style={{ margin: '4px 0' }}>Toppings:</p>
              <ul style={{ marginTop: 0, paddingLeft: '18px' }}>
                <li>{topp1}</li>
                <li>{topp2}</li>
              </ul>
              <p style={{ margin: '4px 0' }}>Complementos:</p>
              <ul style={{ marginTop: 0, paddingLeft: '18px' }}>
                <li>{compl1}</li>
                <li>{compl2}</li>
              </ul>
            </div>
          ) : (
            <p style={{ margin: 0 }}></p>
          )}

          <p
            onClick={toggleExpandido}
            style={{
              textAlign: 'end',
              color: '#007bff',
              cursor: 'pointer',
              marginTop: '8px',
              fontWeight: 'bold',
              userSelect: 'none',
              marginBlockEnd: 0,
            }}
          >
            {expandido ? 'Ver menos ▲' : 'Ver más ▼'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;