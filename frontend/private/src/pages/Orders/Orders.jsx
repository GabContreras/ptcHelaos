import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Copy,
  Plus,
  RefreshCw,
  Search,
  DollarSign,
  Check,
  X,
  AlertCircle,
  Truck,
  Store,
  Eye,
  Edit
} from 'lucide-react';
import { useOrder } from '../../hooks/OrdersHook/useOrder';
import OrdersCard from '../../components/Cards/OrdersCard/OrdersCard'; // CORREGIDO: Ruta simplificada
import './Orders.css';

const Orders = () => {
  // Usar el hook useOrder
  const {
    orders,
    loading,
    error,
    success,
    fetchOrders,
    updateOrderStatus,
    clearMessages
  } = useOrder();

  // Estados locales para UI
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Estados del modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Debug - agregar logs para diagnóstico
  console.log('Orders Debug:', {
    orders: orders,
    ordersLength: orders?.length,
    filteredOrders: filteredOrders,
    filteredOrdersLength: filteredOrders?.length,
    loading,
    error
  });

  // Cargar órdenes al montar el componente
  useEffect(() => {
    console.log('Ejecutando fetchOrders...');
    fetchOrders();
  }, [fetchOrders]);

  // Filtrar órdenes cuando cambien los filtros o las órdenes
  useEffect(() => {
    console.log('Aplicando filtros...');
    filterOrders();
  }, [orders, searchTerm, statusFilter, typeFilter]);

  const filterOrders = () => {
    console.log('filterOrders ejecutándose con orders:', orders);
    
    if (!orders || !Array.isArray(orders)) {
      console.log('Orders no es un array válido:', orders);
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.includes(searchTerm)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(order => order.orderType === typeFilter);
    }

    console.log('Órdenes filtradas:', filtered);
    setFilteredOrders(filtered);
  };

  const handleOrderClick = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setShowStatusModal(true);
  };

  const handleContactClient = (order) => {
    // Implementar lógica de contacto
    console.log('Contactar cliente:', order.customerName);
    // Aquí podrías abrir un modal de WhatsApp, email, etc.
  };

  const handleMarkCompleted = async (order) => {
    try {
      await updateOrderStatus(order._id, 'entregado');
    } catch (err) {
      console.error('Error al marcar como completado:', err);
    }
  };

  const confirmStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await updateOrderStatus(selectedOrder._id, newStatus);
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus('');
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  const calculateStats = () => {
    if (!orders || !Array.isArray(orders)) {
      return {
        totalOrders: 0,
        todayOrders: 0,
        activeOrders: 0,
        todayRevenue: 0,
        averageTime: '0 min'
      };
    }

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

  const StatusModal = () => {
    if (!showStatusModal) return null;

    const statusOptions = [
      { value: 'pendiente', label: 'Pendiente', icon: Clock },
      { value: 'recibido', label: 'Recibido', icon: Check },
      { value: 'en preparación', label: 'En Preparación', icon: Package },
      { value: 'en camino', label: 'En Camino', icon: Truck },
      { value: 'entregado', label: 'Entregado', icon: Check },
      { value: 'cancelado', label: 'Cancelado', icon: X }
    ];

    return (
      <div className="status-modal-overlay" onClick={() => setShowStatusModal(false)}>
        <div className="status-modal" onClick={e => e.stopPropagation()}>
          <h3>Actualizar Estado de Orden #{selectedOrder?._id?.slice(-6)}</h3>
          <div className="status-options">
            {statusOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.value}
                  className={`status-option ${newStatus === option.value ? 'selected' : ''}`}
                  onClick={() => setNewStatus(option.value)}
                >
                  <IconComponent size={16} />
                  {option.label}
                </div>
              );
            })}
          </div>
          <div className="modal-actions">
            <button 
              className="action-btn btn-secondary"
              onClick={() => setShowStatusModal(false)}
            >
              Cancelar
            </button>
            <button 
              className="action-btn btn-primary"
              onClick={confirmStatusUpdate}
              disabled={loading || newStatus === selectedOrder?.orderStatus}
            >
              {loading ? <div className="loading-spinner" /> : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const formatCurrency = (amount) => {
    return `$${(amount || 0).toFixed(2)}`;
  };

  // Renderizado condicional para debugging
  if (loading && (!orders || orders.length === 0)) {
    return (
      <div className="orders-container">
        <div className="main-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 20px' }} />
            <p>Cargando órdenes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="orders-header">
        <div className="header-left">
          <h1 className="header-title">Gestión de Órdenes</h1>
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-number">{stats.activeOrders}</span>
              <span className="stat-label">Activas</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.todayOrders}</span>
              <span className="stat-label">Hoy</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.averageTime}</span>
              <span className="stat-label">Promedio</span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="action-btn btn-secondary"
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button className="action-btn btn-primary">
            <Plus size={16} />
            Nueva Orden
          </button>
        </div>
      </div>

      <div className="orders-container">
        <div className="main-content">
          {/* Filtros */}
          <div className="filters-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
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

          {/* Mensajes de estado */}
          {error && (
            <div style={{ 
              background: '#fee2e2', 
              color: '#dc2626', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              {error}
              <button 
                onClick={clearMessages}
                style={{ 
                  marginLeft: 'auto', 
                  background: 'none', 
                  border: 'none', 
                  color: '#dc2626', 
                  cursor: 'pointer' 
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {success && (
            <div style={{ 
              background: '#d1fae5', 
              color: '#059669', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Check size={16} />
              {success}
              <button 
                onClick={clearMessages}
                style={{ 
                  marginLeft: 'auto', 
                  background: 'none', 
                  border: 'none', 
                  color: '#059669', 
                  cursor: 'pointer' 
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Lista de órdenes */}
          <div className="orders-list" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minHeight: '400px',
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '12px'
          }}>
            {console.log('Renderizando lista con filteredOrders:', filteredOrders)}
            
            {!filteredOrders || filteredOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No se encontraron órdenes</h3>
                <p>
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Aún no hay órdenes registradas. Las órdenes aparecerán aquí cuando se carguen desde la API.'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                console.log('Renderizando orden:', order);
                return (
                  <div key={order._id} style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    marginBottom: '16px'
                  }}>
                    <OrdersCard
                      order={order}
                      isExpanded={expandedOrder === order._id}
                      onToggleExpand={() => handleOrderClick(order._id)}
                      onStatusUpdate={handleStatusUpdate}
                      onContactClient={handleContactClient}
                      onMarkCompleted={handleMarkCompleted}
                      loading={loading}
                    />
                  </div>
                );
              })
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
            
            <button className="action-btn btn-primary" style={{ width: '100%' }}>
              <Eye size={16} />
              Ver Reportes
            </button>
          </div>
        </div>
      </div>

      {/* Modal de actualización de estado */}
      <StatusModal />
    </>
  );
};

export default Orders;