// ClientEditModal.jsx - Modal para crear/editar clientes
import React from 'react';
import './ClientEditModal.css';

const ClientEditModal = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  address,
  setAddress,
  birthday,
  setBirthday,
  frequentCustomer,
  setFrequentCustomer,
  handleSubmit,
  isLoading,
  isEditing,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa el nombre completo"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0000-0000"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                {isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEditing ? 'Dejar vacío para mantener actual' : 'Contraseña'}
                disabled={isLoading}
                required={!isEditing}
                minLength="6"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Dirección</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección completa"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthday">Fecha de Nacimiento</label>
              <input
                type="date"
                id="birthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={frequentCustomer}
                  onChange={(e) => setFrequentCustomer(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                Cliente Frecuente
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientEditModal;