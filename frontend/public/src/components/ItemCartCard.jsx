import React from 'react';

function ItemCard({ item, onRemove }) {
  const [expandido, setExpandido] = React.useState(false);

  const toggleExpandido = () => setExpandido(!expandido);

  // Extraemos datos desde item.product
  const { images, name, description } = item.product;

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
      {Array.isArray(images) && images.length > 0 ? (
        <img
          src={images[0].url}
          alt={name}
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      ) : (
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '8px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#888',
          }}
        >
          Sin imagen
        </div>
      )}

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
            ${item.totalPrice.toFixed(2)}
          </p>
        </div>

        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
          {expandido && (
            <div>
              <p style={{ margin: '4px 0' }}>Descripción: {description}</p>

              {/* Mostrar personalización si existe */}
              {item.customization && (
                <div style={{ marginTop: '8px' }}>
                  {/* Tamaño */}
                  {item.customization.size && (
                    <p>
                      <strong>Tamaño:</strong> {item.customization.size?.name || "Sin nombre"}
                      {item.customization.size?.price > 0 &&
                        ` (+$${item.customization.size.price})`}
                    </p>
                  )}

                  {/* Sabores */}
                  {item.customization.flavors?.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      <p><strong>Sabores:</strong></p>
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {item.customization.flavors.map((f, idx) => (
                          <li key={idx}>
                            {f?.name || f?.label || JSON.stringify(f)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Toppings */}
                  {item.customization.toppings?.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      <p><strong>Toppings:</strong></p>
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {item.customization.toppings.map((t, idx) => (
                          <li key={idx}>
                            {t?.name || t?.label || JSON.stringify(t)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
          
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
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