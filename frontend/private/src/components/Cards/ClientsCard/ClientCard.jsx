// ClientCard.jsx - Componente para mostrar información de clientes
import React from 'react';
import './ClientCard.css';

const ClientCard = ({ data, onEdit, onDelete, isLoading }) => {
  // Extraer información del cliente
  const {
    _id,
    name = 'Sin nombre',
    email = 'Sin email',
    phone = 'Sin teléfono',
    address = 'Sin dirección',
    birthday,
    frequentCustomer = false,
    isVerified = false,
    createdAt
  } = data || {};

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  };

  // Truncar dirección si es muy larga
  const getTruncatedAddress = (addr) => {
    if (!addr || addr === 'Sin dirección') return addr;
    return addr.length > 60 ? `${addr.substring(0, 60)}...` : addr;
  };

  return (
    <div className="client-card">
      <div className="client-card-header">
        <div className="client-name-section">
          <h3 className="client-name">{name}</h3>
          <div className="client-status">
            {frequentCustomer && (
              <span className="frequent-badge">⭐</span>
            )}
          </div>
        </div>
        
        <div className="client-contact-info">
          <div className="contact-item">
            <span className="contact-label">contacto:</span>
            <span className="contact-value">{phone}</span>
          </div>
          <div className="contact-item">
            <span className="contact-value">{email}</span>
          </div>
        </div>
        
        <div className="client-address">
          <span className="contact-label">dirección:</span>
          <span className="contact-value">{getTruncatedAddress(address)}</span>
        </div>
      </div>

      <div className="client-actions">
        <button 
          className="edit-btn"
          onClick={handleEdit}
          disabled={isLoading}
          title="Editar cliente"
        >
          ✏️
        </button>
        <button 
          className="view-map-btn"
          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank')}
          disabled={!address || address === 'Sin dirección'}
        >
          ver en mapa
        </button>
      </div>
    </div>
  );
};

export default ClientCard;