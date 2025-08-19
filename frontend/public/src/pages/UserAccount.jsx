import React, {useState} from 'react';
import '../styles/UserAccount.css';
import { Eye, EyeOff } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { FaEdit } from 'react-icons/fa';
import { useUserProfile } from '../hooks/AccountHook/useAccount';
import Swal from 'sweetalert2';

function UserAccount() {
  const { profile, setProfile, updateUserProfile, isLoading, error, user } = useUserProfile();
  const [newPassword, setNewPassword] = useState(''); // Estado separado para nueva contraseña

  // Función para formatear fecha al formato de El Salvador (DD/MM/YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Función para convertir fecha de formato El Salvador a formato ISO
  const parseDateFromSalvador = (dateString) => {
    if (!dateString) return '';
    
    try {
      // Si ya está en formato ISO, devolverlo
      if (dateString.includes('-')) {
        return dateString;
      }
      
      // Convertir de DD/MM/YYYY a YYYY-MM-DD
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error parsing date:', error);
      return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'newPassword') {
      // Manejar contraseña en estado separado
      setNewPassword(value);
    } else {
      // Manejar otros campos del perfil
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Preparar datos para actualizar (solo campos permitidos)
      const updatedProfile = {
        name: profile.name,
        birthday: profile.birthday,
        phone: profile.phone,
      };

      // VALIDACIÓN: Solo incluir password si se proporcionó uno nuevo
      if (newPassword && newPassword.trim() !== '') {
        updatedProfile.password = newPassword;
      }

      console.log('Datos a enviar:', updatedProfile);

      await updateUserProfile(updatedProfile);
      
      // SweetAlert para éxito
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: 'Tu información ha sido actualizada exitosamente.',
        confirmButtonColor: '#8D6CFF'
      });
      
      // Limpiar el campo de contraseña después de actualizar
      setNewPassword('');
      
    } catch (err) {
      console.error("Error al actualizar perfil", err);
      
      // SweetAlert para error
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: err.message || 'No se pudo actualizar tu perfil. Intenta más tarde.',
        confirmButtonColor: '#8D6CFF'
      });
    }
  };

  return (
    <>
      <NavBar/>
      <div className="account-container">
        <h2 className="account-title">Cuenta</h2>

        {isLoading && <p>Cargando...</p>}
        {error && <p style={{color:"red"}}>{error}</p>}

        {/* CAMPOS DE INFORMACION DE LA CUENTA */}
        <section>
          <h3 className="section-title">Información Personal</h3>
          <form onSubmit={handleSubmit} className="account-form">
            <label>Nombre:</label>
            <input 
              type="text" 
              name="name" 
              value={profile.name || ''} 
              onChange={handleChange}
              required 
            />

            {/* correo electronico deshabilitado para actualizar */}
            <label>Correo Electrónico:</label>
            <input 
              type="email" 
              name="email" 
              value={profile.email || ''} 
              disabled
            />

            {/* fecha de nacimiento con formato de El Salvador */}
            <div className="form-group-1">
              <label className="form-label">Fecha de nacimiento:</label>
              <input
                type="date"
                name="birthday"
                value={profile.birthday ? profile.birthday.split("T")[0] : ""}
                onChange={handleChange}
                className="form-input date-input"
                max={(() => {
                  const today = new Date();
                  const maxDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
                  return maxDate.toISOString().split("T")[0];
                })()}
                min={(() => {
                  // Fecha mínima de hace 100 años
                  const today = new Date();
                  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
                  return minDate.toISOString().split("T")[0];
                })()}
              />
              <small className="date-help-text">
                Debes tener al menos 15 años para registrarte
                {profile.birthday && (
                  <span style={{ display: 'block', marginTop: '5px', fontWeight: 'bold', color: '#8D6CFF' }}>
                    Formato El Salvador: {formatDateForDisplay(profile.birthday)}
                  </span>
                )}
              </small>
            </div>

            <label>Número de teléfono:</label>
            <input 
              type="tel"
              name="phone"
              maxLength={9}
              value={profile.phone || ''}
              onChange={handleChange}
              pattern="[0-9]{4}-[0-9]{4}"
              placeholder="0000-0000"
              title="Ingresa un número de teléfono válido (formato 0000-0000)"
              required
            />

            {/* Campo de contraseña para cambio opcional */} 
            <label>Nueva Contraseña (opcional):</label>
            <div className="password-input-container">
              <input 
                type='password' 
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
                placeholder='Dejar vacío para mantener contraseña actual'
                minLength={8}
              />
              <small className="password-help-text">
                Deja este campo vacío si no deseas cambiar tu contraseña. 
                Si ingresas una nueva contraseña, debe tener al menos 8 caracteres.
              </small>
            </div>

            {/* ejecuta la actualizacion al enviar el formulario */}
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Actualizando...' : 'Actualizar Datos'}
            </button>
          </form>
        </section>
        </div>
        
        <Footer />
    </>
  );
}

export default UserAccount;