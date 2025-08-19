import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../../config';

const API_BASE = config.api.API_BASE;

export function useOrders() {
    const { authToken, isAuthenticated, user } = useAuth();
    
    const [orders, setOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Función para hacer fetch con autenticación
    const authenticatedFetch = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Agregar token si existe
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const config = {
            ...options,
            headers,
        };

        console.log('Making request to:', url);
        console.log('With headers:', headers);

        const response = await fetch(url, config);
        
        if (response.status === 401 || response.status === 403) {
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }

        return response;
    };

    // Función para obtener todas las órdenes
    const fetchAllOrders = async () => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver las órdenes.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            console.log('Fetching orders from:', `${API_BASE}orders`);
            console.log('User authenticated:', isAuthenticated);
            console.log('Auth token exists:', !!authToken);
            
            // Usar fetch con credentials para cookies
            const response = await fetch(`${API_BASE}orders`, {
                method: 'GET',
                credentials: 'include', // Importante para cookies
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`Error al cargar las órdenes: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Orders received:', data);
            console.log('Orders count:', data.length);
            console.log('First order:', data[0]);
            
            setOrders(data);
            
            // Filtrar órdenes activas (no entregadas ni canceladas)
            const active = data.filter(order => 
                !['entregado', 'cancelado'].includes(order.orderStatus)
            );
            setActiveOrders(active);
            
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('No se pudieron cargar las órdenes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar estado de una orden
    const updateOrderStatus = async (orderId, newStatus) => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión.');
            return false;
        }

        try {
            setLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}orders/${orderId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ orderStatus: newStatus }),
            });
            
            if (!response.ok) {
                throw new Error(`Error al actualizar estado: ${response.status}`);
            }
            
            // Refrescar las órdenes después de actualizar
            await fetchAllOrders();
            return true;
            
        } catch (error) {
            console.error('Error updating order status:', error);
            setError('No se pudo actualizar el estado: ' + error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar estado de pago
    const updatePaymentStatus = async (orderId, newPaymentStatus) => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión.');
            return false;
        }

        try {
            setLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}orders/${orderId}/payment`, {
                method: 'PUT',
                body: JSON.stringify({ paymentStatus: newPaymentStatus }),
            });
            
            if (!response.ok) {
                throw new Error(`Error al actualizar pago: ${response.status}`);
            }
            
            // Refrescar las órdenes después de actualizar
            await fetchAllOrders();
            return true;
            
        } catch (error) {
            console.error('Error updating payment status:', error);
            setError('No se pudo actualizar el pago: ' + error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Cargar órdenes al montar el hook
    useEffect(() => {
        if (isAuthenticated) {
            console.log('useOrders - User authenticated, fetching orders...');
            fetchAllOrders();
        }
    }, [isAuthenticated]);

    return {
        // Estados
        orders,
        activeOrders,
        loading,
        error,
        
        // Funciones
        fetchAllOrders,
        updateOrderStatus,
        
        // Utilidades
        clearError: () => setError(''),
    };
}