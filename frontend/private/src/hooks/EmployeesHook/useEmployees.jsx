import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useEmployeesManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

    // Estados del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [hireDate, setHireDate] = useState('');
    const [salary, setSalary] = useState('');
    const [dui, setDui] = useState('');

    // GET - Obtener todos los empleados
    const fetchEmployees = async () => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver los empleados.');
            return;
        }

        if (!user || user.userType !== 'admin') {
            setError('No tienes permisos para ver los empleados.');
            setEmployees([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}employees`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar los empleados: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            setError('No se pudieron cargar los empleados. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar empleado
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');
            
            const dataToSend = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                hireDate: new Date(hireDate),
                salary: parseFloat(salary),
                dui: dui.trim()
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

            if (!hireDate) {
                setError('La fecha de contratación es obligatoria');
                return;
            }

            if (!dataToSend.salary || dataToSend.salary <= 0) {
                setError('El salario debe ser un número mayor a 0');
                return;
            }

            if (!dataToSend.dui) {
                setError('El DUI es obligatorio');
                return;
            }

            // Validar DUI formato (8 dígitos-1 dígito)
            const duiRegex = /^\d{8}-\d{1}$/;
            if (!duiRegex.test(dataToSend.dui)) {
                setError('El DUI debe tener el formato: 12345678-9');
                return;
            }

            // Para nuevos empleados, la contraseña es obligatoria
            if (!isEditing && !dataToSend.password) {
                setError('La contraseña es obligatoria para nuevos empleados');
                return;
            }

            // Validar contraseña si se proporciona
            if (dataToSend.password && dataToSend.password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            let response;
            
            if (isEditing) {
                // Actualizar empleado existente (PUT)                
                response = await authenticatedFetch(`${API_BASE}/employees/${currentEmployeeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nuevo empleado (POST)
                response = await authenticatedFetch(`${API_BASE}/employees`, {
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
                        throw new Error('Ya existe un empleado con este email');
                    }
                    if (errorData.message.includes('DUI')) {
                        throw new Error('Ya existe un empleado con este DUI');
                    }
                }
                
                throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el empleado`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Empleado ${isEditing ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de empleados
            await fetchEmployees();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} empleado:`, error);
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el empleado`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const startDeleteEmployee = (employeeId) => {
        if (!employeeId) {
            console.error('ID de empleado no válido');
            setError('Error: ID de empleado no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar empleados');
            return;
        }
        
        // Buscar el empleado para mostrar en el modal
        const employee = employees.find(employee => employee._id === employeeId);
        setEmployeeToDelete(employee);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteEmployee = async () => {
        if (!employeeToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
                        
            const response = await authenticatedFetch(`${API_BASE}/employees/${employeeToDelete._id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('El empleado ya no existe o fue eliminado previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar este empleado');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar el empleado porque tiene datos relacionados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar el empleado: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Empleado "${employeeToDelete.name}" eliminado exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setEmployeeToDelete(null);
            
            // Actualizar la lista de empleados
            await fetchEmployees();
            
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            setError(error.message || 'Error al eliminar el empleado');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteEmployee = () => {
        setShowDeleteModal(false);
        setEmployeeToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setHireDate('');
        setSalary('');
        setDui('');
        setIsEditing(false);
        setCurrentEmployeeId(null);
        setError('');
    };

    // Preparar la edición de un empleado
    const handleEditEmployee = (employee) => {
        setName(employee.name || '');
        setEmail(employee.email || '');
        setPhone(employee.phone || '');
        setPassword(''); // No mostrar contraseña actual por seguridad
        setHireDate(
            employee.hireDate 
                ? new Date(employee.hireDate).toISOString().split('T')[0]
                : ''
        );
        setSalary(employee.salary?.toString() || '');
        setDui(employee.dui || '');
        setIsEditing(true);
        setCurrentEmployeeId(employee._id);
        setShowModal(true);
    };

    // Manejar agregar nuevo empleado
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        fetchEmployees();
    };

    return {
        // Estados
        employees,
        setEmployees,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        employeeToDelete,
        setEmployeeToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentEmployeeId,
        setCurrentEmployeeId,
        
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
    };
}