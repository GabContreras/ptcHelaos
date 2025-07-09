import React from 'react';
import './Graficas.css';

const Graficas = () => {
  // Datos para las visualizaciones
  const ventasData = [
    { name: 'Ice Cream Rolls', valor: 75, color: '#8D6CFF' },
    { name: 'Helados Premium', valor: 65, color: '#99DBFF' },
    { name: 'Postres Especiales', valor: 85, color: '#FFBAE7' },
    { name: 'Bebidas Frías', valor: 95, color: '#B9B8FF' },
    { name: 'Complementos', valor: 55, color: '#F2E8D5' },
  ];

  const ordenesData = [
    { name: 'Ene', valor: 40 },
    { name: 'Feb', valor: 80 },
    { name: 'Mar', valor: 60 },
    { name: 'Abr', valor: 70 },
    { name: 'May', valor: 90 },
    { name: 'Jun', valor: 50 },
    { name: 'Jul', valor: 85 },
    { name: 'Ago', valor: 95 },
    { name: 'Sep', valor: 65 },
  ];

  const kpiData = [
    {
      title: 'Ventas Totales',
      value: '$24.5K',
      subtitle: 'Este mes',
      icon: '💰',
      trend: '+12%'
    },
    {
      title: 'Órdenes Completadas',
      value: '1,847',
      subtitle: 'Pedidos entregados',
      icon: '📦',
      trend: '+8%'
    },
    {
      title: 'Clientes Activos',
      value: '967',
      subtitle: 'Usuarios registrados',
      icon: '👥',
      trend: '+15%'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
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
              <button className="action-btn primary">
                <span>📊</span>
                Ver Reportes
              </button>
              <button className="action-btn secondary">
                <span>⚙️</span>
                Configuración
              </button>
            </div>
          </div>
        </header>
        
        <div className="dashboard-grid">
          {/* Panel izquierdo con KPIs */}
          <aside className="kpi-section">
            <h2 className="section-title">
              <span className="title-icon">📈</span>
              Indicadores Clave
            </h2>
            
            {kpiData.map((kpi, index) => (
              <div key={index} className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-icon">{kpi.icon}</div>
                  <div className="kpi-trend positive">{kpi.trend}</div>
                </div>
                <div className="kpi-content">
                  <h3 className="kpi-value">{kpi.value}</h3>
                  <p className="kpi-title">{kpi.title}</p>
                  <span className="kpi-subtitle">{kpi.subtitle}</span>
                </div>
              </div>
            ))}
          </aside>
          
          {/* Panel derecho con gráficos */}
          <main className="charts-section">
            {/* Gráfico de barras - CSS puro */}
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
                <div className="bar-chart">
                  {ventasData.map((item, index) => (
                    <div key={index} className="bar-item">
                      <div className="bar-info">
                        <span className="bar-label">{item.name}</span>
                        <span className="bar-value">{item.valor}%</span>
                      </div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill"
                          style={{
                            width: `${item.valor}%`,
                            backgroundColor: item.color,
                            animationDelay: `${index * 0.1}s`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Gráfico de líneas - CSS puro */}
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
                <div className="line-chart">
                  <div className="line-chart-grid">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="grid-line"></div>
                    ))}
                  </div>
                  <div className="line-chart-data">
                    <svg className="line-svg" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8D6CFF" />
                          <stop offset="100%" stopColor="#FFBAE7" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(141, 108, 255, 0.3)" />
                          <stop offset="100%" stopColor="rgba(141, 108, 255, 0.05)" />
                        </linearGradient>
                      </defs>
                      
                      {/* Área bajo la línea */}
                      <path
                        d="M0,160 L50,120 L100,140 L150,130 L200,110 L250,150 L300,115 L350,105 L400,135 L400,200 L0,200 Z"
                        fill="url(#areaGradient)"
                        className="area-fill"
                      />
                      
                      {/* Línea principal */}
                      <path
                        d="M0,160 L50,120 L100,140 L150,130 L200,110 L250,150 L300,115 L350,105 L400,135"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        fill="none"
                        className="line-path"
                      />
                      
                      {/* Puntos de datos */}
                      {ordenesData.map((point, index) => (
                        <circle
                          key={index}
                          cx={index * 50}
                          cy={200 - (point.valor * 2)}
                          r="5"
                          fill="#FFBAE7"
                          stroke="#8D6CFF"
                          strokeWidth="2"
                          className="data-point"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="line-chart-labels">
                    {ordenesData.map((point, index) => (
                      <span key={index} className="chart-label">{point.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico circular adicional */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  <span className="chart-icon">🍰</span>
                  Distribución de Productos
                </h3>
              </div>
              <div className="chart-container">
                <div className="donut-chart">
                  <div className="donut-center">
                    <div className="donut-value">2,847</div>
                    <div className="donut-label">Total Productos</div>
                  </div>
                  <div className="donut-segments">
                    {ventasData.map((item, index) => (
                      <div
                        key={index}
                        className="donut-segment"
                        style={{
                          '--segment-color': item.color,
                          '--segment-percentage': `${item.valor}%`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="donut-legend">
                    {ventasData.map((item, index) => (
                      <div key={index} className="legend-item">
                        <div 
                          className="legend-color" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="legend-text">{item.name}</span>
                        <span className="legend-percentage">{item.valor}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Graficas;