import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, User, FileText, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta según tu estructura
import './Finances.css';

const Finances = () => {
  // Contexto de autenticación con manejo de errores
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error('Error al acceder al contexto de autenticación:', error);
    return (
      <div className="financial-history-container">
        <div className="auth-required">
          <AlertCircle size={48} />
          <h2>Error de Autenticación</h2>
          <p>No se pudo verificar el estado de autenticación.</p>
          <button onClick={() => window.location.reload()} className="login-button">
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  if (!authContext) {
    return (
      <div className="financial-history-container">
        <div className="auth-required">
          <AlertCircle size={48} />
          <h2>Contexto No Disponible</h2>
          <p>El contexto de autenticación no está disponible.</p>
          <button onClick={() => window.location.href = '/login'} className="login-button">
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  // Destructuring usando las propiedades correctas de tu AuthContext
  const { 
    isAuthenticated = false,
    user = null,
    isLoading: authLoading = false
  } = authContext;

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    usuario: '',
    monto: '',
    razon: '',
    tipoAccion: 'ingreso' // 'ingreso' o 'egreso'
  });

  // Estados para datos del backend
  const [balanceDisponible, setBalanceDisponible] = useState(0.00);
  const [historialData, setHistorialData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Base URL de tu API - ajusta según tu configuración
  const API_BASE_URL = 'http://localhost:4000/api/pettyCash'; // Corregida la URL

  // Configuración para incluir cookies en todas las peticiones
  const fetchWithCredentials = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      credentials: 'include', // Incluir cookies automáticamente
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  };

  // Función para obtener el balance actual
  const fetchBalance = async () => {
    try {
      const response = await fetchWithCredentials(`${API_BASE_URL}/balance`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el balance');
      }
      const data = await response.json();
      setBalanceDisponible(data.currentBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError(error.message || 'Error al obtener el balance');
    }
  };

  // Función para obtener el historial de movimientos
  const fetchHistorial = async () => {
    try {
      const response = await fetchWithCredentials(`${API_BASE_URL}/`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener el historial');
      }
      const data = await response.json();
      
      // Transformar los datos del backend al formato esperado por el frontend
      const transformedData = data.map(movement => ({
        id: movement._id,
        usuario: movement.employeeId === 'admin' ? 'Admin' : 
                (movement.employeeId?.name || movement.employeeId || 'Usuario'),
        monto: movement.amount,
        fecha: new Date(movement.date).toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        razon: movement.reason,
        tipo: movement.type === 'income' ? 'ingreso' : 'egreso'
      }));
      
      setHistorialData(transformedData);
    } catch (error) {
      console.error('Error fetching historial:', error);
      setError(error.message || 'Error al obtener el historial');
    }
  };

  // Cargar datos al montar el componente (solo si está autenticado)
  useEffect(() => {
    console.log('Estado de autenticación:', { 
      isAuthenticated, 
      authLoading, 
      userType: user?.userType, 
      userId: user?.id,
      userName: user?.name 
    });
    
    if (isAuthenticated && !authLoading) {
      console.log('Usuario autenticado, cargando datos...');
      fetchBalance();
      fetchHistorial();
    } else if (!authLoading && !isAuthenticated) {
      console.log('Usuario no autenticado');
    }
  }, [isAuthenticated, authLoading]);

  // Establecer tipo de acción por defecto según el rol del usuario
  useEffect(() => {
    if (user?.userType === 'employee') {
      setFormData(prev => ({
        ...prev,
        tipoAccion: 'egreso'
      }));
    }
  }, [user?.userType]);

  // Función para manejar cambios en los inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar mensajes de error/éxito cuando el usuario empiece a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Función para validar el formulario
  const validateForm = () => {
    // Si no es admin, no validar el campo usuario ya que se toma automáticamente
    if (userType !== 'admin') {
      // Para usuarios no-admin, solo validar monto y razón
      if (!formData.monto || parseFloat(formData.monto) <= 0) {
        setError('El monto debe ser mayor a 0');
        return false;
      }
      if (!formData.razon.trim()) {
        setError('La razón es requerida');
        return false;
      }
    } else {
      // Para admin, validar todos los campos incluyendo usuario
      if (!formData.usuario.trim()) {
        setError('El campo usuario es requerido');
        return false;
      }
      if (!formData.monto || parseFloat(formData.monto) <= 0) {
        setError('El monto debe ser mayor a 0');
        return false;
      }
      if (!formData.razon.trim()) {
        setError('La razón es requerida');
        return false;
      }
    }
    
    // Validar que hay suficientes fondos para egresos
    if (formData.tipoAccion === 'egreso' && parseFloat(formData.monto) > balanceDisponible) {
      setError(`Fondos insuficientes. Balance actual: ${balanceDisponible.toFixed(2)}`);
      return false;
    }
    
    return true;
  };

  // Función para realizar la operación
  const handleRealizarOperacion = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const requestBody = {
        operationType: formData.tipoAccion,
        amount: parseFloat(formData.monto),
        reason: formData.razon,
        // Para admin, usar el campo de usuario. Para otros, usar su ID automáticamente
        ...(user?.userType === 'admin' 
          ? { employeeId: formData.usuario } 
          : { employeeId: user?.id }
        )
      };

      console.log('Enviando operación:', requestBody);

      const response = await fetchWithCredentials(`${API_BASE_URL}/`, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al realizar la operación');
      }

      // Operación exitosa
      setSuccess(data.message || 'Operación realizada exitosamente');
      
      // Limpiar formulario
      setFormData({
        usuario: '',
        monto: '',
        razon: '',
        tipoAccion: user?.userType === 'employee' ? 'egreso' : 'ingreso' // Mantener restricción por rol
      });

      // Actualizar datos
      await fetchBalance();
      await fetchHistorial();

    } catch (error) {
      console.error('Error en operación:', error);
      setError(error.message || 'Error al realizar la operación');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="financial-history-container">
        <div className="loading-container">
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="financial-history-container">
        <div className="auth-required">
          <LogIn size={48} />
          <h2>Acceso Restringido</h2>
          <p>Debes iniciar sesión para acceder a esta sección.</p>
          <button onClick={() => window.location.href = '/login'} className="login-button">
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-history-container">
      {/* Sección del historial */}
      <div className="history-section">
        <h2 className="section-title">Historial</h2>
        
        <div className="history-table">
          {/* Header de la tabla */}
          <div className="table-header">
            <div className="header-cell">Usuario</div>
            <div className="header-cell">Monto</div>
            <div className="header-cell">Fecha</div>
            <div className="header-cell">Razón</div>
          </div>

          {/* Filas de datos */}
          <div className="table-body">
            {historialData.length === 0 ? (
              <div className="table-row empty">
                <div className="table-cell" colSpan="4">
                  No hay movimientos registrados
                </div>
              </div>
            ) : (
              historialData.map((transaccion) => (
                <div 
                  key={transaccion.id} 
                  className={`table-row ${transaccion.tipo === 'ingreso' ? 'ingreso' : 'egreso'}`}
                >
                  <div className="table-cell">
                    <User size={14} />
                    {transaccion.usuario}
                  </div>
                  <div className="table-cell monto-cell">
                    <DollarSign size={14} />
                    <span className={`monto ${transaccion.tipo}`}>
                      {transaccion.tipo === 'egreso' ? '-' : '+'}${transaccion.monto.toFixed(2)}
                    </span>
                  </div>
                  <div className="table-cell">
                    <Calendar size={14} />
                    {transaccion.fecha}
                  </div>
                  <div className="table-cell razon-cell">
                    <FileText size={14} />
                    <span className="razon-text">{transaccion.razon}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Filas vacías para el diseño */}
          {historialData.length < 5 && (
            <div className="empty-rows">
              {Array.from({ length: 5 - historialData.length }).map((_, index) => (
                <div key={`empty-${index}`} className="table-row empty">
                  <div className="table-cell"></div>
                  <div className="table-cell"></div>
                  <div className="table-cell"></div>
                  <div className="table-cell"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sección del formulario */}
      <div className="form-section">
        {/* Balance disponible con información del rol */}
        <div className="balance-display">
          <h3>Disponible: ${balanceDisponible.toFixed(2)}</h3>
          <div className="user-role-info">
            <span className={`role-badge ${user?.userType}`}>
              {user?.userType === 'admin' ? '👑 Administrador' : '👤 Empleado'}
            </span>
            <span className="permissions-text">
              {user?.userType === 'admin' 
                ? 'Puede realizar ingresos y egresos' 
                : 'Solo puede realizar egresos'
              }
            </span>
          </div>
        </div>

        {/* Mensajes de error y éxito */}
        {error && (
          <div className="message error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        {success && (
          <div className="message success-message">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* Formulario de nueva transacción */}
        <div className="transaction-form">
        {/* Formulario de nueva transacción */}
        <div className="transaction-form">
          {user?.userType === 'admin' ? (
            <div className="form-row">
              <label className="form-label">Usuario:</label>
              <input
                type="text"
                value={formData.usuario}
                onChange={(e) => handleInputChange('usuario', e.target.value)}
                className="form-input"
                placeholder="Nombre de usuario o ID"
                disabled={loading}
              />
              <small className="form-help">Como admin, puedes especificar cualquier usuario</small>
            </div>
          ) : (
            <div className="form-row">
              <label className="form-label">Usuario:</label>
              <input
                type="text"
                value={user?.name || user?.email || 'Usuario autenticado'}
                className="form-input user-readonly"
                placeholder="Usuario autenticado"
                disabled={true}
                readOnly
              />
              <small className="form-help">Tu usuario se detecta automáticamente</small>
            </div>
          )}

          <div className="form-row-split">
            <div className="form-column">
              <label className="form-label">Tipo de acción:</label>
              {user?.userType === 'admin' ? (
                <select
                  value={formData.tipoAccion}
                  onChange={(e) => handleInputChange('tipoAccion', e.target.value)}
                  className="form-select"
                  disabled={loading}
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              ) : (
                <select
                  value="egreso"
                  onChange={(e) => handleInputChange('tipoAccion', e.target.value)}
                  className="form-select"
                  disabled={true}
                >
                  <option value="egreso">Egreso</option>
                </select>
              )}
              {user?.userType === 'employee' && (
                <small className="form-help">Los empleados solo pueden realizar egresos</small>
              )}
              {user?.userType === 'admin' && (
                <small className="form-help">Como admin, puedes realizar ingresos y egresos</small>
              )}
            </div>
            
            <div className="form-column">
              <label className="form-label">Monto:</label>
              <div className="monto-input-container">
                <input
                  type="number"
                  value={formData.monto}
                  onChange={(e) => handleInputChange('monto', e.target.value)}
                  className="form-input monto-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
                <span className="currency-symbol">$</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Razón:</label>
            <textarea
              value={formData.razon}
              onChange={(e) => handleInputChange('razon', e.target.value)}
              className="form-textarea"
              placeholder="Descripción de la transacción..."
              rows={4}
              disabled={loading}
            />
          </div>

          <button 
            className="submit-button"
            onClick={handleRealizarOperacion}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Realizar operación'}
          </button>
        </div>
      </div>
    </div>
    </div>

  );
};

export default Finances;