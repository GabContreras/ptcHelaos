import { useState } from 'react';
import { config } from '../../config.jsx';

const API_BASE = config.api.API_BASE;

export function usePettyCash(user) {
    const [balanceDisponible, setBalanceDisponible] = useState(0.00);
    const [historialData, setHistorialData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch con credenciales
    const fetchWithCredentials = async (url, options = {}) => {
        return fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    };

    // Obtener balance
    const fetchBalance = async () => {
        try {
            const response = await fetchWithCredentials(`${API_BASE}pettyCash/balance`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener el balance');
            }
            const data = await response.json();
            setBalanceDisponible(data.currentBalance);
        } catch (error) {
            setError(error.message || 'Error al obtener el balance');
        }
    };

    // Obtener historial
    const fetchHistorial = async () => {
        try {
            const response = await fetchWithCredentials(`${API_BASE}pettyCash`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener el historial');
            }
            const data = await response.json();
            const transformedData = data.map(movement => ({
                id: movement._id,
                usuario: movement.employeeId === 'admin' ? 'Admin' :
                    (movement.employeeId?.email || movement.employeeId?.name || 'Usuario desconocido'),
                monto: movement.amount,
                fecha: new Date(movement.date).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                razon: movement.reason,
                tipo: movement.type === 'income' ? 'ingreso' : 'egreso'
            }));
            setHistorialData(transformedData);
        } catch (error) {
            setError(error.message || 'Error al obtener el historial');
        }
    };

    // Realizar operación - CORREGIDO: incluir datos del usuario
    const realizarOperacion = async (formData) => {
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // Verificar que tenemos los datos del usuario
            if (!user || !user.id) {
                throw new Error('No se encontraron datos del usuario');
            }

            const requestBody = {
                operationType: formData.tipoAccion,
                amount: parseFloat(formData.monto),
                reason: formData.razon,
                // AGREGADO: Incluir datos del usuario
                employeeId: user.id,
                userType: user.userType
            };

            console.log('Enviando datos:', requestBody); // Para debug

            const response = await fetchWithCredentials(`${API_BASE}pettyCash`, {
                method: 'POST',
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al realizar la operación');
            }

            setSuccess(data.message || 'Operación realizada exitosamente');
            await fetchBalance();
            await fetchHistorial();
            return true;
        } catch (error) {
            console.error('Error en realizarOperacion:', error); // Para debug
            setError(error.message || 'Error al realizar la operación');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        balanceDisponible,
        historialData,
        loading,
        error,
        success,
        setError,
        setSuccess,
        fetchBalance,
        fetchHistorial,
        realizarOperacion,
        setHistorialData,
        setBalanceDisponible
    };
}