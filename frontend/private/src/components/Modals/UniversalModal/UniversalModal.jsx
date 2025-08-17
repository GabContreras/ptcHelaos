import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import './UniversalModal.css';

const UniversalModal = React.memo(({ 
  isOpen, 
  onClose, 
  type = 'form',
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
  size = 'medium'
}) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Refs para evitar cierres accidentales
  const isClosingRef = useRef(false);
  const lastOpenStateRef = useRef(isOpen);
  
  // Efecto para manejar foco en código
  useEffect(() => {
    if (isOpen && type === 'code' && inputRefs?.current?.[0] && !isClosingRef.current) {
      // Pequeño delay para asegurar que el modal esté renderizado
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, inputRefs]);

  // Efecto para manejar el estado de apertura
  useEffect(() => {
    if (lastOpenStateRef.current !== isOpen) {
      lastOpenStateRef.current = isOpen;
      isClosingRef.current = false;
    }
  }, [isOpen]);

  // Callback estabilizado para cerrar modal
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    
    isClosingRef.current = true;
    onClose?.();
  }, [onClose]);

  // Callback para manejar clicks en overlay
  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current && !isClosingRef.current) {
      handleClose();
    }
  }, [handleClose]);

  // Configuración del modal memoizada
  const modalConfig = useMemo(() => {
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
        icon: '🔒',
        iconSize: '2rem',
        maxWidth: '450px'
      }
    };
    return configs[type] || configs.form;
  }, [type, size]);

  // Estilos del modal memoizados
  const modalStyles = useMemo(() => ({
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
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease-out',
      padding: '1rem',
      contain: 'layout style'
    },
    container: {
      background: modalConfig.containerBg,
      backdropFilter: type === 'form' ? 'blur(20px)' : 'none',
      borderRadius: type === 'success' || type === 'code' ? '20px' : '16px',
      padding: 0,
      width: '100%',
      maxWidth: modalConfig.maxWidth,
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
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      willChange: 'auto',
      contain: 'layout style',
      ...containerStyle
    }
  }), [modalConfig, type, containerStyle]);

  // Renderizar header memoizado
  const headerComponent = useMemo(() => {
    if (!modalConfig.showHeader) return null;

    const headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: type === 'delete' ? '1.5rem 2rem' : '2rem 2rem 1rem',
      borderBottom: type === 'delete' 
        ? 'none' 
        : '2px solid rgba(139, 124, 246, 0.1)',
      background: modalConfig.headerBg || (type === 'delete' ? modalConfig.headerBg : 'transparent'),
      color: modalConfig.headerBg ? 'white' : modalConfig.textColor
    };

    return (
      <div style={headerStyle}>
        {type === 'delete' && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: modalConfig.iconSize, marginBottom: '0.5rem', display: 'block' }}>
              {modalConfig.icon}
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
              color: modalConfig.textColor,
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
                color: modalConfig.iconColor,
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
              onClick={handleClose}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(139, 124, 246, 0.2)';
                e.target.style.transform = 'rotate(90deg) translateZ(0)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(139, 124, 246, 0.1)';
                e.target.style.transform = 'rotate(0deg) translateZ(0)';
              }}
            >
              ×
            </button>
          </>
        )}
      </div>
    );
  }, [modalConfig, type, title, handleClose]);

  // Renderizar contenido principal memoizado
  const contentComponent = useMemo(() => {
    const contentStyle = {
      padding: type === 'success' 
        ? '2.5rem 2rem'
        : type === 'delete'
          ? '2rem'
          : type === 'code'
            ? '2.5rem 2.5rem'
            : '1.5rem 2rem 2rem',
      textAlign: type === 'success' || type === 'delete' || type === 'code' ? 'center' : 'left',
      color: modalConfig.textColor,
      position: 'relative',
      contain: 'layout style'
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
              fontSize: modalConfig.iconSize,
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              {modalConfig.icon}
            </span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: modalConfig.iconColor
            }}>
              Moon Ice Cream
            </span>
          </div>
        )}

        {/* Icono para success */}
        {type === 'success' && modalConfig.showIcon && (
          <div style={{
            width: modalConfig.iconSize,
            height: modalConfig.iconSize,
            margin: '0 auto 1.5rem',
            position: 'relative'
          }}>
            <svg viewBox="0 0 52 52" style={{
              width: modalConfig.iconSize,
              height: modalConfig.iconSize,
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
            color: modalConfig.textColor,
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
                : modalConfig.textColor,
            lineHeight: 1.5,
            fontWeight: type === 'success' ? 500 : 'normal'
          }}>
            {message}
          </p>
        )}

        {/* Info del usuario para code */}
        {type === 'code' && userEmail && (
          <>
            <div className="user-info-section">
              <div className="user-info-icon">👤</div>
              <span className="user-info-email">{userEmail}</span>
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
          <div className="code-inputs-container">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={`code-input-${index}`}
                ref={(el) => inputRefs && (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength="1"
                className="code-input"
                value={code[index] || ''}
                onChange={(e) => onCodeChange && onCodeChange(index, e.target.value)}
                onKeyDown={(e) => onCodeKeyDown && onCodeKeyDown(index, e)}
                disabled={isLoading}
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
            {/* Botones específicos por tipo... */}
            {type === 'success' && (
              <button 
                className="button-success-default"
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
                  minWidth: '160px',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
                onClick={handleClose}
              >
                Siguiente
              </button>
            )}

            {/* Resto de botones... */}
            {(type === 'delete' || type === 'code') && (
              <div className="code-buttons-container">
                <button 
                  className="cancel-button"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  {type === 'code' ? 'Regresar' : 'Cancelar'}
                </button>
                
                <button 
                  className="save-button"
                  onClick={onConfirm}
                  disabled={isLoading || (type === 'code' && !code?.every(digit => digit !== ''))}
                >
                  {isLoading ? 
                    (type === 'code' ? 'Verificando...' : 'Eliminando...') : 
                    (type === 'code' ? 'Continuar' : 'Eliminar')
                  }
                </button>
              </div>
            )}
          </div>
        )}

        {/* Botones personalizados */}
        {customButtons}
      </div>
    );
  }, [
    type, modalConfig, title, message, userEmail, itemName, 
    code, onCodeChange, onCodeKeyDown, inputRefs, isLoading, 
    children, customButtons, handleClose, onConfirm
  ]);

  // No renderizar si no está abierto
  if (!isOpen) return null;

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
              transform: translateY(-20px) scale(0.95) translateZ(0);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1) translateZ(0);
            }
          }
          
          @keyframes stroke {
            100% { stroke-dashoffset: 0; }
          }
          
          @keyframes scale {
            0%, 100% { transform: translateZ(0); }
            50% { transform: scale3d(1.1, 1.1, 1) translateZ(0); }
          }
          
          @keyframes fill {
            100% { box-shadow: inset 0px 0px 0px 60px rgba(255, 255, 255, 0.2); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1) translateZ(0); }
            50% { transform: scale(1.1) translateZ(0); }
          }
        `}
      </style>
      <div 
        ref={overlayRef}
        style={modalStyles.overlay} 
        className="universal-modal-overlay"
        onClick={handleOverlayClick}
      >
        <div 
          ref={modalRef}
          style={modalStyles.container} 
          className="universal-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          {headerComponent}
          {contentComponent}
        </div>
      </div>
    </>
  );
});

// Establecer displayName para debugging
UniversalModal.displayName = 'UniversalModal';

export default UniversalModal;