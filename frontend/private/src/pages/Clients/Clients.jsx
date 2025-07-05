// Clients.jsx - Página principal de clientes
import React, { useEffect, useState } from 'react';
import { useClientsManager } from '../../hooks/ClientsHook/useClient';
import ClientCard from '../../components/Cards/ClientsCard/ClientCard';
import ClientEditModal from '../../components/Modals/ClientsModal/ClientEditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
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
      
      
      
      {/* Modal de edición/creación */}
      {showModal && (
        <ClientEditModal 
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          address={address}
          setAddress={setAddress}
          birthday={birthday}
          setBirthday={setBirthday}
          frequentCustomer={frequentCustomer}
          setFrequentCustomer={setFrequentCustomer}
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
          onClose={cancelDeleteClient}
          onConfirm={confirmDeleteClient}
          title="Eliminar Cliente"
          message="¿Estás seguro de que deseas eliminar este cliente?"
          itemName={clientToDelete?.name || ""}
          isLoading={isLoading}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default ClientsPage;