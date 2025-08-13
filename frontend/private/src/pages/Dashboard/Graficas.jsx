import React, { useState, useEffect } from 'react';
import './Graficas.css'
import { TrendingUp, Package, Users, DollarSign, AlertCircle, Activity } from 'lucide-react';
import { config } from '../../config';
import { useEmployeesManager } from '../../hooks/EmployeesHook/useEmployees';

import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { isAuthenticated, user, isLoading, authenticatedFetch } = useAuth();
  
  // Estados para datos del dashboard
  const [pettyCashMovements, setPettyCashMovements] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]); // Nuevo estado para eventos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = config.api.API_BASE;

  // Función para obtener movimientos de caja chica
  const fetchPettyCashData = async () => {
    try {
      const [movementsResponse, balanceResponse] = await Promise.all([
        authenticatedFetch(`${API_BASE_URL}pettyCash`),
        authenticatedFetch(`${API_BASE_URL}pettyCash/balance`)
      ]);

      if (movementsResponse.ok) {
        const movements = await movementsResponse.json();
        setPettyCashMovements(movements);
      }

      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        setCurrentBalance(balanceData.currentBalance || 0);
      }
    } catch (error) {
      console.error('Error fetching petty cash data:', error);
      setError('Error al cargar datos de caja chica');
    }
  };

  // Función para obtener eventos usando fetch directo (sin authenticatedFetch)
  const fetchEvents = async () => {
    try {
      console.log('Obteniendo eventos...');
      const response = await fetch(`${API_BASE_URL}events`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Eventos obtenidos:', data);
        setEvents(data);
      } else {
        console.error('Error al obtener eventos:', response.status);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Función para obtener empleados usando fetch directo
  const fetchEmployees = async () => {
    try {
      console.log('Obteniendo empleados...');
      const response = await fetch(`${API_BASE_URL}employees`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Empleados obtenidos:', data);
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Función para obtener clientes usando fetch directo
  const fetchCustomers = async () => {
    try {
      console.log('Obteniendo clientes...');
      const response = await fetch(`${API_BASE_URL}customers`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Clientes obtenidos:', data);
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Función para obtener inventario
  const fetchInventory = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}inventory`);
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // Función para obtener categorías
  const fetchCategories = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}category`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Cargar todos los datos
  useEffect(() => {
    console.log('useEffect ejecutado - Estado:', { isAuthenticated, isLoading, user });
    
    if (isAuthenticated && !isLoading) {
      const loadData = async () => {
        console.log('Iniciando carga de datos...');
        setLoading(true);
        
        try {
          await Promise.all([
            fetchPettyCashData(),
            fetchEvents(), // Agregar fetch de eventos
            fetchEmployees(), // Activar fetch de empleados
            fetchCustomers(), // Activar fetch de clientes
            fetchInventory(),
            fetchCategories()
          ]);
          console.log('Todos los datos cargados exitosamente');
        } catch (error) {
          console.error('Error al cargar datos:', error);
          setError('Error al cargar algunos datos del dashboard');
        }
        
        setLoading(false);
      };
      loadData();
    } else {
      console.log('No se cargan datos - Usuario no autenticado o cargando');
    }
  }, [isAuthenticated, isLoading]);

  // Procesar datos para gráficos
  const processMonthlyData = () => {
    if (!pettyCashMovements.length) return [];

    const monthlyData = {};
    
    pettyCashMovements.forEach(movement => {
      const date = new Date(movement.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expenses: 0 };
      }
      
      if (movement.type === 'income') {
        monthlyData[monthKey].income += movement.amount;
      } else {
        monthlyData[monthKey].expenses += movement.amount;
      }
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const processCategoryData = () => {
    if (!pettyCashMovements.length) return [];

    const categoryData = {
      'Ice Cream Rolls': 0,
      'Helados Premium': 0,
      'Postres Especiales': 0,
      'Bebidas Frías': 0,
      'Complementos': 0,
      'Otros': 0
    };

    console.log('Procesando movimientos de caja chica:', pettyCashMovements);

    pettyCashMovements.forEach(movement => {
      const reason = movement.reason.toLowerCase();
      let categorized = false;

      console.log(`Analizando razón: "${movement.reason}" -> "${reason}"`);

      if (reason.includes('roll') || reason.includes('helado roll')) {
        categoryData['Ice Cream Rolls'] += movement.amount;
        categorized = true;
        console.log(`Categorizado como Ice Cream Rolls: +${movement.amount}`);
      } else if (reason.includes('premium') || reason.includes('helado premium')) {
        categoryData['Helados Premium'] += movement.amount;
        categorized = true;
        console.log(`Categorizado como Helados Premium: +${movement.amount}`);
      } else if (reason.includes('postre') || reason.includes('especial')) {
        categoryData['Postres Especiales'] += movement.amount;
        categorized = true;
        console.log(`Categorizado como Postres Especiales: +${movement.amount}`);
      } else if (reason.includes('bebida') || reason.includes('fria')) {
        categoryData['Bebidas Frías'] += movement.amount;
        categorized = true;
        console.log(`Categorizado como Bebidas Frías: +${movement.amount}`);
      } else if (reason.includes('complemento') || reason.includes('extra')) {
        categoryData['Complementos'] += movement.amount;
        categorized = true;
        console.log(`Categorizado como Complementos: +${movement.amount}`);
      }

      if (!categorized) {
        categoryData['Otros'] += movement.amount;
        console.log(`Categorizado como Otros: +${movement.amount}`);
      }
    });

    console.log('Datos de categoría finales:', categoryData);

    return Object.entries(categoryData)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .filter(item => item.value > 0);
  };

  // Nueva función para procesar datos de eventos (simulando ganancias)
  const processEventsData = () => {
    if (!events.length) return [];

    console.log('Procesando eventos para ganancias:', events);

    // Simular ganancias basadas en el tipo de evento
    const eventTypeEarnings = {
      'Cumpleaños': 150000, // $150k promedio
      'Boda': 500000,       // $500k promedio
      'Corporativo': 300000, // $300k promedio
      'Festival': 800000,   // $800k promedio
      'Privado': 200000,    // $200k promedio
    };

    const earningsData = {};

    events.forEach(event => {
      const eventType = event.type || 'Privado';
      const baseEarning = eventTypeEarnings[eventType] || 150000;
      
      // Agregar variación aleatoria ±20%
      const variation = (Math.random() - 0.5) * 0.4; // -20% a +20%
      const earning = baseEarning * (1 + variation);
      
      if (!earningsData[eventType]) {
        earningsData[eventType] = 0;
      }
      
      // Solo contar eventos activos
      if (event.isActive !== false) {
        earningsData[eventType] += earning;
      }
    });

    console.log('Ganancias por tipo de evento:', earningsData);

    return Object.entries(earningsData)
      .map(([name, value]) => ({ 
        name, 
        value: Math.round(value)
      }))
      .filter(item => item.value > 0);
  };

  // Calcular estadísticas
  const calculateStats = () => {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyMovements = pettyCashMovements.filter(movement => 
      new Date(movement.date) >= currentMonth
    ).length;

    const monthlyIncome = pettyCashMovements
      .filter(movement => new Date(movement.date) >= currentMonth && movement.type === 'income')
      .reduce((sum, movement) => sum + movement.amount, 0);

    const monthlyExpenses = pettyCashMovements
      .filter(movement => new Date(movement.date) >= currentMonth && movement.type === 'expense')
      .reduce((sum, movement) => sum + movement.amount, 0);

    // Contar todos los clientes como "activos"
    const activeCustomers = customers.length;
    const verifiedCustomers = customers.filter(customer => customer.isVerified === true).length;

    console.log('Estadísticas calculadas:', {
      totalCustomers: customers.length,
      activeCustomers,
      verifiedCustomers,
      totalEmployees: employees.length,
      totalEvents: events.length // Agregar eventos
    });

    return {
      currentBalance,
      monthlyMovements,
      monthlyIncome,
      monthlyExpenses,
      totalEmployees: employees.length,
      totalCustomers: customers.length,
      verifiedCustomers: activeCustomers,
      activeCustomers,
      totalProducts: inventory.length,
      lowStockProducts: inventory.filter(item => (item.stock || 0) <= 10).length,
      totalEvents: events.length, // Total de eventos
      activeEvents: events.filter(event => event.isActive !== false).length // Eventos activos
    };
  };

  const monthlyData = processMonthlyData();
  const categoryData = processCategoryData();
  const eventsData = processEventsData(); // Usar datos de eventos en lugar de inventario
  const stats = calculateStats();

  // Configuración para gráfico de líneas (datos mensuales)
  const lineChartData = {
    labels: monthlyData.map(item => {
      const [year, month] = item.month.split('-');
      return new Date(year, month - 1).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: 'Ingresos',
        data: monthlyData.map(item => item.income),
        borderColor: '#8D6CFF',
        backgroundColor: 'rgba(141, 108, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Egresos',
        data: monthlyData.map(item => item.expenses),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tendencia Mensual de Caja Chica',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
  };

  // Configuración para gráfico de barras (categorías)
  const barChartData = {
    labels: categoryData.map(item => item.name),
    datasets: [
      {
        label: 'Monto Total',
        data: categoryData.map(item => item.value),
        backgroundColor: [
          '#8D6CFF',
          '#99DBFF',
          '#FFBAE7',
          '#B9B8FF',
          '#F2E8D5',
          '#FFD93D'
        ],
        borderColor: [
          '#7C3AED',
          '#0EA5E9',
          '#EC4899',
          '#8B5CF6',
          '#F59E0B',
          '#EAB308'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Ventas por Categoría',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
  };

  // Configuración para gráfico circular (eventos en lugar de inventario)
  const doughnutChartData = {
    labels: eventsData.map(item => item.name),
    datasets: [
      {
        data: eventsData.map(item => item.value),
        backgroundColor: [
          '#8D6CFF',
          '#99DBFF',
          '#FFBAE7',
          '#B9B8FF',
          '#F2E8D5',
          '#FFD93D'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Ganancias por Tipo de Evento', // Título cambiado
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            return context.label + ': $' + value.toLocaleString();
          }
        }
      }
    },
  };

  // Mostrar loading
  if (isLoading || loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <Activity className="animate-spin" size={32} />
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Mostrar error de autenticación
  if (!isAuthenticated) {
    return (
      <div className="dashboard-container">
        <div className="auth-required">
          <AlertCircle size={48} />
          <h2>Acceso Restringido</h2>
          <p>Debes iniciar sesión para acceder al dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="dashboard-title">
                <span className="welcome-emoji">🍦</span>
                Bienvenido a Moon Ice Cream
              </h1>
              <p className="dashboard-subtitle">Panel de control y estadísticas</p>
            </div>
            <div className="header-actions">
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="dashboard-grid">
          {/* Panel izquierdo con KPIs */}
          <aside className="kpi-section">
            <h2 className="section-title">
              <span className="title-icon">📈</span>
              Indicadores Clave
            </h2>
            
            <div className="kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon">💰</div>
                <div className="kpi-trend positive">+12%</div>
              </div>
              <div className="kpi-content">
                <h3 className="kpi-value">${stats.currentBalance.toLocaleString()}</h3>
                <p className="kpi-title">Balance Actual</p>
                <span className="kpi-subtitle">Caja chica</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon">📦</div>
                <div className="kpi-trend positive">+8%</div>
              </div>
              <div className="kpi-content">
                <h3 className="kpi-value">{stats.monthlyMovements}</h3>
                <p className="kpi-title">Movimientos</p>
                <span className="kpi-subtitle">Este mes</span>
              </div>
            </div>

            {/* Nueva KPI card para usuarios totales */}
            <div className="kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon">👥</div>
                <div className="kpi-trend positive">+15%</div>
              </div>
              <div className="kpi-content">
                <h3 className="kpi-value">{stats.totalEmployees + stats.totalCustomers}</h3>
                <p className="kpi-title">Usuarios Totales</p>
                <span className="kpi-subtitle">{stats.totalEmployees} empleados, {stats.activeCustomers} clientes</span>
              </div>
            </div>
          </aside>

          {/* Panel derecho con gráficos */}
          <main className="charts-section">
            {/* Gráfico de barras */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  <span className="chart-icon">📊</span>
                  Ventas por Categoría
                </h3>
                <div className="chart-actions">
                  <button className="chart-btn">Día</button>
                  <button className="chart-btn active">Mes</button>
                  <button className="chart-btn">Año</button>
                </div>
              </div>
              <div className="chart-container">
                {categoryData.length > 0 ? (
                  <Bar data={barChartData} options={barChartOptions} />
                ) : (
                  <div className="no-data">No hay datos de categorías disponibles</div>
                )}
              </div>
            </div>

            {/* Gráfico de líneas */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  <span className="chart-icon">📈</span>
                  Tendencia de Órdenes
                </h3>
                <div className="chart-actions">
                  <button className="chart-btn">6M</button>
                  <button className="chart-btn active">1A</button>
                  <button className="chart-btn">Todo</button>
                </div>
              </div>
              <div className="chart-container">
                {monthlyData.length > 0 ? (
                  <Line data={lineChartData} options={lineChartOptions} />
                ) : (
                  <div className="no-data">No hay datos mensuales disponibles</div>
                )}
              </div>
            </div>

            {/* Gráfico circular - Cambiado a eventos */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  <span className="chart-icon">🎉</span>
                  Ganancias por Eventos
                </h3>
              </div>
              <div className="chart-container">
                {eventsData.length > 0 ? (
                  <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                ) : (
                  <div className="no-data">No hay datos de eventos disponibles</div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;