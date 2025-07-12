import React, { useState } from 'react';
import '../styles/PasswordRecovery.css';
import Button from '../assets/Button';
import { useNavigate } from 'react-router-dom';

function PasswordRecovery() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('requestCode');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    if (activeTab === 'requestCode') {
      setActiveTab('verifyCode');
    } else if (activeTab === 'verifyCode') {
      setActiveTab('newPassword');
    } else {
      console.log('Contraseña actualizada');
    }
  };

  return (
    <div className="recovery-container">
      <div className="recovery-box">
        <h2 className="recovery-title">Recuperacion de Contraseña</h2>

        {activeTab === 'requestCode' && (
          <>
            <p className="recovery-description">
              Ingresa tu correo electronico para que se te envie un codigo de recuperación
            </p>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="recovery-input"
            />
            <Button titulo="Enviar codigo" color="#8D6CFF" tipoColor="background" onClick={handleNext} />
          </>
        )}

        {activeTab === 'verifyCode' && (
          <>
            <p className="recovery-description">
              Verifica el correo asociado a esta cuenta, posteriormente ingresa el código para recuperar tu contraseña
            </p>
            <div className="recovery-email">
              <span className="icono-usuario">👤</span>
              <span>{email || 'CuentaRandom@gmail.com'}</span>
            </div>
            <p className="recovery-code-sent">Se envió un código a tu cuenta de gmail</p>
            <div className="recovery-code-inputs">
              {[0, 1, 2, 3].map((_, i) => (
                <input key={i} maxLength="1" className="code-box" />
              ))}
            </div>
            <Button titulo="Continuar" color="#8D6CFF" tipoColor="background" onClick={handleNext} />
            <button className="recovery-secondary-button">Reenviar</button>
          </>
        )}

        {activeTab === 'newPassword' && (
          <>
            <p className="recovery-description">
              Ingrese una nueva contraseña (se asociará a esta cuenta)
            </p>
            <div className="recovery-email">
              <span className="icono-usuario">👤</span>
              <span>{email || 'CuentaRandom@gmail.com'}</span>
            </div>
            <label>Ingresa la nueva contraseña:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="recovery-input"
            />
            <label>Vuelve a ingresar la contraseña:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="recovery-input"
            />
            <Button titulo="Continuar" color="#8D6CFF" tipoColor="background" onClick={() => navigate('/')} />
          </>
        )}
      </div>
    </div>
  );
}

export default PasswordRecovery;