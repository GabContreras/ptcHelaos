import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useEventsManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);

    // Estados del formulario
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState('');
    const [isActive, setIsActive] = useState(true);

    // Tipos de eventos sugeridos (para referencia, pero no limitantes)
    const suggestedEventTypes = [
        'Cumpleaños',
        'Boda',
        'Graduación',
        'Aniversario',
        'Corporativo',
        'Fiesta Infantil',
        'Reunión Familiar',
        'Celebración',
        'Otro'
    ];

    // GET - Obtener todos los eventos
    const fetchEvents = async () => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver los eventos.');
            return;
        }

        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver los eventos.');
            setEvents([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}events`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar eventos: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            setError('No se pudieron cargar los eventos. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar evento
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');

            // Validaciones
            if (!name.trim()) {
                setError('El nombre del evento es obligatorio');
                return;
            }
            
            if (!date) {
                setError('La fecha del evento es obligatoria');
                return;
            }

            if (!address.trim()) {
                setError('La dirección es obligatoria');
                return;
            }

            if (!type.trim()) {
                setError('El tipo de evento es obligatorio');
                return;
            }

            // Validar que la fecha no sea en el pasado (excepto para edición)
            const eventDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (!isEditing && eventDate < today) {
                setError('La fecha del evento no puede ser en el pasado');
                return;
            }

            const dataToSend = {
                name: name.trim(),
                date: new Date(date).toISOString(),
                address: address.trim(),
                type: type.trim(),
                isActive
            };
            
            let response;
            
            if (isEditing) {
                // Actualizar evento existente (PUT)                
                response = await authenticatedFetch(`${API_BASE}events/${currentEventId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nuevo evento (POST)
                response = await authenticatedFetch(`${API_BASE}events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 400 && errorData.message) {
                    if (errorData.message.includes('ya existe')) {
                        throw new Error('Ya existe un evento con este nombre en la misma fecha');
                    }
                }
                
                throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el evento`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Evento ${isEditing ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de eventos
            await fetchEvents();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} evento:`, error);
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el evento`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const startDeleteEvent = (eventId) => {
        if (!eventId) {
            console.error('ID de evento no válido');
            setError('Error: ID de evento no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar eventos');
            return;
        }
        
        // Buscar el evento para mostrar en el modal
        const event = events.find(event => event._id === eventId);
        setEventToDelete(event);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteEvent = async () => {
        if (!eventToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
                        
            const response = await authenticatedFetch(`${API_BASE}events/${eventToDelete._id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('El evento ya no existe o fue eliminado previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar este evento');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar el evento porque tiene datos relacionados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar el evento: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Evento "${eventToDelete.name}" eliminado exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setEventToDelete(null);
            
            // Actualizar la lista de eventos
            await fetchEvents();
            
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            setError(error.message || 'Error al eliminar el evento');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteEvent = () => {
        setShowDeleteModal(false);
        setEventToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setName('');
        setDate('');
        setAddress('');
        setType('');
        setIsActive(true);
        setIsEditing(false);
        setCurrentEventId(null);
        setError('');
    };

    // Preparar la edición de un evento
    const handleEditEvent = (event) => {
        setName(event.name || '');
        setDate(
            event.date 
                ? new Date(event.date).toISOString().split('T')[0]
                : ''
        );
        setAddress(event.address || '');
        setType(event.type || '');
        setIsActive(event.isActive !== undefined ? event.isActive : true);
        setIsEditing(true);
        setCurrentEventId(event._id);
        setShowModal(true);
    };

    // Manejar agregar nuevo evento
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        fetchEvents();
    };

    // Función para obtener eventos próximos (7 días)
    const getUpcomingEvents = () => {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= nextWeek && event.isActive;
        });
    };

    // Función para obtener eventos por estado
    const getEventsByStatus = (active = true) => {
        return events.filter(event => event.isActive === active);
    };

    return {
        // Estados
        events,
        setEvents,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        eventToDelete,
        setEventToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentEventId,
        setCurrentEventId,
        
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
        eventTypes: suggestedEventTypes,
        
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
    };
}