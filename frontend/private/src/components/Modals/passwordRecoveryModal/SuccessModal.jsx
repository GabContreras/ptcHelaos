import React from 'react';

const SuccessModal = ({ isOpen, onClose, title = "¡Éxito!", message = "Operación completada exitosamente" }) => {
  if (!isOpen) return null;

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    },
    container: {
      background: 'linear-gradient(135deg, #FFBAE7 0%, #E8B8FF 50%, #D4C5FF 100%)',
      borderRadius: '20px',
      padding: 0,
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      animation: 'slideInScale 0.4s ease-out',
      overflow: 'hidden',
      position: 'relative'
    },
    content: {
      padding: '2.5rem 2rem',
      textAlign: 'center',
      color: 'white',
      position: 'relative'
    },
    successIcon: {
      width: '80px',
      height: '80px',
      margin: '0 auto 1.5rem',
      position: 'relative'
    },
    checkmark: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'block',
      strokeWidth: 3,
      stroke: 'white',
      strokeMiterlimit: 10,
      boxShadow: 'inset 0px 0px 0px white',
      animation: 'fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both'
    },
    checkmarkCircle: {
      strokeDasharray: 166,
      strokeDashoffset: 166,
      strokeWidth: 3,
      strokeMiterlimit: 10,
      stroke: 'white',
      fill: 'none',
      animation: 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards'
    },
    checkmarkCheck: {
      transformOrigin: '50% 50%',
      strokeDasharray: 48,
      strokeDashoffset: 48,
      stroke: 'white',
      strokeWidth: 3,
      animation: 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 700,
      marginBottom: '1rem',
      color: 'white',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    message: {
      fontSize: '1rem',
      marginBottom: '2rem',
      color: 'rgba(255, 255, 255, 0.95)',
      lineHeight: 1.5,
      fontWeight: 500
    },
    button: {
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
    }
  };

  const handleButtonHover = (e) => {
    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
  };

  const handleButtonLeave = (e) => {
    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
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
        `}
      </style>
      <div style={modalStyles.overlay}>
        <div style={modalStyles.container}>
          <div style={modalStyles.content}>
            <div style={modalStyles.successIcon}>
              <svg viewBox="0 0 52 52" style={modalStyles.checkmark}>
                <circle 
                  style={modalStyles.checkmarkCircle} 
                  cx="26" 
                  cy="26" 
                  r="25" 
                  fill="none"
                />
                <path 
                  style={modalStyles.checkmarkCheck} 
                  fill="none" 
                  d="m14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
            
            <h2 style={modalStyles.title}>{title}</h2>
            <p style={modalStyles.message}>{message}</p>
            
            <button 
              style={modalStyles.button}
              onClick={onClose}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              Volver al login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessModal;