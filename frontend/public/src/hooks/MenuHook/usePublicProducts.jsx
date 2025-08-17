import { useState, useEffect } from 'react';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function usePublicProducts() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // GET - Obtener todos los productos públicos
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            const response = await fetch(`${API_BASE}products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // No necesitamos credentials para endpoints públicos
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar los productos: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('No se pudieron cargar los productos. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const createOrder = async (product) => {
        try {
            const payload = {
            products: [
                {
                productId: product._id,
                quantity: 1,
                flavors: [],
                toppings: [],
                additions: [],
                specialInstructions: "",
                subtotal: product.basePrice
                }
            ],
            totalAmount: product.basePrice,
            paymentMethod: "efectivo",       // Ajustar si necesitas que sea seleccionable
            paymentStatus: "pendiente",
            orderStatus: "pendiente",
            orderType: "local"
            };

            const response = await fetch(`${API_BASE}orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
            });

            if (!response.ok) {
            throw new Error(`Error al crear la orden: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Orden creada:", result);
            // Aquí puedes agregar lógica para notificar al usuario o actualizar estado
        } catch (error) {
            console.error("Error al crear la orden:", error.message);
        }
        };


    // Filtrar productos por búsqueda
    const filterBySearch = (term) => {
        setSearchTerm(term);
        
        if (!term.trim()) {
            setFilteredProducts(products);
            return;
        }

        const searchFiltered = products.filter(product => 
            product.name?.toLowerCase().includes(term.toLowerCase()) ||
            product.description?.toLowerCase().includes(term.toLowerCase())
        );
        
        setFilteredProducts(searchFiltered);
    };

    // Obtener producto por ID
    const getProductById = (productId) => {
        return products.find(product => product._id === productId);
    };

    // Resetear filtros
    const resetFilters = () => {
        setSearchTerm('');
        setFilteredProducts(products);
    };

    // Refrescar datos
    const refreshData = async () => {
        await fetchProducts();
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchProducts();
    }, []);

    // Aplicar filtros cuando cambien los productos
    useEffect(() => {
        if (searchTerm) {
            filterBySearch(searchTerm);
        } else {
            setFilteredProducts(products);
        }
    }, [products]);

    return {
        // Estados
        products,
        filteredProducts,
        isLoading,
        error,
        searchTerm,
        
        // Funciones de filtrado
        filterBySearch,
        resetFilters,
        
        // Funciones de utilidad
        getProductById,
        createOrder,
        refreshData,
        
        // Funciones de datos
        fetchProducts,
        
        // Setters (si necesitas control manual)
        setProducts,
        setFilteredProducts,
        setSearchTerm,
        setError,
    };
}