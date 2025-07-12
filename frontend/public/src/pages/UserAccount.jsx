import React, { useState } from 'react';
import '../styles/UserAccount.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { FaEdit } from 'react-icons/fa'; // Instala con npm install react-icons

function UserAccount() {
  const [datos, setDatos] = useState({
    nombre: 'Kevin Fernando Portillo Avelar',
    email: 'kevinPortillo@gmail.com',
    telefono: '7000-6000',
    password: '',
    direccionCasa: '123 Maple Street, Anytown, CA 91234',
    direccionTrabajo: '456 Oak Avenue, Anytown, CA 91234',
    fechaNacimiento: '08/03/2007'
  });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos actualizados:', datos);
  };

  return (
    <>
    <NavBar/>
        <div className="account-container">
        <h2 className="account-title">Cuenta</h2>

        <section>
            <h3 className="section-title">Información Personal</h3>
            <form onSubmit={handleSubmit} className="account-form">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} />

            <label>Correo Electrónico:</label>
            <input type="email" name="email" value={datos.email} onChange={handleChange} />

            <label>Fecha de nacimiento:</label>
            <input type="text" name="fechaNacimiento" value={datos.fechaNacimiento} onChange={handleChange} />

            <label>Número de teléfono:</label>
            <input type="text" name="telefono" value={datos.telefono} onChange={handleChange} />

            <label>Contraseña:</label>
            <input type="password" name="password" value={datos.password} onChange={handleChange} />

            <button type="submit">Actualizar Datos</button>
            </form>
        </section>

        <section>
            <h3 className="section-title">Direcciones de Envío</h3>
            <div className="direccion-box">
            <div className="direccion-item">
                <strong>Casa</strong>
                <p>{datos.direccionCasa}</p>
                <FaEdit className="edit-icon" />
            </div>
            <div className="direccion-item">
                <strong>Trabajo</strong>
                <p>{datos.direccionTrabajo}</p>
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
