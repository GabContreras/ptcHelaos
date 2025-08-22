import { useState, useEffect } from 'react';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useInventory() {
    const [inventory, setInventory] = useState([]);
    const [flavors, setFlavors] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // GET - Obtener categorías para identificar sabores y toppings
    const fetchCategories = async () => {
        try {
            // Obtener token de autenticación si existe
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
            };
            
            // Agregar token si existe
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${API_BASE}category`, {
                method: 'GET',
                headers: headers,
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('No tienes autorización para acceder a las categorías.');
                    return [];
                }
                throw new Error(`Error al cargar las categorías: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setCategories(data);
            console.log("Categorías cargadas:", data);
            return data;
            
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    // GET - Obtener todo el inventario
    const fetchInventory = async (categoriesData = null) => {
        try {
            setIsLoading(true);
            setError('');
            
            // Obtener token de autenticación si existe
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            const headers = {
                'Content-Type': 'application/json',
            };
            
            // Agregar token si existe
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${API_BASE}inventory`, {
                method: 'GET',
                headers: headers,
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('No tienes autorización para acceder al inventario. Usando datos por defecto.');
                    // Usar datos por defecto en caso de no tener autorización
                    setInventory([]);
                    useFallbackData();
                    return;
                }
                throw new Error(`Error al cargar el inventario: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setInventory(data);
            console.log("Inventario cargado:", data);
            
            // Procesar los datos para separar sabores y toppings
            // Usar categoriesData si se proporciona, de lo contrario usar el estado actual
            const categoriesToUse = categoriesData || categories;
            processInventoryData(data, categoriesToUse);
            
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setError('No se pudo cargar el inventario. Usando datos por defecto.');
            // En caso de error, usar datos por defecto
            useFallbackData();
        } finally {
            setIsLoading(false);
        }
    };

    // Función para usar datos por defecto cuando no se puede acceder al inventario
    const useFallbackData = () => {
        console.log('Usando datos por defecto para sabores y toppings');
        
        // Datos por defecto de sabores
        const defaultFlavors = [
            { id: 'Oreo', name: 'Oreo', extraPrice: 0, isActive: true, isVerified: true },
            { id: 'Coco', name: 'Coco', extraPrice: 0, isActive: true, isVerified: true },
            { id: 'Café', name: 'Café', extraPrice: 0, isActive: true, isVerified: true },
            { id: 'Chicle', name: 'Chicle', extraPrice: 0.25, isActive: true, isVerified: true },
            { id: 'Fresa', name: 'Fresa', extraPrice: 0, isActive: true, isVerified: true },
            { id: 'Banano', name: 'Banano', extraPrice: 0, isActive: true, isVerified: true },
            { id: 'Mantequilla de maní', name: 'Mantequilla de maní', extraPrice: 0, isActive: true, isVerified: true },
            { id: 'Piña', name: 'Piña', extraPrice: 0, isActive: true, isVerified: true },
            { id: 'Nutella', name: 'Nutella', extraPrice: 0.25, isActive: true, isVerified: true }
        ];

        // Datos por defecto de toppings
        const defaultToppings = [
            { id: 'Maní', name: 'Maní', extraPrice: 0.25, isActive: true, isVerified: true },
            { id: 'Oreo', name: 'Oreo', extraPrice: 0.50, isActive: true, isVerified: true },
            { id: 'Chispas de colores', name: 'Chispas de colores', extraPrice: 0.25, isActive: true, isVerified: true },
            { id: 'Granola', name: 'Granola', extraPrice: 0.25, isActive: true, isVerified: true },
            { id: 'Krispy', name: 'Krispy', extraPrice: 0.25, isActive: true, isVerified: true },
            { id: 'Leche condensada', name: 'Leche condensada', extraPrice: 0.30, isActive: true, isVerified: true },
            { id: 'Jalea de chocolate', name: 'Jalea de chocolate', extraPrice: 0.25, isActive: true, isVerified: true },
            { id: 'Jalea de Fresa', name: 'Jalea de Fresa', extraPrice: 0.25, isActive: true, isVerified: true },
            { id: 'Caramelo', name: 'Caramelo', extraPrice: 0.25, isActive: true, isVerified: true }
        ];

        setFlavors(defaultFlavors);
        setToppings(defaultToppings);
        setError(''); // Limpiar el error ya que estamos usando datos por defecto
    };

    // Procesar datos del inventario para separar sabores y toppings
    const processInventoryData = (inventoryData, categoriesData) => {
        if (!Array.isArray(inventoryData)) {
            console.warn('Los datos del inventario no son un array:', inventoryData);
            return;
        }

        console.log('Procesando inventario con categorías:', categoriesData);

        // Filtrar solo items activos y verificados
        const activeItems = inventoryData.filter(item => 
            item.isActive === true && 
            item.isVerified !== false // Solo excluir si explícitamente es false
        );

        // Función auxiliar para determinar si un item es un sabor
        const isFlavorItem = (item) => {
            // Si tienes el objeto categoryId completo (populated)
            if (item.categoryId && typeof item.categoryId === 'object' && item.categoryId.name) {
                const categoryName = item.categoryId.name.toLowerCase();
                return categoryName.includes('sabor') || 
                       categoryName.includes('helado') ||
                       categoryName.includes('flavor') ||
                       categoryName.includes('ice cream');
            }
            
            // Si solo tienes el ID como string, buscar en categoriesData
            if (item.categoryId && typeof item.categoryId === 'string' && categoriesData) {
                const category = categoriesData.find(cat => cat._id === item.categoryId);
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
        };

        // Función auxiliar para determinar si un item es un topping
        const isToppingItem = (item) => {
            // Si tienes el objeto categoryId completo (populated)
            if (item.categoryId && typeof item.categoryId === 'object' && item.categoryId.name) {
                const categoryName = item.categoryId.name.toLowerCase();
                return categoryName.includes('topping') || 
                       categoryName.includes('complemento') ||
                       categoryName.includes('extra') ||
                       categoryName.includes('jalea') ||
                       categoryName.includes('adición');
            }
            
            // Si solo tienes el ID como string, buscar en categoriesData
            if (item.categoryId && typeof item.categoryId === 'string' && categoriesData) {
                const category = categoriesData.find(cat => cat._id === item.categoryId);
                if (category) {
                    const categoryName = category.name.toLowerCase();
                    return categoryName.includes('topping') || 
                           categoryName.includes('complemento') ||
                           categoryName.includes('extra') ||
                           categoryName.includes('jalea') ||
                           categoryName.includes('adición');
                }
            }
            
            // Fallback: buscar por descripción
            if (item.description) {
                const description = item.description.toLowerCase();
                return description.includes('topping') || 
                       description.includes('complemento') ||
                       description.includes('extra') ||
                       description.includes('jalea');
            }
            
            return false;
        };

        // Separar por categorías usando las funciones auxiliares
        const flavorItems = activeItems.filter(isFlavorItem);
        const toppingItems = activeItems.filter(isToppingItem);

        console.log('Items de sabores encontrados:', flavorItems);
        console.log('Items de toppings encontrados:', toppingItems);

        // Convertir a formato simple para el componente
        const processedFlavors = flavorItems.map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            extraPrice: item.extraPrice || 0,
            currentStock: item.currentStock || 0,
            isActive: item.isActive,
            isVerified: item.isVerified !== false,
            categoryName: getCategoryName(item.categoryId, categoriesData)
        }));

        const processedToppings = toppingItems.map(item => ({
            id: item._id,
            name: item.name,
            description: item.description,
            extraPrice: item.extraPrice || 0.25, // Precio por defecto si no está definido
            currentStock: item.currentStock || 0,
            isActive: item.isActive,
            isVerified: item.isVerified !== false,
            categoryName: getCategoryName(item.categoryId, categoriesData)
        }));

        console.log('Sabores procesados:', processedFlavors);
        console.log('Toppings procesados:', processedToppings);

        setFlavors(processedFlavors);
        setToppings(processedToppings);
    };

    // Función auxiliar para obtener el nombre de la categoría
    const getCategoryName = (categoryId, categoriesData) => {
        if (!categoryId || !categoriesData) return 'Sin categoría';
        
        if (typeof categoryId === 'object' && categoryId.name) {
            return categoryId.name;
        }
        
        if (typeof categoryId === 'string') {
            const category = categoriesData.find(cat => cat._id === categoryId);
            return category ? category.name : 'Categoría desconocida';
        }
        
        return 'Sin categoría';
    };

    // Filtrar sabores disponibles (con stock y activos)
    const getAvailableFlavors = () => {
        return flavors.filter(flavor => 
            flavor.isActive && 
            flavor.isVerified && 
            (flavor.currentStock > 0 || flavor.currentStock === undefined) // Permitir si no hay info de stock
        );
    };

    // Filtrar toppings disponibles (con stock y activos)
    const getAvailableToppings = () => {
        return toppings.filter(topping => 
            topping.isActive && 
            topping.isVerified && 
            (topping.currentStock > 0 || topping.currentStock === undefined) // Permitir si no hay info de stock
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
        return flavor ? (flavor.isActive && flavor.isVerified && (flavor.currentStock > 0 || flavor.currentStock === undefined)) : false;
    };

    // Verificar si un topping está disponible
    const isToppingAvailable = (toppingName) => {
        const topping = toppings.find(t => t.name === toppingName);
        return topping ? (topping.isActive && topping.isVerified && (topping.currentStock > 0 || topping.currentStock === undefined)) : false;
    };

    // Refrescar datos
    const refreshData = async () => {
        const categoriesData = await fetchCategories();
        await fetchInventory(categoriesData);
    };

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            const categoriesData = await fetchCategories(); // Cargar categorías primero
            await fetchInventory(categoriesData);  // Luego el inventario con las categorías
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