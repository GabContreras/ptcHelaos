import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, User, FileText, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePettyCash } from '../../hooks/PettyCashHook/usePettyCash.jsx';
import './PettyCash.css';

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

  // Estado para los campos del formulario (sin usuario)
  const [formData, setFormData] = useState({
    monto: '',
    razon: '',
    tipoAccion: 'ingreso' // 'ingreso' o 'egreso'
  });

  // Usa el hook para manejar backend
  const {
    balanceDisponible,
    historialData,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchBalance,
    fetchHistorial,
    realizarOperacion
  } = usePettyCash(user);

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
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      return false;
    }
    if (!formData.razon.trim()) {
      setError('La razón es requerida');
      return false;
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
    const ok = await realizarOperacion(formData, user?.userType, user?.id);
    if (ok) {
      setFormData({
        monto: '',
        razon: '',
        tipoAccion: user?.userType === 'employee' ? 'egreso' : 'ingreso' // Mantener restricción por rol
      });
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
                      {new Date(transaccion.fecha).toLocaleDateString('es-SV', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
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
  );
};

export default Finances;