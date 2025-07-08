// Employees.jsx - Página principal de empleados
import React, { useEffect, useState } from 'react';
import { useEmployeesManager } from '../../hooks/EmployeesHook/useEmployees';
import EmployeeCard from '../../components/Cards/EmployeesCard/EmployeeCard';
import UniversalModal from '../../components/Modals/UniversalModal/UniversalModal';
import toast, { Toaster } from 'react-hot-toast';
import './Employees.css';

const EmployeesPage = () => {
  const {
    // Estados principales
    employees,
    showModal,
    setShowModal,
    showDeleteModal,
    employeeToDelete,
    isLoading,
    error,
    success,
    setError,
    isEditing,
    currentEmployeeId,
    
    // Estados del formulario
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
    
    // Funciones
    fetchEmployees,
    handleSubmit,
    startDeleteEmployee,
    confirmDeleteEmployee,
    cancelDeleteEmployee,
    resetForm,
    handleEditEmployee,
    handleAddNew,
    handleRefresh,
  } = useEmployeesManager();

  // Estados locales para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [sortBy, setSortBy] = useState('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar empleados al montar el componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Función para filtrar empleados por búsqueda
  const getFilteredEmployees = () => {
    if (!searchTerm.trim()) return employees;
    
    return employees.filter(employee => 
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone?.includes(searchTerm) ||
      employee.dui?.includes(searchTerm)
    );
  };

  // Función para ordenar empleados
  const getSortedEmployees = (employeesToSort) => {
    const sorted = [...employeesToSort];
    
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => 
          (a.name || '').localeCompare(b.name || '')
        );
      case 'name-desc':
        return sorted.sort((a, b) => 
          (b.name || '').localeCompare(a.name || '')
        );
      case 'email-asc':
        return sorted.sort((a, b) => 
          (a.email || '').localeCompare(b.email || '')
        );
      case 'salary-asc':
        return sorted.sort((a, b) => (a.salary || 0) - (b.salary || 0));
      case 'salary-desc':
        return sorted.sort((a, b) => (b.salary || 0) - (a.salary || 0));
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
      default:
        return sorted;
    }
  };

  // Obtener empleados procesados (filtrados y ordenados)
  const getProcessedEmployees = () => {
    const filtered = getFilteredEmployees();
    return getSortedEmployees(filtered);
  };

  const processedEmployees = getProcessedEmployees();

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = processedEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedEmployees.length / itemsPerPage);

  // Resetear página al cambiar filtros o items per page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage]);

  // Manejar búsqueda desde el Header
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Manejar ordenamiento desde el Header
  const handleSort = (sortOption) => {
    setSortBy(sortOption);
  };

  // Manejar cambio de items per page
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
  };
  
  // Mostrar notificaciones de error y éxito
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);
  
  return (
    <div className="employees-page">
      {/* Mostrar indicador de carga */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Cargando...</span>
        </div>
      )}

      {/* Información de resultados */}
      {!isLoading && (
        <div className="results-info">
          <span>
            Mostrando {currentEmployees.length} de {processedEmployees.length} empleados
            {searchTerm && ` (filtrados de ${employees.length} total)`}
          </span>
        </div>
      )}
      
      {/* Lista de empleados */}
      <div className="employees-list">
        {currentEmployees.length > 0 ? (
          currentEmployees.map(employee => (
            <EmployeeCard 
              key={employee._id} 
              data={employee}
              onEdit={() => handleEditEmployee(employee)}
              onDelete={() => startDeleteEmployee(employee._id)}
              isLoading={isLoading}
            />
          ))
        ) : (
          !isLoading && (
            <div className="no-data-message">
              {searchTerm ? (
                <>
                  <p>No se encontraron empleados que coincidan con "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <>
                  <p>No hay empleados registrados. Agrega el primer empleado.</p>
                </>
              )}
            </div>
          )
        )}
        
        {/* Botón de agregar con líneas punteadas */}
        {!isLoading && (
          <div className="add-employee-container" onClick={handleAddNew}>
            <button className="add-employee-btn-inline">
              <div className="add-icon">+</div>
              <span className="add-text">Agregar</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de edición/creación usando UniversalModal */}
      <UniversalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        type="form"
        title={isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
        size="large"
      >
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
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
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
      </UniversalModal>
      
      {/* Modal de confirmación de eliminación usando UniversalModal */}
      <UniversalModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteEmployee}
        onConfirm={confirmDeleteEmployee}
        type="delete"
        title="Eliminar Empleado"
        message="¿Estás seguro de que deseas eliminar este empleado?"
        itemName={employeeToDelete?.name || ""}
        isLoading={isLoading}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default EmployeesPage;