import React, { useState } from 'react';
import { Calendar, DollarSign, User, FileText } from 'lucide-react';
import './Finances.css';

const Finances = () => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    usuario: 'MisterBeast',
    fecha: '00-00-00, 00:00',
    monto: '000.00',
    razon: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ligula tortor, imperdiet laoreet commodo nec',
    tipoAccion: 'Ingreso' // 'Ingreso' o 'Egreso'
  });

  // Estado para el balance disponible
  const [balanceDisponible, setBalanceDisponible] = useState(0.00);

  // Datos del historial (en una app real, esto vendría de una API o base de datos)
  const [historialData, setHistorialData] = useState([
    {
      id: 1,
      usuario: 'usuarioName1',
      monto: 18.45,
      fecha: '01-01-25, 03:30',
      razon: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ligula...',
      tipo: 'ingreso'
    },
    {
      id: 2,
      usuario: 'usuarioName1',
      monto: 200.00,
      fecha: '01-01-01, 00:00',
      razon: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ligula...',
      tipo: 'egreso'
    },
    {
      id: 3,
      usuario: 'usuarioName1',
      monto: 123.00,
      fecha: '01-01-01, 00:00',
      razon: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ligula...',
      tipo: 'ingreso'
    },
    {
      id: 4,
      usuario: 'usuarioName1',
      monto: 332.00,
      fecha: '01-01-01, 00:00',
      razon: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ligula...',
      tipo: 'egreso'
    }
  ]);

  // Función para manejar cambios en los inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para realizar la operación
  const handleRealizarOperacion = () => {
    /* 
    TODO: Implementar lógica de operación financiera
    - Validar que todos los campos estén completos
    - Validar que el monto sea un número válido
    - Si es egreso, verificar que hay suficiente balance
    - Enviar datos a la API: POST /api/transactions
    - Actualizar el balance disponible
    - Agregar la nueva transacción al historial
    - Limpiar el formulario
    - Mostrar mensaje de éxito/error
    */
    
    const nuevoMonto = parseFloat(formData.monto);
    const esIngreso = formData.tipoAccion === 'Ingreso';
    
    // Crear nueva transacción
    const nuevaTransaccion = {
      id: Date.now(), // En una app real, esto vendría del servidor
      usuario: formData.usuario,
      monto: nuevoMonto,
      fecha: new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      razon: formData.razon,
      tipo: esIngreso ? 'ingreso' : 'egreso'
    };

    // Actualizar historial
    setHistorialData(prev => [nuevaTransaccion, ...prev]);
    
    // Actualizar balance
    const nuevoBalance = esIngreso 
      ? balanceDisponible + nuevoMonto 
      : balanceDisponible - nuevoMonto;
    setBalanceDisponible(nuevoBalance);

    // Limpiar formulario (opcional)
    setFormData({
      usuario: 'MisterBeast',
      fecha: '00-00-00, 00:00',
      monto: '000.00',
      razon: '',
      tipoAccion: 'Ingreso'
    });

    console.log('Operación realizada:', nuevaTransaccion);
  };

  return (
    <div className="financial-history-container">
      {/* Sección del historial */}
      <div className="history-section">
        <h2 className="section-title">Historial</h2>
        
        <div className="history-table">
          {/* Header de la tabla */}
          <div className="table-header">
            <div className="header-cell">usuario</div>
            <div className="header-cell">monto</div>
            <div className="header-cell">fecha</div>
            <div className="header-cell">razon</div>
          </div>

          {/* Filas de datos */}
          <div className="table-body">
            {/* 
            TODO: Reemplazar con datos reales de la API
            - Hacer fetch a GET /api/transactions
            - Implementar paginación si hay muchos registros
            - Agregar filtros por fecha, usuario, tipo de transacción
            - Implementar ordenamiento por columnas
            */}
            {historialData.map((transaccion) => (
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
            ))}
          </div>

          {/* Filas vacías para el diseño */}
          <div className="empty-rows">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`empty-${index}`} className="table-row empty">
                <div className="table-cell"></div>
                <div className="table-cell"></div>
                <div className="table-cell"></div>
                <div className="table-cell"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección del formulario */}
      <div className="form-section">
        {/* Balance disponible */}
        <div className="balance-display">
          <h3>Disponible: {balanceDisponible.toFixed(2)} $</h3>
          {/* 
          TODO: Obtener balance real de la API
          - Hacer fetch a GET /api/balance/current
          - Actualizar en tiempo real cuando se hagan transacciones
          - Manejar diferentes monedas si es necesario
          */}
        </div>

        {/* Formulario de nueva transacción */}
        <div className="transaction-form">
          <div className="form-row">
            <label className="form-label">usuario:</label>
            <input
              type="text"
              value={formData.usuario}
              onChange={(e) => handleInputChange('usuario', e.target.value)}
              className="form-input"
              placeholder="Nombre de usuario"
              /* 
              TODO: Implementar funcionalidad de usuario
              - Conectar con sistema de autenticación
              - Autocompletar con usuarios existentes
              - Validar permisos de usuario para hacer transacciones
              */
            />
          </div>

          <div className="form-row-split">
            <div className="form-column">
              <label className="form-label">fecha:</label>
              <input
                type="text"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                className="form-input"
                placeholder="DD-MM-YY, HH:MM"
                /* 
                TODO: Implementar selector de fecha/hora
                - Usar un date picker adecuado
                - Validar formato de fecha
                - Permitir fechas futuras solo para transacciones programadas
                */
              />
            </div>
            
            <div className="form-column">
              <label className="form-label">Tipo de accion</label>
              <select
                value={formData.tipoAccion}
                onChange={(e) => handleInputChange('tipoAccion', e.target.value)}
                className="form-select"
                /* 
                TODO: Expandir tipos de transacción
                - Agregar más categorías (Venta, Compra, Transferencia, etc.)
                - Implementar subcategorías
                - Conectar con sistema de contabilidad
                */
              >
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">monto:</label>
            <div className="monto-input-container">
              <input
                type="number"
                value={formData.monto}
                onChange={(e) => handleInputChange('monto', e.target.value)}
                className="form-input monto-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                /* 
                TODO: Mejorar validación de monto
                - Validar límites máximos/mínimos
                - Formatear automáticamente con separadores de miles
                - Validar decimales según la moneda
                - Prevenir montos negativos en el frontend
                */
              />
              <span className="currency-symbol">$</span>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">razon:</label>
            <textarea
              value={formData.razon}
              onChange={(e) => handleInputChange('razon', e.target.value)}
              className="form-textarea"
              placeholder="Descripción de la transacción..."
              rows={4}
              /* 
              TODO: Mejorar campo de razón
              - Implementar autocompletado con razones comunes
              - Agregar contador de caracteres
              - Validar longitud mínima/máxima
              - Permitir adjuntar archivos o imágenes como comprobantes
              */
            />
          </div>

          <button 
            className="submit-button"
            onClick={handleRealizarOperacion}
            /* 
            TODO: Mejorar funcionalidad del botón
            - Agregar estado de loading durante la operación
            - Deshabilitar si hay campos inválidos
            - Agregar confirmación para montos grandes
            - Implementar feedback visual de éxito/error
            */
          >
            Realizar operacion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Finances;