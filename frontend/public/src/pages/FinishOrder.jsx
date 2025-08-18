import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Cart from "../components/Cart";
import PaymentMethod from '../components/PaymentMethod';
import '../styles/FinishOrder.css';
import { useCart } from '../context/CartContext';
import { useOrder } from '../hooks/OrderHook/useOrder';
import LocationPicker from "../components/LocationPicker";

function FinishOrder() {
    const { total } = useCart();
    const { createOrder, isLoading, error, user, validateOrderData, clearError } = useOrder();
    
    // Estados locales para los datos del formulario
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [referencePoint, setReferencePoint] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const envio = 1.0;
    const totalFinal = total + envio;

    // Limpiar errores al montar el componente
    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleGoBack = () => {
        window.history.back();
    };

    // Manejar el cambio de ubicación del LocationPicker
    const handleLocationChange = (location) => {
        console.log('Ubicación recibida desde LocationPicker:', location);
        console.log('Tipo de dato:', typeof location);
        console.log('Estructura de location:', JSON.stringify(location, null, 2));
        setSelectedLocation(location);
    };

    // Función para crear la orden
    const handleCreateOrder = async () => {
        // Limpiar errores previos
        clearError();
        
        // Verificar que hay una ubicación seleccionada
        console.log('selectedLocation al crear orden:', selectedLocation);
        
        if (!selectedLocation) {
            alert('Por favor selecciona una ubicación de entrega válida');
            return;
        }

        // Intentar extraer la dirección de diferentes formatos posibles
        let address = '';
        let coordinates = null;

        if (typeof selectedLocation === 'string') {
            address = selectedLocation;
        } else if (selectedLocation.address) {
            address = selectedLocation.address;
            coordinates = selectedLocation.coordinates;
        } else if (selectedLocation.formatted_address) {
            address = selectedLocation.formatted_address;
            coordinates = selectedLocation.geometry ? {
                lat: selectedLocation.geometry.location.lat(),
                lng: selectedLocation.geometry.location.lng()
            } : null;
        } else if (selectedLocation.display_name) {
            address = selectedLocation.display_name;
            coordinates = selectedLocation.lat && selectedLocation.lon ? {
                lat: parseFloat(selectedLocation.lat),
                lng: parseFloat(selectedLocation.lon)
            } : null;
        }

        if (!address || address.trim() === '') {
            alert('La dirección seleccionada no es válida. Por favor selecciona otra ubicación.');
            return;
        }
        
        // Preparar datos de la orden
        const orderData = {
            address: address,
            coordinates: coordinates,
            referencePoint: referencePoint.trim(),
            deliveryInstructions: deliveryInstructions.trim(),
            paymentMethod: paymentMethod,
            deliveryFee: envio
        };

        // Validar datos
        const validationErrors = validateOrderData(orderData);
        if (validationErrors.length > 0) {
            alert('Por favor corrige los siguientes errores:\n' + validationErrors.join('\n'));
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('Creando orden con datos:', orderData);
            const result = await createOrder(orderData);
            
            if (result.success) {
                alert('¡Pedido creado exitosamente!');
                // Redirigir a una página de confirmación o al historial de pedidos
                window.location.href = '/orders'; // o la ruta que prefieras
            } else {
                alert('Error al crear el pedido: ' + result.error);
            }
        } catch (err) {
            console.error('Error inesperado:', err);
            alert('Ocurrió un error inesperado al crear el pedido: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mostrar mensaje si no hay usuario autenticado
    if (!user) {
        return (
            <div className="finishOrder">
                <div className="auth-required">
                    <h2>Inicia sesión para continuar</h2>
                    <p>Necesitas estar autenticado para realizar un pedido.</p>
                    <button onClick={() => window.location.href = '/LoginPage'}>
                        Iniciar sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="finishOrder">
                {/* Botón de regreso */}
                <button className="back-button" onClick={handleGoBack}>
                    <ArrowLeft size={24} />
                    <span>Regresar</span>
                </button>

                {/* Mostrar información del usuario */}
                <div className="user-info">
                    <p>Pedido para: <strong>{user.name}</strong> ({user.email})</p>
                </div>

                <div className='resume'>
                    <div className="resume-header">
                        <h1>Tu pedido</h1>
                    </div>
                    <div className='cart'>
                        <Cart/>
                    </div>
                </div>

                <div className='orderDetails'>
                    <div className="orderDetails-content">
                        <div className="direction-section">
                            <div className="section-header">
                                <h2>Dirección de entrega</h2>
                            </div>

                            <div className="location-container">
                                <LocationPicker onLocationChange={handleLocationChange} />
                                {selectedLocation && (
                                    <div className="selected-location-info" style={{
                                        backgroundColor: '#e8f5e8',
                                        border: '1px solid #4caf50',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        margin: '10px 0'
                                    }}>
                                        <p><strong>Dirección seleccionada:</strong></p>
                                        <p>{
                                            typeof selectedLocation === 'string' ? selectedLocation :
                                            selectedLocation.address ? selectedLocation.address :
                                            selectedLocation.formatted_address ? selectedLocation.formatted_address :
                                            selectedLocation.display_name ? selectedLocation.display_name :
                                            JSON.stringify(selectedLocation)
                                        }</p>
                                        {selectedLocation.coordinates && (
                                            <p><small>Coordenadas: {selectedLocation.coordinates.lat}, {selectedLocation.coordinates.lng}</small></p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="details-group">
                                <div className="details"> 
                                    <h4>Punto de referencia <span className="optional">(opcional)</span></h4>
                                    <textarea
                                        rows={4}
                                        maxLength={300}
                                        placeholder="Ej: Esquina de la plaza mayor, frente a la iglesia principal"
                                        value={referencePoint}
                                        onChange={(e) => setReferencePoint(e.target.value)}
                                    ></textarea>
                                </div>   

                                <div className="details">
                                    <h4>Instrucciones de entrega <span className="optional">(opcional)</span></h4>
                                    <textarea
                                        rows={4}
                                        maxLength={300}
                                        placeholder="Ej: Entregar en la puerta principal, llamar al timbre y esperar"
                                        value={deliveryInstructions}
                                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="payment-section">
                            <div className="section-header">
                                <h2>Resumen del pedido</h2>
                            </div>
                            <div className="total">
                                <PaymentMethod 
                                    subtotal={`$ ${total.toFixed(2)}`}
                                    envio={`$ ${envio.toFixed(2)}`}
                                    total={`$ ${totalFinal.toFixed(2)}`}
                                    selectedMethod={paymentMethod}
                                    onMethodChange={setPaymentMethod}
                                />
                            </div>
                        </div>

                        {/* Mostrar errores si los hay */}
                        {error && (
                            <div className="error-message" style={{
                                backgroundColor: '#ffebee',
                                border: '1px solid #f44336',
                                borderRadius: '4px',
                                padding: '10px',
                                margin: '10px 0',
                                color: '#c62828'
                            }}>
                                <p><strong>Error:</strong> {error}</p>
                            </div>
                        )}

                        {/* Botón para finalizar pedido */}
                        <div className="finish-order-section">
                            <button 
                                className="finish-order-button"
                                onClick={handleCreateOrder}
                                disabled={isLoading || isSubmitting || total <= 0 || !selectedLocation}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    backgroundColor: (isLoading || isSubmitting || total <= 0 || !selectedLocation) ? '#ccc' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    cursor: (isLoading || isSubmitting || total <= 0 || !selectedLocation) ? 'not-allowed' : 'pointer',
                                    marginTop: '20px'
                                }}
                            >
                                {isSubmitting ? 'Procesando pedido...' : 
                                 !selectedLocation ? 'Selecciona una ubicación' :
                                 `Finalizar pedido - $${totalFinal.toFixed(2)}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FinishOrder;