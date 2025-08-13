import React, { useRef, useEffect } from 'react';

import './UniversalModal.css'; // Asegúrate de tener los estilos necesarios

const UniversalModal = ({ 
  isOpen, 
  onClose, 
  type = 'form', // 'form', 'success', 'delete', 'code'
  title,
  message,
  itemName,
  isLoading = false,
  onConfirm,
  children,
  userEmail,
  // Para modal de código
  code,
  onCodeChange,
  onCodeKeyDown,
  inputRefs,
  // Para botones personalizados
  customButtons,
  // Estilos adicionales
  containerStyle,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && type === 'code' && inputRefs?.current?.[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen, type, inputRefs]);

  if (!isOpen) return null;

  // Configuración de estilos según el tipo
  const getModalConfig = () => {
    const configs = {
      success: {
        containerBg: 'linear-gradient(135deg, #FFBAE7 0%, #E8B8FF 50%, #D4C5FF 100%)',
        headerBg: null,
        iconColor: 'white',
        textColor: 'white',
        showHeader: false,
        showIcon: true,
        icon: '✓',
        iconSize: '80px',
        maxWidth: '400px'
      },
      delete: {
        containerBg: 'white',
        headerBg: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        iconColor: 'white',
        textColor: '#333',
        showHeader: true,
        showIcon: true,
        icon: '⚠️',
        iconSize: '3rem',
        maxWidth: '450px'
      },
      form: {
        containerBg: 'rgba(255, 255, 255, 0.98)',
        headerBg: null,
        iconColor: '#8B7CF6',
        textColor: '#333',
        showHeader: true,
        showIcon: false,
        maxWidth: size === 'large' ? '700px' : '600px'
      },
      code: {
        containerBg: 'rgba(255, 255, 255, 0.95)',
        headerBg: null,
        iconColor: '#666',
        textColor: '#333',
        showHeader: false,
        showIcon: true,
        icon: '🍦',
        iconSize: '2rem',
        maxWidth: '450px'
      }
    };
    return configs[type] || configs.form;
  };

  const config = getModalConfig();

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
      animation: 'fadeIn 0.3s ease-out',
      padding: '1rem'
    },
    container: {
      background: config.containerBg,
      backdropFilter: type === 'form' ? 'blur(20px)' : 'none',
      borderRadius: type === 'success' || type === 'code' ? '20px' : '16px',
      padding: 0,
      width: '100%',
      maxWidth: config.maxWidth,
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: type === 'success' 
        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
        : type === 'form' 
          ? '0 25px 50px rgba(139, 124, 246, 0.3)'
          : '0 20px 40px rgba(0, 0, 0, 0.3)',
      border: type === 'form' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
      animation: 'slideInScale 0.4s ease-out',
      overflow: 'hidden',
      position: 'relative',
      ...containerStyle
    }
  };

  // Renderizar header según el tipo
  const renderHeader = () => {
    if (!config.showHeader) return null;

    const headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: type === 'delete' ? '1.5rem 2rem' : '2rem 2rem 1rem',
      borderBottom: type === 'delete' 
        ? 'none' 
        : '2px solid rgba(139, 124, 246, 0.1)',
      background: config.headerBg || (type === 'delete' ? config.headerBg : 'transparent'),
      color: config.headerBg ? 'white' : config.textColor
    };

    return (
      <div style={headerStyle}>
        {type === 'delete' && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: config.iconSize, marginBottom: '0.5rem', display: 'block' }}>
              {config.icon}
            </span>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              margin: 0, 
              color: 'white' 
            }}>
              {title}
            </h2>
          </div>
        )}
        
        {type === 'form' && (
          <>
            <h2 style={{
              margin: 0,
              color: config.textColor,
              fontSize: '1.5rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #8B7CF6, #B9B8FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {title}
            </h2>
            <button 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(139, 124, 246, 0.1)',
                color: config.iconColor,
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(139, 124, 246, 0.2)';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(139, 124, 246, 0.1)';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              ×
            </button>
          </>
        )}
      </div>
    );
  };

  // Renderizar contenido según el tipo
  const renderContent = () => {
    const contentStyle = {
      padding: type === 'success' 
        ? '2.5rem 2rem'
        : type === 'delete'
          ? '2rem'
          : type === 'code'
            ? '2.5rem 2.5rem'
            : '1.5rem 2rem 2rem',
      textAlign: type === 'success' || type === 'delete' || type === 'code' ? 'center' : 'left',
      color: config.textColor,
      position: 'relative'
    };

    return (
      <div style={contentStyle}>
        {/* Logo para código */}
        {type === 'code' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <span style={{
              fontSize: config.iconSize,
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              {config.icon}
            </span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: config.iconColor
            }}>
              Moon Ice Cream
            </span>
          </div>
        )}

        {/* Icono para success */}
        {type === 'success' && config.showIcon && (
          <div style={{
            width: config.iconSize,
            height: config.iconSize,
            margin: '0 auto 1.5rem',
            position: 'relative'
          }}>
            <svg viewBox="0 0 52 52" style={{
              width: config.iconSize,
              height: config.iconSize,
              borderRadius: '50%',
              display: 'block',
              strokeWidth: 3,
              stroke: 'white',
              strokeMiterlimit: 10,
              boxShadow: 'inset 0px 0px 0px white',
              animation: 'fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both'
            }}>
              <circle 
                style={{
                  strokeDasharray: 166,
                  strokeDashoffset: 166,
                  strokeWidth: 3,
                  strokeMiterlimit: 10,
                  stroke: 'white',
                  fill: 'none',
                  animation: 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards'
                }}
                cx="26" 
                cy="26" 
                r="25" 
                fill="none"
              />
              <path 
                style={{
                  transformOrigin: '50% 50%',
                  strokeDasharray: 48,
                  strokeDashoffset: 48,
                  stroke: 'white',
                  strokeWidth: 3,
                  animation: 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards'
                }}
                fill="none" 
                d="m14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
        )}

        {/* Título para tipos que no tienen header */}
        {(type === 'success' || type === 'code') && title && (
          <h2 style={{
            fontSize: type === 'success' ? '1.75rem' : '1.5rem',
            fontWeight: type === 'success' ? 700 : 600,
            marginBottom: '1rem',
            color: config.textColor,
            textShadow: type === 'success' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
          }}>
            {title}
          </h2>
        )}

        {/* Mensaje */}
        {message && (
          <p style={{
            fontSize: '1rem',
            marginBottom: type === 'delete' ? '1rem' : '2rem',
            color: type === 'success' 
              ? 'rgba(255, 255, 255, 0.95)'
              : type === 'delete'
                ? '#666'
                : config.textColor,
            lineHeight: 1.5,
            fontWeight: type === 'success' ? 500 : 'normal'
          }}>
            {message}
          </p>
        )}

        {/* Info del usuario para code */}
        {type === 'code' && userEmail && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: 'rgba(139, 124, 246, 0.1)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'rgba(139, 124, 246, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>
                👤
              </div>
              <span style={{
                color: '#333',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}>
                {userEmail}
              </span>
            </div>
            <p style={{
              fontSize: '0.85rem',
              color: '#666',
              marginBottom: '1.5rem'
            }}>
              Se envió el código a tu cuenta de gmail
            </p>
          </>
        )}

        {/* Nombre del item para delete */}
        {type === 'delete' && itemName && (
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#333',
            marginBottom: '1.5rem',
            padding: '0.75rem',
            background: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 107, 107, 0.2)'
          }}>
            "{itemName}"
          </div>
        )}

        {/* Warning para delete */}
        {type === 'delete' && (
          <p style={{
            fontSize: '0.9rem',
            color: '#e53e3e',
            fontStyle: 'italic',
            marginBottom: '2rem',
            lineHeight: 1.4
          }}>
            Esta acción no se puede deshacer y se perderán todos los datos asociados.
          </p>
        )}

        {/* Inputs para código */}
        {type === 'code' && code && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.375rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            maxWidth: '320px',
            margin: '0 auto 1.5rem'
          }}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => inputRefs && (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength="1"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  background: '#8B7CF6',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  outline: 'none',
                  flexShrink: 0
                }}
                value={code[index]}
                onChange={(e) => onCodeChange && onCodeChange(index, e.target.value)}
                onKeyDown={(e) => onCodeKeyDown && onCodeKeyDown(index, e)}
                disabled={isLoading}
                onFocus={(e) => {
                  e.target.style.background = '#7C3AED';
                  e.target.style.boxShadow = '0 0 0 2px rgba(139, 124, 246, 0.3)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onBlur={(e) => {
                  e.target.style.background = '#8B7CF6';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
            ))}
          </div>
        )}

        {/* Children (formulario u otro contenido) */}
        {children}

        {/* Botones por defecto */}
        {!customButtons && !children && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {type === 'success' && (
              <button 
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '0.875rem 2rem',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'none',
                  minWidth: '160px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={onClose}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Volver al login
              </button>
            )}

            {type === 'delete' && (
              <>
                <button 
                  style={{
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '120px',
                    background: '#f0f0f0',
                    color: '#666'
                  }}
                  onClick={onClose}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.target.style.background = '#e0e0e0';
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) e.target.style.background = '#f0f0f0';
                  }}
                >
                  Cancelar
                </button>
                
                <button 
                  style={{
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '120px',
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                    color: 'white',
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onClick={onConfirm}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.background = 'linear-gradient(135deg, #FF5252 0%, #FF7979 100%)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {isLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </>
            )}

            {type === 'code' && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                width: '100%',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button 
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '120px',
                    background: '#f0f0f0',
                    color: '#666',
                    flex: '1',
                    maxWidth: '150px'
                  }}
                  onClick={onClose}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.background = '#e0e0e0';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.background = '#f0f0f0';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  Regresar
                </button>
                
                <button 
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '120px',
                    background: 'linear-gradient(135deg, #FFBAE7 0%, #FF9DE0 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isLoading ? 0.6 : 1,
                    flex: '1',
                    maxWidth: '150px'
                  }}
                  onClick={onConfirm}
                  disabled={isLoading || !code?.every(digit => digit !== '')}
                  onMouseEnter={(e) => {
                    if (!isLoading && code?.every(digit => digit !== '')) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 10px 25px rgba(255, 186, 231, 0.4)';
                      e.target.style.background = 'linear-gradient(135deg, #FF9DE0 0%, #FF87D4 100%)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = 'linear-gradient(135deg, #FFBAE7 0%, #FF9DE0 100%)';
                    }
                  }}
                >
                  {isLoading ? 'Verificando...' : 'Continuar'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Botones personalizados */}
        {customButtons}
      </div>
    );
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
          
          @keyframes stroke {
            100% { stroke-dashoffset: 0; }
          }
          
          @keyframes scale {
            0%, 100% { transform: none; }
            50% { transform: scale3d(1.1, 1.1, 1); }
          }
          
          @keyframes fill {
            100% { box-shadow: inset 0px 0px 0px 60px rgba(255, 255, 255, 0.2); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @media (max-width: 768px) {
            .universal-modal-container {
              margin: 0.5rem;
              max-height: 95vh;
            }
            
            .code-inputs-container {
              gap: 0.375rem !important;
            }
            
            .code-input {
              width: 40px !important;
              height: 40px !important;
              font-size: 1rem !important;
            }
            
            .code-buttons-container {
              flex-direction: column !important;
              gap: 0.75rem !important;
            }
            
            .code-buttons-container button {
              width: 100% !important;
              max-width: none !important;
            }
          }

          @media (max-width: 480px) {
            .universal-modal-overlay {
              padding: 0.5rem;
            }
            .universal-modal-container {
              width: 95%;
            }
            
            .code-inputs-container {
              gap: 0.25rem !important;
            }
            
            .code-input {
              width: 35px !important;
              height: 35px !important;
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>
      <div style={modalStyles.overlay} className="universal-modal-overlay">
        <div 
          ref={modalRef}
          style={modalStyles.container} 
          className="universal-modal-container"
        >
          {renderHeader()}
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default UniversalModal;