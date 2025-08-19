import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  RefreshCw,
  Search,
  Eye,
  X,
  Play,
  CheckCircle
} from 'lucide-react';
import OrdersCard from '../../components/Cards/OrdersCard/OrdersCard';
import { useOrder } from '../../hooks/OrdersHook/useOrder';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  
  const {
    orders,
    loading,
    error,
    success,
    fetchOrders,
    updateOrderStatus,
    clearMessages
  } = useOrder();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Cargar órdenes al montar el componente
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filtrar órdenes cuando cambien los filtros o las órdenes
  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(order => order.orderType === typeFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, typeFilter]);

  const handleOrderClick = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleRefreshOrders = () => {
    fetchOrders();
  };

  // Función para navegar a la página de nueva orden
  const handleNewOrder = () => {
    navigate('/TomaDeOrdenes');
  };

  // Función para cancelar orden
  const handleCancelOrder = async (order) => {
    // Solo permitir cancelar si no está ya cancelada
    if (order.orderStatus === 'cancelado') {
      return;
    }
    
    await updateOrderStatus(order._id, 'cancelado');
  };

  // Función para marcar como en proceso
  const handleSetInProcess = async (order) => {
    // No permitir cambio de estado si está cancelada
    if (order.orderStatus === 'cancelado') {
      return;
    }
    
    await updateOrderStatus(order._id, 'en preparación');
  };

  // Función para marcar como completado
  const handleMarkCompleted = async (order) => {
    // No permitir cambio de estado si está cancelada
    if (order.orderStatus === 'cancelado') {
      return;
    }
    
    await updateOrderStatus(order._id, 'entregado');
  };

  const handleContactClient = (order) => {
    // Crear enlace de WhatsApp
    const phone = order.customerPhone?.replace(/\D/g, '');
    const message = `Hola ${order.customerName}, te contactamos sobre tu orden #${order._id.slice(-6)}`;
    const whatsappUrl = `https://wa.me/503${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatCurrency = (amount) => {
    return `$${(amount || 0).toFixed(2)}`;
  };

  const calculateStats = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      activeOrders: orders.filter(order => 
        ['pendiente', 'recibido', 'en preparación', 'en camino'].includes(order.orderStatus)
      ).length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      averageTime: '22 min'
    };
  };

  const stats = calculateStats();

  if (loading && orders.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Header */}
      {/* Header */}
      <div className="orders-header">
       

        
        <div className="header-actions">
          <button 
            className="action-btn btn-secondary"
            onClick={handleRefreshOrders}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          
          <button 
            className="action-btn btn-primary"
            onClick={handleNewOrder}
          >
            <Plus size={16} />
            Nueva Orden
          </button>
        </div>
      </div>
      <div className="orders-header">
        <div className="header-left">
          <h1 className="header-title">Gestión de Órdenes</h1>
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-number">{stats.totalOrders}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.todayOrders}</span>
              <span className="stat-label">Hoy</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.activeOrders}</span>
              <span className="stat-label">Activas</span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="action-btn btn-secondary"
            onClick={handleRefreshOrders}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
          <button 
            className="action-btn btn-primary"
            onClick={handleNewOrder}
          >
            <Plus size={16} />
            Nueva Orden
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="orders-container">
        <div className="main-content">
          {/* Mensajes de estado */}
          {error && (
            <div className="alert alert-error">
              {error}
              <button className="alert-close" onClick={clearMessages}>×</button>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              {success}
              <button className="alert-close" onClick={clearMessages}>×</button>
            </div>
          )}

          {/* Filtros */}
          <div className="filters-section">
            <div className="search-container">
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Buscar por cliente, teléfono o ID..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="recibido">Recibido</option>
              <option value="en preparación">En Preparación</option>
              <option value="en camino">En Camino</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value="delivery">Delivery</option>
              <option value="local">Local</option>
            </select>
          </div>

          {/* Lista de órdenes */}
          <div className="orders-list">
            {!filteredOrders || filteredOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No se encontraron órdenes</h3>
                <p>
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Las órdenes aparecerán aquí cuando se carguen.'}
                </p>
                {!loading && (
                  <button 
                    className="action-btn btn-primary"
                    onClick={handleRefreshOrders}
                  >
                    <RefreshCw size={16} />
                    Cargar Órdenes
                  </button>
                )}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrdersCard
                  key={order._id}
                  order={order}
                  isExpanded={expandedOrder === order._id}
                  onToggleExpand={() => handleOrderClick(order._id)}
                  onCancelOrder={handleCancelOrder}
                  onSetInProcess={handleSetInProcess}
                  onMarkCompleted={handleMarkCompleted}
                  onContactClient={handleContactClient}
                  loading={loading}
                />
              ))
            )}
          </div>
        </div>

        {/* Panel de resumen */}
        <div className="summary-panel">
          <div className="panel-content">
            <h3>Resumen del Día</h3>
            
            <div className="daily-stats">
              <div className="daily-stat">
                <span className="daily-stat-value">{stats.todayOrders}</span>
                <span className="daily-stat-label">Órdenes completadas</span>
              </div>
              
              <div className="daily-stat">
                <span className="daily-stat-value">{formatCurrency(stats.todayRevenue)}</span>
                <span className="daily-stat-label">Ingresos del día</span>
              </div>
              
              <div className="daily-stat">
                <span className="daily-stat-value">{stats.activeOrders}</span>
                <span className="daily-stat-label">Órdenes activas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;