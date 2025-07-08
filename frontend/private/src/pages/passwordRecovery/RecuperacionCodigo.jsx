import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalModal from '../../components/Modals/UniversalModal/UniversalModal';
import './RecuperacionCodigo.css';

const RecuperacionCodigo = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(true);
  const inputRefs = useRef([]);
  
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);

    // Obtener el email del token cuando el componente se monta
    const getUserEmailFromToken = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/passwordRecovery/getTokenInfo`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email || 'usuario@moonicecream.com');
        } else {
          setUserEmail('usuario@moonicecream.com');
        }
      } catch (err) {
        console.error('Error getting user email:', err);
        setUserEmail('usuario@moonicecream.com');
      }
    };

    getUserEmailFromToken();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const enteredCode = code.join('');
    
    if (enteredCode.length !== 6) {
      setError('Por favor ingresa el código completo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/passwordRecovery/verifyCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code: enteredCode }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/cambiarpassword');
      } else {
        setError(data.message || 'Código inválido');
        setCode(['', '', '', '', '', '']);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/recuperacion');
  };

  return (
    <div className="code-container">
      {/* Fallback UI para cuando no hay modal */}
      <div className="code-form-container">
        <div className="code-logo">
          <span className="logo-icon">🍦</span>
          <span className="logo-text">Moon Ice Cream</span>
        </div>

        <h1>Recuperacion de Contraseña</h1>
        <p className="code-description">
          Ingresa el código de verificación que se envió a tu correo
        </p>
        
        <div className="user-info">
          <div className="user-icon">👤</div>
          <span className="user-email">{userEmail}</span>
        </div>

        <p className="code-instruction">Se envió el código a tu cuenta de gmail</p>

        {error && <div className="error-message">{error}</div>}

        <div className="code-inputs-container">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength="1"
              className="code-input"
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
            />
          ))}
        </div>

        <div className="form-actions">
          <button 
            type="button"
            className="back-button"
            onClick={goBack}
            disabled={loading}
          >
            Regresar
          </button>
          
          <button 
            type="submit" 
            className="continue-button"
            onClick={handleSubmit}
            disabled={!code.every(digit => digit !== '') || loading}
          >
            {loading ? 'Verificando...' : 'Continuar'}
          </button>
        </div>
      </div>

      {/* Modal de código usando UniversalModal */}
      <UniversalModal
        isOpen={showCodeModal}
        onClose={goBack}
        onConfirm={handleSubmit}
        type="code"
        title="Recuperacion de Contraseña"
        message="Ingresa el código de verificación que se envió a tu correo"
        userEmail={userEmail}
        code={code}
        onCodeChange={handleChange}
        onCodeKeyDown={handleKeyDown}
        inputRefs={inputRefs}
        isLoading={loading}
      />
      
      {/* Mostrar error si existe */}
      {error && showCodeModal && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(255, 142, 142, 0.9))',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(255, 107, 107, 0.3)',
          zIndex: 1001,
          maxWidth: '300px',
          fontSize: '0.9rem',
          backdropFilter: 'blur(10px)'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default RecuperacionCodigo;