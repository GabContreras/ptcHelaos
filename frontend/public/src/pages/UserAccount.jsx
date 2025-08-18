import React, {useState} from 'react';
import '../styles/UserAccount.css';
import { Eye, EyeOff } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { FaEdit } from 'react-icons/fa';
import { useUserProfile } from '../hooks/AccountHook/useAccount';
import { useAuth } from '../context/AuthContext';

function UserAccount() {
  //const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const { profile, setProfile, updateUserProfile, isLoading, error } = useUserProfile(userId);
  //const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  //const [newPassword, setNewPassword] = useState("");
  //const [confirmPassword, setConfirmPassword] = useState("");


  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔥 manda solo los campos que realmente existen en tu modelo
      const updatedProfile = {
        name: profile.name,
        birthday: profile.birthday,
        phone: profile.phone,
      };

      await updateUserProfile(updatedProfile);
      alert("✅ Perfil actualizado con éxito");
    } catch (err) {
      console.error("Error al actualizar perfil", err);
      alert("❌ Error al actualizar perfil");
    }
  };

  return (
    <>
      <NavBar/>
      <div className="account-container">
        <h2 className="account-title">Cuenta</h2>

        {isLoading && <p>Cargando...</p>}
        {error && <p style={{color:"red"}}>{error}</p>}

        {/*{isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cambiar contraseña</h3>
            <label>Nueva contraseña:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Confirmar contraseña:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={() => setIsPasswordModalOpen(false)}>Cancelar</button>
              <button onClick={() => {
                handlePasswordUpdate(newPassword, confirmPassword);
                setIsPasswordModalOpen(false);
                setNewPassword("");
                setConfirmPassword("");
                }}>
                  Guardar
              </button>
            </div>
          </div>
        </div>
      )}*/}


        <section>
          <h3 className="section-title">Información Personal</h3>
          <form onSubmit={handleSubmit} className="account-form">
            <label>Nombre:</label>
            <input type="text" name="name" value={profile.name || ''} onChange={handleChange} />

            <label>Correo Electrónico:</label>
            <input type="email" name="email" value={profile.email || ''}disabled/>

            <label>Fecha de nacimiento:</label>
            <input type="text" name="birthday" value={profile.birthday || ''} onChange={handleChange} />

            <label>Número de teléfono:</label>
            <input type="text" name="phone" value={profile.phone || ''} onChange={handleChange} />

            <label>Contraseña:</label>
            <div className="password-input-container">
              <input type='password' name="password" placeholder='*********' disabled/>
              {/*<button
                type="button"
                className="password-toggle-1"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Cambiar contraseña
              </button>*/}

            </div>
            <button type="submit">Actualizar Datos</button>
          </form>
        </section>

        <section>
          <h3 className="section-title">Direcciones de Envío</h3>
          <div className="direccion-box">
            <div className="direccion-item">
              <strong>Casa</strong>
              <p>{profile.direccionCasa}</p>
              <FaEdit className="edit-icon" />
            </div>
            <div className="direccion-item">
              <strong>Trabajo</strong>
              <p>{profile.direccionTrabajo}</p>
              <FaEdit className="edit-icon" />
            </div>
          </div>
        </section>

        <section>
            <h3 className="section-title">Historial de Pedidos</h3>
            <table className="order-table">
            <thead>
                <tr>
                <th>Order #</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>#12345</td>
                <td>15 de julio, 2023</td>
                <td><span className="badge">Entregado</span></td>
                <td>$25.00</td>
                </tr>
                <tr>
                <td>#67890</td>
                <td>20 de junio, 2023</td>
                <td><span className="badge">Entregado</span></td>
                <td>$30.00</td>
                </tr>
                <tr>
                <td>#11223</td>
                <td>5 de mayo, 2023</td>
                <td><span className="badge">Entregado</span></td>
                <td>$20.00</td>
                </tr>
            </tbody>
            </table>
        </section>
        </div>
        <Footer />
    </>
  );
}

export default UserAccount;