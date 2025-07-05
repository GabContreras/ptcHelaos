// Employees.jsx - Página principal de empleados
import React, { useEffect, useState } from 'react';
import { useEmployeesManager } from '../../hooks/EmployeesHook/useEmployees';
import EmployeeCard from '../../components/Cards/EmployeesCard/EmployeeCard';
import EmployeeEditModal from '../../components/Modals/EmployeesModal/EmployeeEditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
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
      
      {/* Modal de edición/creación */}
      {showModal && (
        <EmployeeEditModal 
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          hireDate={hireDate}
          setHireDate={setHireDate}
          salary={salary}
          setSalary={setSalary}
          dui={dui}
          setDui={setDui}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isEditing={isEditing}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
        />
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDeleteEmployee}
          onConfirm={confirmDeleteEmployee}
          title="Eliminar Empleado"
          message="¿Estás seguro de que deseas eliminar este empleado?"
          itemName={employeeToDelete?.name || ""}
          isLoading={isLoading}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default EmployeesPage;