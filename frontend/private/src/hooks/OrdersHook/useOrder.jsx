import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useOrder() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    // Estados principales
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Estados simplificados - SIN customizations globales
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCustomizationModal, setShowCustomizationModal] = useState(false);

    // Estados del cliente y orden
    const [orderType, setOrderType] = useState('local');
    const [paymentMethod, setPaymentMethod] = useState('efectivo');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: ''
    });

    // Opciones de personalización - ESTÁTICO
    const customizationOptions = useMemo(() => ({
        sizes: [
            { id: 'small', name: 'Pequeño', price: 0 },
            { id: 'medium', name: 'Mediano', price: 1.50 },
            { id: 'large', name: 'Grande', price: 2.50 },
            { id: 'xlarge', name: 'Extra Grande', price: 3.50 }
        ],
        flavors: [
            { id: 'vanilla', name: 'Vainilla', price: 0 },
            { id: 'chocolate', name: 'Chocolate', price: 0.50 },
            { id: 'strawberry', name: 'Fresa', price: 0.50 },
            { id: 'caramel', name: 'Caramelo', price: 0.80 },
            { id: 'nutella', name: 'Nutella', price: 1.20 },
            { id: 'coconut', name: 'Coco', price: 0.60 },
            { id: 'mint', name: 'Menta', price: 0.70 },
            { id: 'cookies', name: 'Cookies & Cream', price: 0.90 }
        ],
        toppings: [
            { id: 'whipped', name: 'Crema Batida', price: 0.50 },
            { id: 'fruit', name: 'Frutas Frescas', price: 1.00 },
            { id: 'nuts', name: 'Nueces', price: 0.80 },
            { id: 'sprinkles', name: 'Chispitas', price: 0.30 },
            { id: 'syrup', name: 'Jarabe', price: 0.60 },
            { id: 'granola', name: 'Granola', price: 0.70 }
        ],
        additions: [
            { id: 'butter', name: 'Mantequilla', price: 0.50 },
            { id: 'honey', name: 'Miel', price: 0.70 },
            { id: 'jam', name: 'Mermelada', price: 0.80 },
            { id: 'cheese', name: 'Queso Crema', price: 1.20 },
            { id: 'ham', name: 'Jamón', price: 1.60 },
            { id: 'avocado', name: 'Aguacate', price: 1.40 }
        ]
    }), []);

    // Cargar categorías - IGUAL
    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}categories`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
                return data;
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (apiError) {
            const defaultCategories = [
                { _id: '689ecf83887259f3d77453ab', name: 'Waffles' },
                { _id: '689ee0fc544e9c4b4c5bff43', name: 'Helados' },
                { _id: '689ee107544e9c4b4c5bff5c', name: 'Pancakes' },
                { _id: '686b4c0f2d74deabc307520a', name: 'Panes' }
            ];
            setCategories(defaultCategories);
            return defaultCategories;
        }
    }, []);

    // Cargar productos - IGUAL
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            
            const loadedCategories = await fetchCategories();
            let fetchedProducts = [];
            
            try {
                const response = await fetch(`${API_BASE}products/available`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    fetchedProducts = data;
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            } catch (apiError) {
                const realCategoryId = '685e088b1fd1c384c2f8340';
                fetchedProducts = [
                    {
                        _id: 'example-prod-1',
                        name: 'Waffle Clásico',
                        categoryId: realCategoryId,
                        description: 'Delicioso waffle tradicional dorado y crujiente',
                        basePrice: 5.80,
                        preparationTime: '10-15 min',
                        available: true,
                        images: [{ url: '/api/placeholder/200/150' }]
                    },
                    {
                        _id: 'example-prod-2',
                        name: 'Helado Artesanal',
                        categoryId: realCategoryId,
                        description: 'Helado cremoso hecho con ingredientes naturales',
                        basePrice: 4.50,
                        preparationTime: '5 min',
                        available: true,
                        images: [{ url: '/api/placeholder/200/150' }]
                    }
                ];
            }
            
            setProducts(fetchedProducts);
            
            if (fetchedProducts.length > 0) {
                const uniqueCategoryIds = [...new Set(fetchedProducts.map(product => {
                    if (typeof product.categoryId === 'object' && product.categoryId !== null) {
                        return product.categoryId.toString();
                    }
                    return String(product.categoryId);
                }))];
                
                const dynamicCategories = uniqueCategoryIds.map((categoryId, index) => {
                    const categoryNames = ['Waffles', 'Helados', 'Pancakes', 'Panes', 'Bebidas', 'Postres'];
                    return {
                        _id: categoryId,
                        name: categoryNames[index] || `Categoría ${index + 1}`
                    };
                });
                
                if (loadedCategories.length === 0) {
                    setCategories(dynamicCategories);
                }
            }
            
            setSuccess('Productos cargados exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (err) {
            setError('Error al cargar productos: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [fetchCategories]);

    // Obtener productos filtrados
    const getFilteredProducts = useCallback((categoryId) => {
        if (!categoryId || !products.length) return [];
        
        return products.filter(product => {
            if (!product.available) return false;
            
            let productCategoryId;
            if (typeof product.categoryId === 'object' && product.categoryId !== null) {
                productCategoryId = product.categoryId.toString();
            } else {
                productCategoryId = String(product.categoryId);
            }
            
            return productCategoryId === categoryId;
        });
    }, [products]);

    // Abrir modal - SIMPLIFICADO
    const openCustomizationModal = useCallback((product) => {
        setSelectedProduct(product);
        setShowCustomizationModal(true);
    }, []);

    // Cerrar modal - SIMPLIFICADO
    const closeCustomizationModal = useCallback(() => {
        setShowCustomizationModal(false);
        setSelectedProduct(null);
    }, []);

    // Agregar al carrito - RECIBE DATOS COMPLETOS DEL MODAL
    const addToCart = useCallback((itemData) => {
        const { product, customizations, totalPrice } = itemData;
        
        // Obtener nombres de opciones
        const sizeOption = customizationOptions.sizes.find(s => s.id === customizations.size);
        const flavorNames = customizations.flavors.map(id => 
            customizationOptions.flavors.find(f => f.id === id)?.name
        ).filter(Boolean);
        const toppingNames = customizations.toppings.map(id => 
            customizationOptions.toppings.find(t => t.id === id)?.name
        ).filter(Boolean);
        const additionNames = customizations.additions.map(id => 
            customizationOptions.additions.find(a => a.id === id)?.name
        ).filter(Boolean);

        const cartItem = {
            id: `${product._id}-${Date.now()}-${Math.random()}`,
            product,
            customizations: {
                ...customizations,
                sizeName: sizeOption?.name,
                flavorNames,
                toppingNames,
                additionNames
            },
            unitPrice: totalPrice / customizations.quantity,
            totalPrice
        };
        
        setCart(prev => [...prev, cartItem]);
        setSuccess('Producto agregado al carrito');
        setTimeout(() => setSuccess(''), 3000);
        
        // Cerrar modal automáticamente
        closeCustomizationModal();
    }, [customizationOptions, closeCustomizationModal]);

    // Remover del carrito
    const removeFromCart = useCallback((itemId) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
        setSuccess('Producto removido del carrito');
        setTimeout(() => setSuccess(''), 2000);
    }, []);

    // Limpiar carrito
    const clearCart = useCallback(() => {
        setCart([]);
        setSuccess('Carrito limpiado');
        setTimeout(() => setSuccess(''), 2000);
    }, []);

    // Total del carrito
    const getCartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    }, [cart]);

    // Crear orden - RECIBE DATOS DEL MODAL DE CHECKOUT
    const createOrder = useCallback(async (orderData) => {
        try {
            setLoading(true);
            setError('');

            if (cart.length === 0) {
                setError('El carrito está vacío');
                return { success: false };
            }

            // Los datos vienen del modal, no del estado global
            const { customerInfo: localCustomerInfo, orderType: localOrderType, paymentMethod: localPaymentMethod } = orderData;

            if (!localCustomerInfo.name.trim()) {
                setError('El nombre del cliente es obligatorio');
                return { success: false };
            }

            if (!localCustomerInfo.phone.trim()) {
                setError('El teléfono del cliente es obligatorio');
                return { success: false };
            }

            if (localOrderType === 'delivery' && !localCustomerInfo.address.trim()) {
                setError('La dirección es obligatoria para delivery');
                return { success: false };
            }

            const createIngredientReference = (ingredientName) => {
                const ingredientMap = {
                    'vanilla': '507f1f77bcf86cd799439011',
                    'chocolate': '507f1f77bcf86cd799439012', 
                    'strawberry': '507f1f77bcf86cd799439013',
                    'caramel': '507f1f77bcf86cd799439014',
                    'nutella': '507f1f77bcf86cd799439015',
                    'coconut': '507f1f77bcf86cd799439016',
                    'mint': '507f1f77bcf86cd799439017',
                    'cookies': '507f1f77bcf86cd799439018',
                    'whipped': '507f1f77bcf86cd799439021',
                    'fruit': '507f1f77bcf86cd799439022',
                    'nuts': '507f1f77bcf86cd799439023',
                    'sprinkles': '507f1f77bcf86cd799439024',
                    'syrup': '507f1f77bcf86cd799439025',
                    'granola': '507f1f77bcf86cd799439026',
                    'butter': '507f1f77bcf86cd799439031',
                    'honey': '507f1f77bcf86cd799439032',
                    'jam': '507f1f77bcf86cd799439033',
                    'cheese': '507f1f77bcf86cd799439034',
                    'ham': '507f1f77bcf86cd799439035',
                    'avocado': '507f1f77bcf86cd799439036'
                };
                return ingredientMap[ingredientName] || '507f1f77bcf86cd799439999';
            };

            const orderDataToSend = {
                customerId: localCustomerInfo.customerId || null,
                customerName: localCustomerInfo.name,
                customerPhone: localCustomerInfo.phone,
                products: cart.map(item => ({
                    productId: item.product._id,
                    quantity: item.customizations.quantity,
                    flavors: (item.customizations.flavors || []).map(flavorId => ({
                        ingredientId: createIngredientReference(flavorId),
                        quantity: 1
                    })),
                    toppings: (item.customizations.toppings || []).map(toppingId => ({
                        ingredientId: createIngredientReference(toppingId),
                        quantity: 1
                    })),
                    additions: (item.customizations.additions || []).map(additionId => ({
                        ingredientId: createIngredientReference(additionId),
                        quantity: 1
                    })),
                    specialInstructions: item.customizations.specialInstructions || '',
                    subtotal: item.totalPrice
                })),
                totalAmount: getCartTotal,
                paymentMethod: localPaymentMethod,
                paymentStatus: localPaymentMethod === 'efectivo' ? 'pendiente' : 'pagado',
                orderStatus: 'pendiente',
                orderType: localOrderType,
                deliveryAddress: localOrderType === 'delivery' ? localCustomerInfo.address : undefined
            };

            let newOrder;

            if (isAuthenticated && authenticatedFetch) {
                try {
                    const response = await authenticatedFetch(`${API_BASE}orders`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderDataToSend),
                        credentials: 'include'
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `Error al crear la orden: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    newOrder = result.order || result;
                } catch (apiError) {
                    throw apiError;
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 2000));
                newOrder = {
                    _id: `ORD-${Date.now()}`,
                    ...orderDataToSend,
                    createdAt: new Date().toISOString(),
                    estimatedTime: '15-20 min'
                };
            }

            setOrders(prev => [newOrder, ...prev]);
            clearCart();
            
            // No limpiar estados globales, eso lo hace el modal
            setSuccess('¡Orden creada exitosamente!');
            setTimeout(() => setSuccess(''), 4000);

            return { success: true, order: newOrder };

        } catch (err) {
            setError('Error al crear la orden: ' + err.message);
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, [cart, getCartTotal, isAuthenticated, authenticatedFetch, clearCart]);

    // Obtener todas las órdenes usando tu endpoint - FUNCIÓN QUE FALTABA
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            
            console.log('Cargando órdenes...');
            
            if (isAuthenticated && authenticatedFetch) {
                const response = await authenticatedFetch(`${API_BASE}orders`, {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error(`Error al cargar órdenes: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Órdenes cargadas desde API:', data);
                setOrders(data);
            } else {
                // Si no hay autenticación, mostrar órdenes de ejemplo - CORREGIDAS
                console.log('Sin autenticación, usando órdenes de ejemplo');
                const exampleOrders = [
                    {
                        _id: `689ecf83887259f3d77453ab`,
                        customerName: 'María González',
                        customerPhone: '2222-3333',
                        products: [
                            {
                                productId: { name: 'Waffle Clásico' },
                                quantity: 2,
                                flavors: [{ ingredientId: { name: 'Chocolate' } }],
                                toppings: [{ ingredientId: { name: 'Crema Batida' } }],
                                subtotal: 13.60,
                                specialInstructions: 'Extra crujiente'
                            }
                        ],
                        totalAmount: 15.60,
                        paymentMethod: 'tarjeta',
                        paymentStatus: 'pagado',
                        orderStatus: 'en preparación',
                        orderType: 'delivery',
                        deliveryAddress: 'Colonia Escalón, Block A, Casa 45, San Salvador',
                        createdAt: new Date().toISOString(),
                        estimatedTime: '25-30 min'
                    },
                    {
                        _id: `689ecf83887259f3d77453bb`,
                        customerName: 'Carlos Mendoza', 
                        customerPhone: '7777-8888',
                        products: [
                            {
                                productId: { name: 'Helado Artesanal' },
                                quantity: 1,
                                flavors: [
                                    { ingredientId: { name: 'Vainilla' } },
                                    { ingredientId: { name: 'Fresa' } }
                                ],
                                toppings: [{ ingredientId: { name: 'Sprinkles' } }],
                                subtotal: 6.80
                            }
                        ],
                        totalAmount: 6.80,
                        paymentMethod: 'efectivo',
                        paymentStatus: 'pagado', 
                        orderStatus: 'entregado',
                        orderType: 'local',
                        createdAt: new Date(Date.now() - 3600000).toISOString(),
                        estimatedTime: '5-10 min'
                    },
                    {
                        _id: `689ecf83887259f3d77453cc`,
                        customerName: 'Ana Rodríguez',
                        customerPhone: '1111-2222',
                        products: [
                            {
                                productId: { name: 'Pancake Especial' },
                                quantity: 3,
                                flavors: [{ ingredientId: { name: 'Nutella' } }],
                                toppings: [
                                    { ingredientId: { name: 'Frutas Frescas' } },
                                    { ingredientId: { name: 'Miel' } }
                                ],
                                subtotal: 18.90
                            }
                        ],
                        totalAmount: 20.90,
                        paymentMethod: 'efectivo',
                        paymentStatus: 'pendiente',
                        orderStatus: 'pendiente',
                        orderType: 'delivery',
                        deliveryAddress: 'San Benito, Calle La Reforma #123, San Salvador',
                        createdAt: new Date(Date.now() - 1800000).toISOString(),
                        estimatedTime: '20-25 min'
                    },
                    {
                        _id: `689ecf83887259f3d77453dd`,
                        customerName: 'Luis Hernández',
                        customerPhone: '5555-6666',
                        products: [
                            {
                                productId: { name: 'Combo Familiar' },
                                quantity: 1,
                                flavors: [
                                    { ingredientId: { name: 'Chocolate' } },
                                    { ingredientId: { name: 'Vainilla' } }
                                ],
                                toppings: [
                                    { ingredientId: { name: 'Crema Batida' } },
                                    { ingredientId: { name: 'Nueces' } }
                                ],
                                subtotal: 25.50
                            }
                        ],
                        totalAmount: 25.50,
                        paymentMethod: 'tarjeta',
                        paymentStatus: 'pagado',
                        orderStatus: 'en camino',
                        orderType: 'delivery',
                        deliveryAddress: 'Colonia Miramonte, Av. Las Flores #456, San Salvador',
                        createdAt: new Date(Date.now() - 900000).toISOString(),
                        estimatedTime: '15-20 min'
                    },
                    {
                        _id: `689ecf83887259f3d77453ee`,
                        customerName: 'Sofia Martínez',
                        customerPhone: '9999-0000',
                        products: [
                            {
                                productId: { name: 'Helado Premium' },
                                quantity: 2,
                                flavors: [{ ingredientId: { name: 'Caramelo' } }],
                                toppings: [{ ingredientId: { name: 'Granola' } }],
                                subtotal: 12.40
                            }
                        ],
                        totalAmount: 12.40,
                        paymentMethod: 'efectivo',
                        paymentStatus: 'pagado',
                        orderStatus: 'recibido',
                        orderType: 'local',
                        createdAt: new Date(Date.now() - 300000).toISOString(),
                        estimatedTime: '10-15 min'
                    }
                ];
                setOrders(exampleOrders);
            }
            
            setSuccess('Órdenes cargadas exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (err) {
            console.error('Error al cargar órdenes:', err);
            setError('Error al cargar órdenes: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, authenticatedFetch]);

    // Actualizar estado de orden usando tu endpoint - MEJORADA
    const updateOrderStatus = useCallback(async (orderId, newStatus) => {
        try {
            setLoading(true);
            setError('');
            
            console.log('Actualizando orden:', orderId, 'a:', newStatus);
            
            if (isAuthenticated && authenticatedFetch) {
                const response = await authenticatedFetch(`${API_BASE}orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderStatus: newStatus }),
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error al actualizar orden: ${response.status}`);
                }
            }
            
            // Actualizar estado local
            setOrders(prev => prev.map(order => 
                order._id === orderId 
                    ? { ...order, orderStatus: newStatus }
                    : order
            ));
            
            setSuccess('Estado de orden actualizado exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            
        } catch (err) {
            console.error('Error al actualizar orden:', err);
            setError('Error al actualizar orden: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, authenticatedFetch]);

    const clearMessages = useCallback(() => {
        setError('');
        setSuccess('');
    }, []);

    return {
        // Estados principales
        products,
        categories,
        cart,
        orders,
        loading,
        error,
        success,
        
        // Estados de modal simplificados
        selectedProduct,
        showCustomizationModal,
        customizationOptions,
        
        // Estados del cliente y orden
        orderType,
        setOrderType,
        paymentMethod,
        setPaymentMethod,
        customerInfo,
        setCustomerInfo,
        
        // Funciones principales
        fetchProducts,
        getFilteredProducts,
        openCustomizationModal,
        closeCustomizationModal,
        addToCart,
        removeFromCart,
        getCartTotal,
        clearCart,
        createOrder,
        
        // Funciones de órdenes
        fetchOrders,
        updateOrderStatus,
        
        // Utilidades
        clearMessages
    };
}