// EventsCard.jsx - Componente para mostrar información de eventos
import React from 'react';
import './EventsCard.css';

const EventsCard = ({ data, onEdit, onDelete, isLoading }) => {
  // Extraer información del evento
  const {
    _id,
    name = 'Sin nombre',
    date,
    address = 'Sin dirección',
    type = 'Sin tipo',
    isActive = true,
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
      const eventDate = new Date(dateString);
      return eventDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const eventDate = new Date(dateString);
      return eventDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return '';
    }
  };

  const getEventStatus = () => {
    if (!date) return 'sin-fecha';
    
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'pasado';
    if (diffDays === 0) return 'hoy';
    if (diffDays <= 7) return 'proximo';
    return 'futuro';
  };

  const getEventIcon = () => {
    const typeIcons = {
      'Cumpleaños': '🎂',
      'Boda': '💒',
      'Graduación': '🎓',
      'Aniversario': '💕',
      'Corporativo': '🏢',
      'Fiesta Infantil': '🎈',
      'Reunión Familiar': '👨‍👩‍👧‍👦',
      'Celebración': '🎉',
      'Otro': '📅'
    };
    return typeIcons[type] || '📅';
  };

  const getStatusInfo = () => {
    const status = getEventStatus();
    const statusConfig = {
      'hoy': {
        text: 'HOY',
        className: 'status-today',
        color: '#FF6B6B'
      },
      'proximo': {
        text: 'PRÓXIMO',
        className: 'status-upcoming',
        color: '#FFB84D'
      },
      'futuro': {
        text: 'PROGRAMADO',
        className: 'status-future',
        color: '#4ECDC4'
      },
      'pasado': {
        text: 'FINALIZADO',
        className: 'status-past',
        color: '#95A5A6'
      },
      'sin-fecha': {
        text: 'SIN FECHA',
        className: 'status-no-date',
        color: '#BDC3C7'
      }
    };
    return statusConfig[status] || statusConfig['sin-fecha'];
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`event-card ${!isActive ? 'inactive' : ''} ${statusInfo.className}`}>
      {/* Header del evento */}
      <div className="event-header">
        <div className="event-icon">
          {getEventIcon()}
        </div>
        
        <div className="event-title-section">
          <h3 className="event-name">{name}</h3>
          <span className="event-type">{type}</span>
        </div>

        <div className="event-status-badge" style={{ backgroundColor: statusInfo.color }}>
          {statusInfo.text}
        </div>
      </div>

      {/* Información principal */}
      <div className="event-content">
        <div className="event-info-item">
          <span className="info-icon"></span>
          <div className="info-content">
            <span className="info-label">FECHA:</span>
            <span className="info-value">{formatDate(date)}</span>
            {formatTime(date) && (
              <span className="info-time">{formatTime(date)}</span>
            )}
          </div>
        </div>

        <div className="event-info-item">
          <span className="info-icon"></span>
          <div className="info-content">
            <span className="info-label">UBICACIÓN:</span>
            <span className="info-value">{address}</span>
          </div>
        </div>

        {/* Estado activo/inactivo */}
        <div className="event-info-item">
          <span className="info-icon">{isActive ? '' : ''}</span>
          <div className="info-content">
            <span className="info-label">ESTADO:</span>
            <span className={`info-value ${isActive ? 'active' : 'inactive'}`}>
              {isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="event-actions">
        <button 
          className="edit-btn"
          onClick={handleEdit}
          disabled={isLoading}
          title="Editar evento"
        >
          ✏️
        </button>
        <button 
          className="delete-btn"
          onClick={handleDelete}
          disabled={isLoading}
          title="Eliminar evento"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default EventsCard;