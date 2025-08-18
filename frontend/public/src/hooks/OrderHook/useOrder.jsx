import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useOrder() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    const { cart, clearCart, total } = useCart();
    
    // Estados principales
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Función para limpiar errores
    const clearError = () => {
        setError('');
    };

    // Función para validar datos de la orden
    const validateOrderData = (orderData) => {
        const errors = [];

        if (!orderData.address || orderData.address.trim() === '') {
            errors.push('La dirección de entrega es obligatoria');
        }

        if (!orderData.paymentMethod) {
            errors.push('El método de pago es obligatorio');
        }

        if (!cart || cart.length === 0) {
            errors.push('El carrito está vacío');
        }

        // Validar que todos los productos tengan precio y ID
        const invalidProducts = cart.filter(item => !item.totalPrice || item.totalPrice <= 0);
        if (invalidProducts.length > 0) {
            errors.push('Algunos productos no tienen precio válido');
        }

        // Validar que todos los productos tengan ID
        const productsWithoutId = cart.filter(item => !item._id && !item.id);
        if (productsWithoutId.length > 0) {
            errors.push('Algunos productos no tienen ID válido');
        }

        // Validar usuario autenticado
        if (!isAuthenticated || !user) {
            errors.push('Debes estar autenticado para realizar un pedido');
        }

        return errors;
    };

    // POST - Crear nueva orden
    const createOrder = async (orderData) => {
        try {
            setIsLoading(true);
            setError('');

            // Validar datos
            const validationErrors = validateOrderData(orderData);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join(', '));
            }

            // Calcular totales
            const subtotal = total;
            const deliveryFee = orderData.deliveryFee || 0;
            const totalAmount = subtotal + deliveryFee;

            // Preparar datos de la orden según tu modelo
            const orderPayload = {
                customerId: user.id || null,
                customerName: user.name || user.username || 'Cliente',
                customerPhone: user.phone || '',
                employeeId: "online", // Para órdenes online
                products: cart.map(item => ({
                    productId: item._id || item.id, // Asegurar que productId existe
                    productName: item.name,
                    quantity: item.quantity || 1,
                    unitPrice: item.price || 0,
                    totalPrice: item.totalPrice || 0,
                    customizations: item.customizations || [],
                    notes: item.notes || ''
                })),
                totalAmount: totalAmount,
                paymentMethod: orderData.paymentMethod === 'cash' ? 'efectivo' : orderData.paymentMethod,
                paymentStatus: 'pendiente',
                orderStatus: 'pendiente',
                orderType: 'delivery',
                
                // Información de entrega como string
                deliveryAddress: orderData.address,
                
                // Información adicional de entrega separada
                deliveryCoordinates: orderData.coordinates,
                deliveryReferencePoint: orderData.referencePoint || '',
                deliveryInstructions: orderData.deliveryInstructions || '',
                deliveryFee: deliveryFee,
                
                // Timestamps
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            console.log('Datos de la orden a enviar:', orderPayload);

            // Realizar la petición HTTP
            const response = await authenticatedFetch(`${API_BASE}orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            
            // Si la orden se creó exitosamente, limpiar el carrito
            clearCart();
            setSuccess('¡Pedido creado exitosamente!');
            
            return { success: true, order: result };

        } catch (error) {
            console.error('Error al crear orden:', error);
            setError(error.message || 'Error al crear la orden');
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // Estados
        isLoading,
        error,
        success,
        user,
        isAuthenticated,
        
        // Funciones
        createOrder,
        validateOrderData,
        clearError
    };
}