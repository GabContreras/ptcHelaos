import React from 'react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Eliminación", 
  message = "¿Estás seguro de que deseas eliminar este elemento?", 
  itemName = "",
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    },
    container: {
      background: 'white',
      borderRadius: '16px',
      padding: 0,
      width: '90%',
      maxWidth: '450px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      animation: 'slideInScale 0.4s ease-out',
      overflow: 'hidden',
      position: 'relative'
    },
    header: {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
      padding: '1.5rem 2rem',
      textAlign: 'center',
      color: 'white'
    },
    icon: {
      fontSize: '3rem',
      marginBottom: '0.5rem',
      display: 'block'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      margin: 0,
      color: 'white'
    },
    content: {
      padding: '2rem',
      textAlign: 'center',
      color: '#333'
    },
    message: {
      fontSize: '1rem',
      marginBottom: '1rem',
      color: '#666',
      lineHeight: 1.5
    },
    itemName: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#333',
      marginBottom: '1.5rem',
      padding: '0.75rem',
      background: 'rgba(255, 107, 107, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 107, 107, 0.2)'
    },
    warning: {
      fontSize: '0.9rem',
      color: '#e53e3e',
      fontStyle: 'italic',
      marginBottom: '2rem',
      lineHeight: 1.4
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center'
    },
    button: {
      padding: '0.75rem 2rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '120px'
    },
    cancelButton: {
      background: '#f0f0f0',
      color: '#666',
      border: '1px solid #ddd'
    },
    confirmButton: {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
      color: 'white'
    }
  };

  const handleCancelHover = (e) => {
    e.target.style.background = '#e0e0e0';
  };

  const handleCancelLeave = (e) => {
    e.target.style.background = '#f0f0f0';
  };

  const handleConfirmHover = (e) => {
    if (!isLoading) {
      e.target.style.background = 'linear-gradient(135deg, #FF5252 0%, #FF7979 100%)';
      e.target.style.transform = 'translateY(-1px)';
      e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
    }
  };

  const handleConfirmLeave = (e) => {
    if (!isLoading) {
      e.target.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideInScale {
            0% {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      <div style={modalStyles.overlay}>
        <div style={modalStyles.container}>
          <div style={modalStyles.header}>
            <span style={modalStyles.icon}>⚠️</span>
            <h2 style={modalStyles.title}>{title}</h2>
          </div>
          
          <div style={modalStyles.content}>
            <p style={modalStyles.message}>{message}</p>
            
            {itemName && (
              <div style={modalStyles.itemName}>
                "{itemName}"
              </div>
            )}
            
            <p style={modalStyles.warning}>
              Esta acción no se puede deshacer y se perderán todos los datos asociados.
            </p>
            
            <div style={modalStyles.actions}>
              <button 
                style={{...modalStyles.button, ...modalStyles.cancelButton}}
                onClick={onClose}
                disabled={isLoading}
                onMouseEnter={handleCancelHover}
                onMouseLeave={handleCancelLeave}
              >
                Cancelar
              </button>
              
              <button 
                style={{
                  ...modalStyles.button, 
                  ...modalStyles.confirmButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                onClick={onConfirm}
                disabled={isLoading}
                onMouseEnter={handleConfirmHover}
                onMouseLeave={handleConfirmLeave}
              >
                {isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;