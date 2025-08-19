import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useOrderInventory() {
    const { authenticatedFetch, isAuthenticated } = useAuth();
    
    const [inventory, setInventory] = useState([]);
    const [flavors, setFlavors] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Datos por defecto específicos para helados de rollo
    const defaultFlavors = [
        { name: 'Oreo', extraPrice: 0 },
        { name: 'Coco', extraPrice: 0 },
        { name: 'Café', extraPrice: 0 },
        { name: 'Chicle', extraPrice: 0.25 },
        { name: 'Fresa', extraPrice: 0 },
        { name: 'Banano', extraPrice: 0 },
        { name: 'Mantequilla de maní', extraPrice: 0 },
        { name: 'Piña', extraPrice: 0 },
        { name: 'Nutella', extraPrice: 0.25 },
        { name: 'Chocolate', extraPrice: 0 },
        { name: 'Vainilla', extraPrice: 0 }
    ];
    
    const defaultToppings = [
        { name: 'Maní', extraPrice: 0.25 },
        { name: 'Oreo', extraPrice: 0.50 },
        { name: 'Chispas de colores', extraPrice: 0.25 },
        { name: 'Granola', extraPrice: 0.25 },
        { name: 'Krispy', extraPrice: 0.25 },
        { name: 'Leche condensada', extraPrice: 0.30 },
        { name: 'Jalea de chocolate', extraPrice: 0.25 },
        { name: 'Jalea de Fresa', extraPrice: 0.25 },
        { name: 'Caramelo', extraPrice: 0.25 },
        { name: 'Crema Batida', extraPrice: 0.20 }
    ];

    // Función para obtener categorías
    const fetchCategories = async () => {
        try {
            let response;
            
            if (isAuthenticated && authenticatedFetch) {
                response = await authenticatedFetch(`${API_BASE}category`);
            } else {
                response = await fetch(`${API_BASE}category`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
                return data;
            }
            
            return [];
        } catch (error) {
            console.warn('Error al cargar categorías:', error);
            return [];
        }
    };

    // Función para obtener inventario
    const fetchInventory = async (categoriesData = null) => {
        try {
            setIsLoading(true);
            setError('');
            
            let response;
            
            if (isAuthenticated && authenticatedFetch) {
                response = await authenticatedFetch(`${API_BASE}inventory`);
            } else {
                response = await fetch(`${API_BASE}inventory`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            if (response.ok) {
                const data = await response.json();
                setInventory(data);
                processInventoryData(data, categoriesData || categories);
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.warn('Error al cargar inventario, usando datos por defecto:', error);
            useFallbackData();
        } finally {
            setIsLoading(false);
        }
    };

    // Usar datos por defecto
    const useFallbackData = () => {
        setFlavors(defaultFlavors);
        setToppings(defaultToppings);
        setError('');
    };

    // Procesar datos del inventario
    const processInventoryData = (inventoryData, categoriesData) => {
        if (!Array.isArray(inventoryData) || inventoryData.length === 0) {
            useFallbackData();
            return;
        }

        // Filtrar items activos
        const activeItems = inventoryData.filter(item => 
            item.isActive === true && item.isVerified !== false
        );

        // Función para identificar sabores
        const isFlavorItem = (item) => {
            if (item.categoryId?.name) {
                const categoryName = item.categoryId.name.toLowerCase();
                return categoryName.includes('sabor') || 
                       categoryName.includes('helado') ||
                       categoryName.includes('flavor');
            }
            
            if (typeof item.categoryId === 'string' && categoriesData) {
                const category = categoriesData.find(cat => cat._id === item.categoryId);
                if (category) {
                    const categoryName = category.name.toLowerCase();
                    return categoryName.includes('sabor') || 
                           categoryName.includes('helado') ||
                           categoryName.includes('flavor');
                }
            }
            
            return false;
        };

        // Función para identificar toppings
        const isToppingItem = (item) => {
            if (item.categoryId?.name) {
                const categoryName = item.categoryId.name.toLowerCase();
                return categoryName.includes('topping') || 
                       categoryName.includes('complemento') ||
                       categoryName.includes('extra') ||
                       categoryName.includes('jalea');
            }
            
            if (typeof item.categoryId === 'string' && categoriesData) {
                const category = categoriesData.find(cat => cat._id === item.categoryId);
                if (category) {
                    const categoryName = category.name.toLowerCase();
                    return categoryName.includes('topping') || 
                           categoryName.includes('complemento') ||
                           categoryName.includes('extra') ||
                           categoryName.includes('jalea');
                }
            }
            
            return false;
        };

        // Separar sabores y toppings
        const flavorItems = activeItems.filter(isFlavorItem);
        const toppingItems = activeItems.filter(isToppingItem);

        // Procesar sabores
        const processedFlavors = flavorItems.map(item => ({
            name: item.name,
            extraPrice: item.extraPrice || 0,
            isActive: true,
            isAvailable: item.currentStock > 0 || item.currentStock === undefined
        }));

        // Procesar toppings
        const processedToppings = toppingItems.map(item => ({
            name: item.name,
            extraPrice: item.extraPrice || 0.25,
            isActive: true,
            isAvailable: item.currentStock > 0 || item.currentStock === undefined
        }));

        // Si no se encontraron datos, usar por defecto
        if (processedFlavors.length === 0 && processedToppings.length === 0) {
            useFallbackData();
        } else {
            setFlavors(processedFlavors.length > 0 ? processedFlavors : defaultFlavors);
            setToppings(processedToppings.length > 0 ? processedToppings : defaultToppings);
        }
    };

    // Funciones principales para TomaDeOrdenes
    const getFlavorNames = () => {
        return flavors
            .filter(flavor => flavor.isAvailable !== false)
            .map(flavor => flavor.name);
    };
    
    const getToppingNames = () => {
        return toppings
            .filter(topping => topping.isAvailable !== false)
            .map(topping => topping.name);
    };
    
    const getFlavorExtraPrice = (flavorName) => {
        const flavor = flavors.find(f => f.name === flavorName);
        return flavor ? flavor.extraPrice : 0;
    };
    
    const getToppingExtraPrice = (toppingName) => {
        const topping = toppings.find(t => t.name === toppingName);
        return topping ? topping.extraPrice : 0.25;
    };
    
    const isFlavorAvailable = (flavorName) => {
        const flavor = flavors.find(f => f.name === flavorName);
        return flavor ? flavor.isAvailable !== false : false;
    };
    
    const isToppingAvailable = (toppingName) => {
        const topping = toppings.find(t => t.name === toppingName);
        return topping ? topping.isAvailable !== false : false;
    };

    // Refrescar datos
    const refreshData = async () => {
        const categoriesData = await fetchCategories();
        await fetchInventory(categoriesData);
    };

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            const categoriesData = await fetchCategories();
            await fetchInventory(categoriesData);
        };
        
        loadData();
    }, [isAuthenticated]);

    return {
        // Estados
        isLoading,
        error,
        flavors,
        toppings,
        
        // Funciones principales
        getFlavorNames,
        getToppingNames,
        getFlavorExtraPrice,
        getToppingExtraPrice,
        isFlavorAvailable,
        isToppingAvailable,
        
        // Utilidades
        refreshData,
        setError
    };
}