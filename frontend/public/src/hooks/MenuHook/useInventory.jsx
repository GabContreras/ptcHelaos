import { useState, useEffect } from 'react';
import { config } from '../../config';
import { useAuth } from '../../context/AuthContext';

const API_BASE = config.api.API_BASE;

export function useInventory() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [flavors, setFlavors] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // GET - Obtener todos los inventarios
    const fetchInventory = async () => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver el inventario.');
            return;
        }

        if (!user || (user.userType !== 'admin' && user.userType !== 'employee' && user.userType !== 'customer')) {
            setError('No tienes permisos para ver el inventario.');
            setInventory([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}inventory`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar inventarios: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setInventory(data);
        } catch (error) {
            setError('No se pudieron cargar los inventarios. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // GET - Obtener todas las categorías
    const fetchCategories = async () => {
        try {
            const response = await authenticatedFetch(`${API_BASE}category`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar categorías: ${response.status}`);
            }
            
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.warn('No se pudieron cargar las categorías:', error.message);
            setCategories([]);
        }
    };

    // Procesar datos del inventario para separar sabores y toppings
    const processInventoryData = (inventoryData) => {
        if (!Array.isArray(inventoryData)) {
            console.warn('Los datos del inventario no son un array:', inventoryData);
            return;
        }

        // Filtrar solo items activos y verificados
        const activeItems = inventoryData.filter(item => 
            item.isActive === true && 
            item.isVerified !== false // Solo excluir si explícitamente es false
        );

        // Separar por categorías
        const flavorItems = activeItems.filter(item => {
            // Si tienes el objeto categoryId completo (populated)
            if (item.categoryId && typeof item.categoryId === 'object' && item.categoryId.name) {
                const categoryName = item.categoryId.name.toLowerCase();
                return categoryName.includes('sabor') || 
                       categoryName.includes('helado') ||
                       categoryName.includes('flavor') ||
                       categoryName.includes('ice cream');
            }
            
            // Si solo tienes el ID como string, necesitarás buscar en categories
            if (item.categoryId && typeof item.categoryId === 'string') {
                const category = categories.find(cat => cat._id === item.categoryId);
                if (category) {
                    const categoryName = category.name.toLowerCase();
                    return categoryName.includes('sabor') || 
                           categoryName.includes('helado') ||
                           categoryName.includes('flavor') ||
                           categoryName.includes('ice cream');
                }
            }
            
            // Fallback: buscar por descripción si no hay categoría clara
            if (item.description) {
                const description = item.description.toLowerCase();
                return description.includes('sabor') || 
                       description.includes('helado') ||
                       description.includes('flavor');
            }
            
            return false;
        });

        const toppingItems = activeItems.filter(item => {
            // Si tienes el objeto categoryId completo (populated)
            if (item.categoryId && typeof item.categoryId === 'object' && item.categoryId.name) {
                const categoryName = item.categoryId.name.toLowerCase();
                return categoryName.includes('topping') || 
                       categoryName.includes('complemento') ||
                       categoryName.includes('extra') ||
                       categoryName.includes('adición');
            }
            
            // Si solo tienes el ID como string, necesitarás buscar en categories
            if (item.categoryId && typeof item.categoryId === 'string') {
                const category = categories.find(cat => cat._id === item.categoryId);
                if (category) {
                    const categoryName = category.name.toLowerCase();
                    return categoryName.includes('topping') || 
                           categoryName.includes('complemento') ||
                           categoryName.includes('extra') ||
                           categoryName.includes('adición');
                }
            }
            
            // Fallback: buscar por descripción
            if (item.description) {
                const description = item.description.toLowerCase();
                return description.includes('topping') || 
                       description.includes('complemento') ||
                       description.includes('extra');
            }
            
            return false;
        });

        // Convertir a formato simple para el componente
        const processedFlavors = flavorItems.map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            extraPrice: item.extraPrice || 0,
            currentStock: item.currentStock || 0,
            isActive: item.isActive,
            isVerified: item.isVerified !== false
        }));

        const processedToppings = toppingItems.map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            extraPrice: item.extraPrice || 0.25, // Precio por defecto si no está definido
            currentStock: item.currentStock || 0,
            isActive: item.isActive,
            isVerified: item.isVerified !== false
        }));

        setFlavors(processedFlavors);
        setToppings(processedToppings);
    };

    // Filtrar sabores disponibles (con stock y activos)
    const getAvailableFlavors = () => {
        return flavors.filter(flavor => 
            flavor.isActive && 
            flavor.isVerified && 
            flavor.currentStock > 0
        );
    };

    // Filtrar toppings disponibles (con stock y activos)
    const getAvailableToppings = () => {
        return toppings.filter(topping => 
            topping.isActive && 
            topping.isVerified && 
            topping.currentStock > 0
        );
    };

    // Obtener solo los nombres de los sabores (para compatibilidad con tu código existente)
    const getFlavorNames = () => {
        return getAvailableFlavors().map(flavor => flavor.name);
    };

    // Obtener solo los nombres de los toppings (para compatibilidad con tu código existente)
    const getToppingNames = () => {
        return getAvailableToppings().map(topping => topping.name);
    };

    // Obtener precio extra de un sabor específico
    const getFlavorExtraPrice = (flavorName) => {
        const flavor = flavors.find(f => f.name === flavorName);
        return flavor ? flavor.extraPrice : 0;
    };

    // Obtener precio extra de un topping específico
    const getToppingExtraPrice = (toppingName) => {
        const topping = toppings.find(t => t.name === toppingName);
        return topping ? topping.extraPrice : 0.25; // Precio por defecto
    };

    // Verificar si un sabor está disponible
    const isFlavorAvailable = (flavorName) => {
        const flavor = flavors.find(f => f.name === flavorName);
        return flavor ? (flavor.isActive && flavor.isVerified && flavor.currentStock > 0) : false;
    };

    // Verificar si un topping está disponible
    const isToppingAvailable = (toppingName) => {
        const topping = toppings.find(t => t.name === toppingName);
        return topping ? (topping.isActive && topping.isVerified && topping.currentStock > 0) : false;
    };

    // Refrescar datos
    const refreshData = async () => {
        await Promise.all([
            fetchInventory(),
            fetchCategories()
        ]);
    };

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            await fetchCategories(); // Cargar categorías primero
            await fetchInventory();  // Luego el inventario
        };
        
        loadData();
    }, []);

    return {
        // Estados principales
        inventory,
        flavors,
        toppings,
        categories,
        isLoading,
        error,

        // Funciones de obtención de datos
        getAvailableFlavors,
        getAvailableToppings,
        getFlavorNames,
        getToppingNames,

        // Funciones de precio
        getFlavorExtraPrice,
        getToppingExtraPrice,

        // Funciones de verificación
        isFlavorAvailable,
        isToppingAvailable,

        // Funciones de actualización
        refreshData,
        fetchInventory,
        fetchCategories,

        // Setters (para control manual si es necesario)
        setFlavors,
        setToppings,
        setError,
    };
}