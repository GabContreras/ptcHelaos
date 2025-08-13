// Events.jsx - Página principal de eventos
import React, { useEffect, useState } from 'react';
import { useEventsManager } from '../../hooks/EventsHook/useEvent';
import EventsCard from '../../components/Cards/EventsCard/EventsCard';
import UniversalModal from '../../components/Modals/UniversalModal/UniversalModal';
import toast, { Toaster } from 'react-hot-toast';
import './Events.css';

const EventsPage = () => {
  const {
    // Estados principales
    events,
    showModal,
    setShowModal,
    showDeleteModal,
    eventToDelete,
    isLoading,
    error,
    success,
    setError,
    isEditing,
    currentEventId,

    // Estados del formulario
    name,
    setName,
    date,
    setDate,
    address,
    setAddress,
    type,
    setType,
    isActive,
    setIsActive,
    eventTypes,

    // Funciones
    fetchEvents,
    handleSubmit,
    startDeleteEvent,
    confirmDeleteEvent,
    cancelDeleteEvent,
    resetForm,
    handleEditEvent,
    handleAddNew,
    handleRefresh,
    getUpcomingEvents,
    getEventsByStatus,
  } = useEventsManager();

  // Estados locales para filtros y visualización
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('date-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchEvents();
  }, []);

  // Función para filtrar eventos
  const getFilteredEvents = () => {
    let filtered = [...events];

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(event =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filterType) {
      filtered = filtered.filter(event => event.type === filterType);
    }

    // Filtro por estado activo/inactivo
    if (filterStatus !== 'all') {
      const isActiveFilter = filterStatus === 'active';
      filtered = filtered.filter(event => event.isActive === isActiveFilter);
    }

    // Filtro por fecha
    if (filterDate !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(event => {
        if (!event.date) return filterDate === 'no-date';
        
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filterDate) {
          case 'today':
            return diffDays === 0;
          case 'upcoming':
            return diffDays > 0 && diffDays <= 7;
          case 'future':
            return diffDays > 7;
          case 'past':
            return diffDays < 0;
          case 'no-date':
            return !event.date;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  // Función para ordenar eventos
  const getSortedEvents = (eventsToSort) => {
    const sorted = [...eventsToSort];

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-desc':
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'date-asc':
        return sorted.sort((a, b) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(a.date) - new Date(b.date);
        });
      case 'date-desc':
        return sorted.sort((a, b) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(b.date) - new Date(a.date);
        });
      case 'type-asc':
        return sorted.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      default:
        return sorted;
    }
  };

  // Obtener eventos procesados
  const getProcessedEvents = () => {
    const filtered = getFilteredEvents();
    return getSortedEvents(filtered);
  };

  const processedEvents = getProcessedEvents();

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = processedEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedEvents.length / itemsPerPage);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage, filterType, filterStatus, filterDate]);

  // Mostrar notificaciones
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('all');
    setFilterDate('all');
    setSortBy('date-asc');
  };

  return (
    <div className="events-page">
      {/* Controles de filtros */}
      <div className="events-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-section">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los tipos</option>
            {/* Obtener tipos únicos de los eventos existentes */}
            {[...new Set(events.map(event => event.type).filter(Boolean))].map(eventType => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
          
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="upcoming">Próximos (7 días)</option>
            <option value="future">Futuros</option>
            <option value="past">Pasados</option>
            <option value="no-date">Sin fecha</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date-asc">Fecha más cercana</option>
            <option value="date-desc">Fecha más lejana</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
            <option value="type-asc">Tipo A-Z</option>
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
          </select>
        </div>

        {/* Botón para limpiar filtros */}
        {(searchTerm || filterType || filterStatus !== 'all' || filterDate !== 'all' || sortBy !== 'date-asc') && (
          <div className="clear-filters-section">
            <button onClick={clearAllFilters} className="clear-filters-btn">
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Cargando eventos...</span>
        </div>
      )}

      {/* Información de resultados */}
      {!isLoading && (
        <div className="results-info">
          <span>
            Mostrando {currentEvents.length} de {processedEvents.length} eventos
            {(searchTerm || filterType || filterStatus !== 'all' || filterDate !== 'all') && 
              ` (filtrados de ${events.length} total)`}
          </span>
        </div>
      )}

      {/* Grid de eventos */}
      <div className="events-grid">
        {currentEvents.length > 0 ? (
          currentEvents.map(event => (
            <EventsCard
              key={event._id}
              data={event}
              onEdit={() => handleEditEvent(event)}
              onDelete={() => startDeleteEvent(event._id)}
              isLoading={isLoading}
            />
          ))
        ) : (
          !isLoading && (
            <div className="no-data-message">
              {searchTerm || filterType || filterStatus !== 'all' || filterDate !== 'all' ? (
                <>
                  <p>No se encontraron eventos con los filtros aplicados</p>
                  <button onClick={clearAllFilters} className="btn btn-secondary">
                    Limpiar filtros
                  </button>
                </>
              ) : (
                <>
                  <p>No hay eventos registrados. Agrega el primer evento.</p>
                </>
              )}
            </div>
          )
        )}

        {/* Botón de agregar */}
        {!isLoading && (
          <div className="add-event-card" onClick={handleAddNew}>
            <div className="add-event-content">
              <div className="add-icon">+</div>
              <span className="add-text">Agregar Evento</span>
            </div>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Anterior
          </button>
          
          <span className="pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de edición/creación */}
      <UniversalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        type="form"
        title={isEditing ? 'Editar Evento' : 'Nuevo Evento'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nombre del Evento</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del evento"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Tipo de Evento</label>
              <input
                type="text"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Ej: Cumpleaños, Boda, Graduación, etc."
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Fecha del Evento</label>
              <input
                type="datetime-local"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
                required
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: '#8B7CF6',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Dirección</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección del evento"
                disabled={isLoading}
                required
                rows="3"
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: '#8B7CF6',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                Evento Activo
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

      {/* Modal de confirmación de eliminación */}
      <UniversalModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteEvent}
        onConfirm={confirmDeleteEvent}
        type="delete"
        title="Eliminar Evento"
        message="¿Estás seguro de que deseas eliminar este evento?"
        itemName={eventToDelete?.name || ""}
        isLoading={isLoading}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default EventsPage;