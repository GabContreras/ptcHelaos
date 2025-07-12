// EmployeeCard.jsx - Componente para mostrar información de empleados
import React, { useState } from 'react';
import './EmployeeCard.css';

const EmployeeCard = ({ data, onEdit, onDelete, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Extraer información del empleado
  const {
    _id,
    name = 'Sin nombre',
    email = 'Sin email',
    phone = 'Sin teléfono',
    hireDate,
    salary = 0,
    dui = 'Sin DUI',
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
    if (!dateString) return 'dd/mm/yyyy';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return 'dd/mm/yyyy';
    }
  };

  const formatSalary = (amount) => {
    if (!amount) return '$0.00';
    return `$${amount.toFixed(2)}`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="employee-card">
      <div className="employee-card-header">
        <div className="employee-name-section">
          <h3 className="employee-name">{name}</h3>
        </div>
        
        <div className="employee-contact-info">
          <div className="contact-item">
            <span className="contact-label">Teléfono:</span>
            <span className="contact-value">{phone}</span>
          </div>
          <div className="contact-item">
            <span className="contact-value">{email}</span>
          </div>
        </div>
        
        <div className="employee-details-grid">
          <div className="detail-item">
            <span className="detail-label">fecha de contratacion:</span>
            <span className="detail-value">{formatDate(hireDate)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">salario:</span>
            <span className="detail-value">{formatSalary(salary)}</span>
          </div>
          
          <div className="detail-item password-item">
            <span className="detail-label">contraseña:</span>
            <div className="password-container">
              <span className="detail-value">
                {showPassword ? "*********" : '**********'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="employee-actions">
        <button 
          className="edit-btn"
          onClick={handleEdit}
          disabled={isLoading}
          title="Editar empleado"
        >
          ✏️
        </button>
        <button 
          className="delete-btn"
          onClick={handleDelete}
          disabled={isLoading}
          title="Eliminar empleado"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;