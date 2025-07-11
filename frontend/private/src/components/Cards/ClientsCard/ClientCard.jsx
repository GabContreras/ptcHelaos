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
          
          <div className="client-birthday">
            <span className="contact-label">cumpleaños:</span>
            <span className="contact-value">{formatDate(birthday)}</span>
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
            className="delete-btn"
            onClick={handleDelete}
            disabled={isLoading}
            title="Eliminar cliente"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  export default ClientCard;  