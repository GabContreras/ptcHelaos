import React from 'react';
import '../styles/UserAccount.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { FaEdit } from 'react-icons/fa';
import { useUserProfile } from '../hooks/AccountHook/useAccount';
import { useAuth } from '../context/AuthContext';

function UserAccount() {
  const { user } = useAuth();
  const userId = user?.id;
  const { profile, setProfile, updateUserProfile, isLoading, error } = useUserProfile(userId);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(profile);
      alert("Perfil actualizado con éxito");
    } catch (err) {
      alert("Error al actualizar perfil");
    }
  };

  console.log("userId recibido en el hook:", userId);


  return (
    <>
      <NavBar/>
      <div className="account-container">
        <h2 className="account-title">Cuenta</h2>

        {isLoading && <p>Cargando...</p>}
        {error && <p style={{color:"red"}}>{error}</p>}

        <section>
          <h3 className="section-title">Información Personal</h3>
          <form onSubmit={handleSubmit} className="account-form">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={profile.nombre || ''} onChange={handleChange} />

            <label>Correo Electrónico:</label>
            <input type="email" name="email" value={profile.email || ''} onChange={handleChange} />

            <label>Fecha de nacimiento:</label>
            <input type="text" name="fechaNacimiento" value={profile.fechaNacimiento || ''} onChange={handleChange} />

            <label>Número de teléfono:</label>
            <input type="text" name="telefono" value={profile.telefono || ''} onChange={handleChange} />

            <label>Contraseña:</label>
            <input type="password" name="password" value={profile.password || ''} onChange={handleChange} />

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