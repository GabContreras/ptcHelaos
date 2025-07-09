// Clients.jsx - Página principal de clientes
import React, { useEffect, useState } from 'react';
import { useClientsManager } from '../../hooks/ClientsHook/useClient';
import ClientCard from '../../components/Cards/ClientsCard/ClientCard';
import UniversalModal from '../../components/Modals/UniversalModal/UniversalModal';
import toast, { Toaster } from 'react-hot-toast';
import './Clients.css';

const ClientsPage = () => {
  const {
    // Estados principales
    clients,
    showModal,
    setShowModal,
    showDeleteModal,
    clientToDelete,
    isLoading,
    error,
    success,
    setError,
    isEditing,
    currentClientId,
    
    // Estados del formulario
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
    
    // Funciones
    fetchClients,
    handleSubmit,
    startDeleteClient,
    confirmDeleteClient,
    cancelDeleteClient,
    resetForm,
    handleEditClient,
    handleAddNew,
    handleRefresh,
  } = useClientsManager();

  // Estados locales para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [sortBy, setSortBy] = useState('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClients();
  }, []);

  // Función para filtrar clientes por búsqueda
  const getFilteredClients = () => {
    if (!searchTerm.trim()) return clients;
    
    return clients.filter(client => 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
    );
  };

  // Función para ordenar clientes
  const getSortedClients = (clientsToSort) => {
    const sorted = [...clientsToSort];
    
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

  // Obtener clientes procesados (filtrados y ordenados)
  const getProcessedClients = () => {
    const filtered = getFilteredClients();
    return getSortedClients(filtered);
  };

  const processedClients = getProcessedClients();

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = processedClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedClients.length / itemsPerPage);

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
    <div className="clients-page">
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
            Mostrando {currentClients.length} de {processedClients.length} clientes
            {searchTerm && ` (filtrados de ${clients.length} total)`}
          </span>
        </div>
      )}
      
      {/* Lista de clientes */}
      <div className="clients-list">
        {currentClients.length > 0 ? (
          currentClients.map(client => (
            <ClientCard 
              key={client._id} 
              data={client}
              onEdit={() => handleEditClient(client)}
              onDelete={() => startDeleteClient(client._id)}
              isLoading={isLoading}
            />
          ))
        ) : (
          !isLoading && (
            <div className="no-data-message">
              {searchTerm ? (
                <>
                  <p>No se encontraron clientes que coincidan con "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <>
                  <p>No hay clientes registrados. Agrega el primer cliente.</p>
                </>
              )}
            </div>
          )
        )}
        
        {/* Botón de agregar con líneas punteadas */}
        {!isLoading && (
          <div className="add-client-container" onClick={handleAddNew}>
            <button className="add-client-btn-inline">
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
        title={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="medium"
      >
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
        onClose={cancelDeleteClient}
        onConfirm={confirmDeleteClient}
        type="delete"
        title="Eliminar Cliente"
        message="¿Estás seguro de que deseas eliminar este cliente?"
        itemName={clientToDelete?.name || ""}
        isLoading={isLoading}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default ClientsPage;