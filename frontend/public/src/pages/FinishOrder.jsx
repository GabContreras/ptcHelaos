import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, User, Truck } from 'lucide-react';
import Cart from "../components/Cart";
import PaymentMethod from '../components/PaymentMethod';
import '../styles/FinishOrder.css';
import { useCart } from '../context/CartContext';
import { useOrder } from '../hooks/OrderHook/useOrder';
import LocationPicker from "../components/LocationPicker";
import toast, { Toaster } from 'react-hot-toast';

function FinishOrder() {
    const { total } = useCart();
    const { createOrder, isLoading, error, user, validateOrderData, clearError } = useOrder();

    // Estados locales para los datos del formulario
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [referencePoint, setReferencePoint] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMapActive, setIsMapActive] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const envio = 1.0;
    const totalFinal = total + envio;

    // Limpiar errores al montar el componente
    useEffect(() => {
        clearError();
    }, [clearError]);

    // Mostrar errores con toast
    useEffect(() => {
        if (error) {
            toast.error(error, {
                duration: 5000,
                position: 'top-right'
            });
        }
    }, [error]);

    const handleGoBack = () => {
        window.history.back();
    };

    // Manejar el cambio de ubicación del LocationPicker
    const handleLocationChange = (location) => {
        console.log('Ubicación recibida desde LocationPicker:', location);
        setSelectedLocation(location);
        // Cerrar el mapa cuando se seleccione una ubicación
        setIsMapActive(false);
    };

    // Función para crear la orden
    const handleCreateOrder = async () => {
        // Limpiar errores previos
        clearError();

        // Verificar que hay una ubicación seleccionada
        if (!selectedLocation) {
            toast.error('Por favor selecciona una ubicación de entrega válida');
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
            toast.error('La dirección seleccionada no es válida. Por favor selecciona otra ubicación.');
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
            toast.error('Por favor corrige los siguientes errores:\n' + validationErrors.join('\n'));
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createOrder(orderData);

            if (result.success) {
                setShowSuccessModal(true); // Mostrar modal de éxito
            } else {
                toast.error('Error al crear el pedido: ' + result.error);
            }
        } catch (err) {
            toast.error('Ocurrió un error inesperado al crear el pedido: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mostrar mensaje si no hay usuario autenticado
    if (!user) {
        return (
            <div className="finish-order">
                <div className="finish-auth-required">
                    <div className="finish-auth-content">
                        <User size={64} className="finish-auth-icon" />
                        <h2>Inicia sesión para continuar</h2>
                        <p>Necesitas estar autenticado para realizar un pedido.</p>
                        <button 
                            className="finish-auth-btn"
                            onClick={() => window.location.href = '/LoginPage'}
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="finish-order">
                {/* Botón de regreso */}
                <button className="finish-back-button" onClick={handleGoBack}>
                    <ArrowLeft size={24} />
                    <span>Regresar</span>
                </button>

                <div className='finish-resume'>
                    <div className="finish-resume-header">
                        <h1>Tu pedido</h1>
                    </div>
                    <div className='finish-cart'>
                        <Cart />
                    </div>
                </div>

                <div className='finish-order-details'>
                    <div className="finish-order-details-content">
                        <div className="finish-direction-section">
                            <div className="finish-section-header">
                                <MapPin size={20} />
                                <h2>Dirección de entrega</h2>
                            </div>

                            <div className="finish-location-container">
                                <LocationPicker onLocationChange={handleLocationChange} />
                                {selectedLocation && (
                                    <div className="finish-selected-location-info">
                                        <div className="finish-location-badge">
                                            <MapPin size={16} />
                                            <span>Dirección seleccionada</span>
                                        </div>
                                        <p className="finish-location-text">{
                                            typeof selectedLocation === 'string' ? selectedLocation :
                                                selectedLocation.address ? selectedLocation.address :
                                                    selectedLocation.formatted_address ? selectedLocation.formatted_address :
                                                        selectedLocation.display_name ? selectedLocation.display_name :
                                                            JSON.stringify(selectedLocation)
                                        }</p>
                                        {selectedLocation.coordinates && (
                                            <p className="finish-location-coords">
                                                <small>Coordenadas: {selectedLocation.coordinates.lat}, {selectedLocation.coordinates.lng}</small>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="finish-details-group">
                                <div className="finish-details">
                                    <h4>
                                        <MapPin size={16} />
                                        Punto de referencia 
                                        <span className="finish-optional">(opcional)</span>
                                    </h4>
                                    <textarea
                                        rows={4}
                                        maxLength={300}
                                        placeholder="Ej: Esquina de la plaza mayor, frente a la iglesia principal"
                                        value={referencePoint}
                                        onChange={(e) => setReferencePoint(e.target.value)}
                                        className="finish-textarea"
                                    ></textarea>
                                    <div className="finish-char-count">{referencePoint.length}/300</div>
                                </div>

                                <div className="finish-details">
                                    <h4>
                                        <Truck size={16} />
                                        Instrucciones de entrega 
                                        <span className="finish-optional">(opcional)</span>
                                    </h4>
                                    <textarea
                                        rows={4}
                                        maxLength={300}
                                        placeholder="Ej: Entregar en la puerta principal, llamar al timbre y esperar"
                                        value={deliveryInstructions}
                                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                                        className="finish-textarea"
                                    ></textarea>
                                    <div className="finish-char-count">{deliveryInstructions.length}/300</div>
                                </div>
                            </div>
                        </div>

                        <div className="finish-payment-section">
                            <div className="finish-section-header">
                                <h2>Resumen del pedido</h2>
                            </div>
                            <div className="finish-total">
                                {/* Oculta los botones, solo muestra efectivo */}
                                <div className="finish-method-label">
                                    <span className="finish-method-active">Efectivo</span>
                                </div>
                                <div className="finish-method-details">
                                    <div>subtotal: $ {total.toFixed(2)}</div>
                                    <div>método de pago: efectivo</div>
                                    <div>envio: $ {envio.toFixed(2)}</div>
                                    <div className="finish-method-total">Total: $ {totalFinal.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Botón para finalizar pedido */}
                        <div className="finish-order-submit-section">
                            <button
                                className={`finish-order-button ${
                                    (isLoading || isSubmitting || total <= 0 || !selectedLocation) 
                                        ? 'disabled' 
                                        : ''
                                }`}
                                onClick={handleCreateOrder}
                                disabled={isLoading || isSubmitting || total <= 0 || !selectedLocation}
                            >
                                {isSubmitting ? (
                                    <div className="finish-loading">
                                        <div className="finish-spinner"></div>
                                        <span>Procesando pedido...</span>
                                    </div>
                                ) : !selectedLocation ? (
                                    'Selecciona una ubicación'
                                ) : (
                                    `Finalizar pedido - $${totalFinal.toFixed(2)}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal de éxito */}
                {showSuccessModal && (
                    <div className="finish-success-modal">
                        <div className="finish-success-modal-content">
                            <div className="finish-success-icon">
                                <svg width="90" height="90" viewBox="0 0 90 90">
                                    <circle cx="45" cy="45" r="40" fill="#eafbe7" />
                                    <path d="M30 47 L42 59 L60 39" stroke="#6fcf97" strokeWidth="5" fill="none" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <h2>¡Pedido realizado!</h2>
                            <p>Tu pedido fue procesado exitosamente.</p>
                            <div className="finish-success-actions">
                                <button
                                    className="finish-success-btn finish-success-home"
                                    onClick={() => window.location.href = '/'}
                                >
                                    Regresar al inicio
                                </button>
                                <button
                                    className="finish-success-btn finish-success-track"
                                    onClick={() => window.location.href = '/FollowOrder'}
                                >
                                    Rastrear mi pedido
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Toaster para notificaciones */}
            <Toaster 
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName="finish-toast-container"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#ffffff',
                        color: '#4c3a8a',
                        border: '1px solid #d4c9ff',
                        borderRadius: '16px',
                        boxShadow: '0 8px 25px rgba(76, 58, 138, 0.15)',
                        fontSize: '14px',
                        fontWeight: '500',
                        padding: '12px 16px',
                        maxWidth: '400px',
                        fontFamily: 'montserratRegular'
                    },
                    success: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#9c8bff',
                            secondary: '#ffffff',
                        },
                        style: {
                            background: 'linear-gradient(135deg, #9c8bff 0%, #8b7aff 100%)',
                            color: '#ffffff',
                            border: '1px solid #8b7aff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ff6b8a',
                            secondary: '#ffffff',
                        },
                        style: {
                            background: 'linear-gradient(135deg, #ff6b8a 0%, #ff5978 100%)',
                            color: '#ffffff',
                            border: '1px solid #ff5978',
                        },
                    },
                }}
            />
        </>
    );
}

export default FinishOrder;