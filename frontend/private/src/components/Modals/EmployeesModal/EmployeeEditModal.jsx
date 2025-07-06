// EmployeeEditModal.jsx - Modal para crear/editar empleados
import React from 'react';
import './EmployeeEditModal.css';

const EmployeeEditModal = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  hireDate,
  setHireDate,
  salary,
  setSalary,
  dui,
  setDui,
  handleSubmit,
  isLoading,
  isEditing,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="employee-form">
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
              <label htmlFor="dui">DUI</label>
              <input
                type="text"
                id="dui"
                value={dui}
                onChange={(e) => setDui(e.target.value)}
                placeholder="12345678-9"
                disabled={isLoading}
                required
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hireDate">Fecha de Contratación</label>
              <input
                type="date"
                id="hireDate"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salario</label>
              <input
                type="number"
                id="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="1000.00"
                disabled={isLoading}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group full-width">
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

export default EmployeeEditModal;