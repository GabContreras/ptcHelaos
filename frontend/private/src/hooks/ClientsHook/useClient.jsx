import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useClientsManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [clients, setClients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentClientId, setCurrentClientId] = useState(null);

    // Estados del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [birthday, setBirthday] = useState('');
    const [frequentCustomer, setFrequentCustomer] = useState(false);

    // GET - Obtener todos los clientes
    const fetchClients = async () => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver los clientes.');
            return;
        }

        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver los clientes.');
            setClients([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}/customers`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar los clientes: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setClients(data);
        } catch (error) {
            setError('No se pudieron cargar los clientes. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar cliente
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');
            
            const dataToSend = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                birthday: new Date(birthday),
                frequentCustomer
            };

            // Solo incluir password si se proporciona
            if (password && password.trim()) {
                dataToSend.password = password.trim();
            }

            // Validaciones
            if (!dataToSend.name) {
                setError('El nombre es obligatorio');
                return;
            }
            
            if (!dataToSend.email) {
                setError('El email es obligatorio');
                return;
            }

            // Validar email
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(dataToSend.email)) {
                setError('El email no tiene un formato válido');
                return;
            }
            
            if (!dataToSend.phone) {
                setError('El teléfono es obligatorio');
                return;
            }

            if (!dataToSend.address) {
                setError('La dirección es obligatoria');
                return;
            }

            if (!birthday) {
                setError('La fecha de nacimiento es obligatoria');
                return;
            }

            // Para nuevos clientes, la contraseña es obligatoria
            if (!isEditing && !dataToSend.password) {
                setError('La contraseña es obligatoria para nuevos clientes');
                return;
            }

            // Validar contraseña si se proporciona
            if (dataToSend.password && dataToSend.password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            let response;
            
            if (isEditing) {
                // Actualizar cliente existente (PUT)                
                response = await authenticatedFetch(`${API_BASE}/customers/${currentClientId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nuevo cliente (POST)
                response = await authenticatedFetch(`${API_BASE}/customers`, {
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
                    if (errorData.message.includes('duplicate') || 
                        errorData.message.includes('email')) {
                        throw new Error('Ya existe un cliente con este email');
                    }
                    if (errorData.message.includes('phone')) {
                        throw new Error('Ya existe un cliente con este teléfono');
                    }
                }
                
                throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el cliente`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Cliente ${isEditing ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de clientes
            await fetchClients();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} cliente:`, error);
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el cliente`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const startDeleteClient = (clientId) => {
        if (!clientId) {
            console.error('ID de cliente no válido');
            setError('Error: ID de cliente no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar clientes');
            return;
        }
        
        // Buscar el cliente para mostrar en el modal
        const client = clients.find(client => client._id === clientId);
        setClientToDelete(client);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteClient = async () => {
        if (!clientToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
                        
            const response = await authenticatedFetch(`${API_BASE}/customers/${clientToDelete._id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('El cliente ya no existe o fue eliminado previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar este cliente');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar el cliente porque tiene datos relacionados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar el cliente: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Cliente "${clientToDelete.name}" eliminado exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setClientToDelete(null);
            
            // Actualizar la lista de clientes
            await fetchClients();
            
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            setError(error.message || 'Error al eliminar el cliente');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteClient = () => {
        setShowDeleteModal(false);
        setClientToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setAddress('');
        setBirthday('');
        setFrequentCustomer(false);
        setIsEditing(false);
        setCurrentClientId(null);
        setError('');
    };

    // Preparar la edición de un cliente
    const handleEditClient = (client) => {
        setName(client.name || '');
        setEmail(client.email || '');
        setPhone(client.phone || '');
        setPassword(''); // No mostrar contraseña actual por seguridad
        setAddress(client.address || '');
        setBirthday(
            client.birthday 
                ? new Date(client.birthday).toISOString().split('T')[0]
                : ''
        );
        setFrequentCustomer(client.frequentCustomer || false);
        setIsEditing(true);
        setCurrentClientId(client._id);
        setShowModal(true);
    };

    // Manejar agregar nuevo cliente
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        fetchClients();
    };

    return {
        // Estados
        clients,
        setClients,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        clientToDelete,
        setClientToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentClientId,
        setCurrentClientId,
        
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
    };
}