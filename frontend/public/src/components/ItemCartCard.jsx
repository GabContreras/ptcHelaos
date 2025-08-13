import React, { useState } from 'react';

function ItemCard({ item, onRemove }) {
  const [expandido, setExpandido] = React.useState(false);

  const toggleExpandido = () => {
    setExpandido(!expandido);
  };

  // Desestructuramos las propiedades del producto
  const { images, name, basePrice, description } = item;
  console.log(images, name)
  return (
    <div
      style={{
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'flex-start',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '12px auto',
        boxShadow: '2px 2px 12px #00000025',
      }}
    >
      <img
        src={Array.isArray(images) && images.length > 0 ? images[0].url : ''}
        alt={name}
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />
      <div style={{ flex: 1, padding: '16px 16px 0px 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px' }}>{name}</h3>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#28a745' }}>
            ${basePrice}
          </p>
        </div>

        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
          {expandido && (
            <div>
              <p style={{ margin: '4px 0' }}>Descripción: {description}</p>
            </div>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>

          {/* Botón para eliminar del carrito */}
          <button
            onClick={onRemove}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
            }}
          >
            Eliminar
          </button>

          {/* opcion para desplegar mas informacion */}
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
    </div>
  );
}

export default ItemCard;